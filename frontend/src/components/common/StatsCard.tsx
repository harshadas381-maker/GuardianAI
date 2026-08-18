interface StatsCardProps {
    number: string;
    title: string;
  }
  
  export default function StatsCard({
    number,
    title,
  }: StatsCardProps) {
    return (
      <div className="rounded-2xl bg-slate-900 border border-slate-800 p-8 text-center hover:border-cyan-500 transition">
        <h2 className="text-5xl font-bold text-cyan-400">
          {number}
        </h2>
  
        <p className="mt-4 text-slate-300">
          {title}
        </p>
      </div>
    );
  }