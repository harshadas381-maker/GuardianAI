interface FeatureCardProps {
    title: string;
    description: string;
    icon: string;
  }
  
  export default function FeatureCard({
    title,
    description,
    icon,
  }: FeatureCardProps) {
    return (
      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 transition hover:border-cyan-500 hover:-translate-y-2">
        <div className="text-5xl">{icon}</div>
  
        <h3 className="mt-4 text-2xl font-bold text-white">
          {title}
        </h3>
  
        <p className="mt-3 text-slate-400">
          {description}
        </p>
      </div>
    );
  }