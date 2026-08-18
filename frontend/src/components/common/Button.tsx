interface ButtonProps {
    text: string;
    onClick?: () => void;
    variant?: "primary" | "secondary";
  }
  
  export default function Button({
    text,
    onClick,
    variant = "primary",
  }: ButtonProps) {
    const styles =
      variant === "primary"
        ? "bg-cyan-500 hover:bg-cyan-600 text-white"
        : "border border-cyan-500 text-cyan-400 hover:bg-cyan-500 hover:text-white";
  
    return (
      <button
        onClick={onClick}
        className={`rounded-xl px-6 py-3 font-semibold transition ${styles}`}
      >
        {text}
      </button>
    );
  }