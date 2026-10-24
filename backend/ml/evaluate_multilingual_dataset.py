"""Evaluate GuardianAI's English classifier on translated Hindi/Hinglish samples.

This is an offline evaluation utility, not part of the production request path.
It deliberately reports translation failures separately and never counts them
as successful model predictions.

Install: pip install datasets pandas scikit-learn deep-translator joblib
Run from the repository root:
  python backend/ml/evaluate_multilingual_dataset.py --model backend/models/guardianai_tfidf_char_word_v3_weighted.joblib
Or set GUARDIANAI_MODEL_PATH to the model file.
The dataset is downloaded from textdetox/multilingual_toxicity_dataset by
the Hugging Face datasets library. Limit sample size to keep translation calls
reasonable; --per-class defaults to 50 for each language.
"""
from __future__ import annotations

import argparse
import json
import os
import time
from pathlib import Path

import joblib
import pandas as pd
from datasets import load_dataset
from deep_translator import GoogleTranslator
from sklearn.metrics import (
    accuracy_score,
    confusion_matrix,
    precision_recall_fscore_support,
)


DATASET_ID = "textdetox/multilingual_toxicity_dataset"
LANGUAGE_SPLITS = {"hi": "Hindi (Devanagari)", "hin": "Hinglish (Roman)"}
HARMFUL_LABELS = {"cyberbullying", "offensive", "toxic", "hate"}
SAFE_LABELS = {"safe", "normal", "non-toxic", "nontoxic", "0", "false"}


def to_binary_prediction(label: object) -> int:
    """Map GuardianAI's multiclass output to binary harmful/not-harmful."""
    normalized = str(label).strip().lower()
    if normalized in SAFE_LABELS:
        return 0
    if normalized in HARMFUL_LABELS:
        return 1
    raise ValueError(
        f"Unknown model label {label!r}; update the mapping rather than "
        "silently counting it as harmful."
    )


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--model", default=os.getenv("GUARDIANAI_MODEL_PATH"))
    parser.add_argument("--per-class", type=int, default=50)
    parser.add_argument("--delay", type=float, default=0.25)
    parser.add_argument("--output", default="multilingual_benchmark_results.csv")
    parser.add_argument("--seed", type=int, default=42)
    args = parser.parse_args()

    if args.per_class < 1:
        parser.error("--per-class must be at least 1")

    model_path = args.model
    if not model_path:
        parser.error(
            "Provide --model PATH or set GUARDIANAI_MODEL_PATH. "
            "This script does not download private model weights implicitly."
        )
    if not Path(model_path).is_file():
        parser.error(f"Model file not found: {model_path}")

    print(f"Loading model: {model_path}")
    model = joblib.load(model_path)
    translator = GoogleTranslator(source="auto", target="en")
    rows: list[dict] = []

    for split, language_name in LANGUAGE_SPLITS.items():
        print(f"Loading dataset split: {split} ({language_name})")
        data = load_dataset(DATASET_ID, split=split)
        frame = data.to_pandas()
        if not {"text", "toxic"}.issubset(frame.columns):
            raise RuntimeError(
                f"Unexpected schema for {split}: {list(frame.columns)}"
            )

        selected = []
        for gold_label in (0, 1):
            group = frame[frame["toxic"] == gold_label]
            if group.empty:
                continue
            selected.append(
                group.sample(
                    n=min(args.per_class, len(group)),
                    random_state=args.seed,
                )
            )
        sample = pd.concat(selected).sample(frac=1, random_state=args.seed)
        print(
            f"Selected {len(sample)} samples "
            f"(label counts: {sample['toxic'].value_counts().to_dict()})"
        )

        for row_number, record in enumerate(sample.to_dict("records"), start=1):
            original = str(record["text"]).strip()
            gold = int(record["toxic"])
            translated = ""
            prediction = None
            status = "ok"
            error = ""
            try:
                translated = translator.translate(original) or ""
                if not translated.strip():
                    status = "translation_failed"
                    error = "Translator returned empty text"
                else:
                    predicted_label = model.predict([translated.strip()])[0]
                    prediction = to_binary_prediction(predicted_label)
            except Exception as exc:  # report individual failures; keep benchmark running
                status = "translation_or_inference_failed"
                error = f"{type(exc).__name__}: {str(exc)[:250]}"

            rows.append({
                "language_split": split,
                "language_name": language_name,
                "dataset_row": str(row_number),
                "gold_toxic": gold,
                "predicted_harmful": prediction,
                "status": status,
                "original_text": original,
                "translated_text": translated,
                "error": error,
            })
            if args.delay > 0:
                time.sleep(args.delay)

        current = pd.DataFrame(
            [r for r in rows if r["language_split"] == split]
        )
        scored = current[current["status"] == "ok"]
        print(
            f"{split}: attempted={len(current)}, scored={len(scored)}, "
            f"failed={len(current) - len(scored)}"
        )
        if not scored.empty:
            y_true = scored["gold_toxic"].astype(int)
            y_pred = scored["predicted_harmful"].astype(int)
            precision, recall, f1, _ = precision_recall_fscore_support(
                y_true, y_pred, average="binary", zero_division=0
            )
            print(json.dumps({
                "split": split,
                "accuracy": round(float(accuracy_score(y_true, y_pred)), 4),
                "toxic_precision": round(float(precision), 4),
                "toxic_recall": round(float(recall), 4),
                "toxic_f1": round(float(f1), 4),
                "confusion_matrix_true_rows_pred_columns_0_1": confusion_matrix(
                    y_true, y_pred, labels=[0, 1]
                ).tolist(),
            }, ensure_ascii=False))

    output = Path(args.output)
    output.parent.mkdir(parents=True, exist_ok=True)
    result_frame = pd.DataFrame(rows)
    result_frame.to_csv(output, index=False, encoding="utf-8-sig")
    print(f"Detailed per-example report saved to: {output.resolve()}")
    print("Do not treat this small, translated sample as a final model score.")
    print("Inspect translation failures and false negatives before changing models.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
