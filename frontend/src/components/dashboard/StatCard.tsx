interface StatCardProps {
  title: string;
  value: string | number;
  color: string;
}

export default function StatCard({
  title,
  value,
  color,
}: StatCardProps) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
      <p className="text-sm text-slate-400">
        {title}
      </p>

      <h2
        className={`mt-4 text-4xl font-bold ${color}`}
      >
        {value}
      </h2>
    </div>
  );
}
