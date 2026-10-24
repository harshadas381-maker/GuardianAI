# Hindi and Hinglish toxicity benchmark

This benchmark evaluates the current GuardianAI English classifier behind the
translation step. It is intentionally an offline script and does not change the
production API or replace the deployed model.

## Dataset

- Source: [TextDetox multilingual toxicity dataset](https://huggingface.co/datasets/textdetox/multilingual_toxicity_dataset)
- `hi`: Hindi text, 5,000 rows.
- `hin`: Hinglish/Roman Hindi, 4,363 rows.
- Columns: `text` and binary `toxic`.
- The dataset is binary; GuardianAI's five-class labels are mapped to
  harmful/not-harmful only for this evaluation. It does not validate the
  individual Cyberbullying/Offensive/Toxic/Hate distinctions.
- This dataset does not include Marathi. Use a separate, labelled Marathi
  benchmark (for example the official HASOC FIRE datasets) before making
  claims about Marathi performance.

## Run

Install the evaluation-only dependencies:

```bash
pip install datasets pandas scikit-learn deep-translator joblib
```

Then from the repository root:

```bash
python backend/ml/evaluate_multilingual_dataset.py --model backend/models/guardianai_tfidf_char_word_v3_weighted.joblib --per-class 50
```

If the model is stored elsewhere, set `GUARDIANAI_MODEL_PATH` or pass
`--model PATH`. The script downloads dataset rows through Hugging Face and
uses Google Translate for each sampled text, so it needs internet access.
Translation providers can rate-limit requests; failed rows are reported
separately and are not counted as model predictions.

## How to interpret results

- Toxic precision: of texts predicted harmful, how many are labelled toxic.
- Toxic recall: of toxic texts, how many were predicted harmful. Low recall
  means the model is missing harmful content.
- Toxic F1: harmonic mean of toxic precision and recall.
- Confusion matrix order is true rows, predicted columns, with labels
  `0=non-toxic`, `1=toxic`.
- Review false negatives and translated text manually. Translation can soften
  insults, change targets, or remove cultural context.
- Start with a small sample; increase `--per-class` only after the run is
  stable. A translated 100-row sample is a diagnostic baseline, not a
  representative performance claim.
- Do not retrain or deploy a replacement model based on this benchmark alone.
  Keep a separate held-out test set and compare the current model and candidate
  on the same examples.
