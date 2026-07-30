type Props = {
  className?: string;
};

export default function BrandDots({ className = "" }: Props) {
  return (
    <div className={`flex gap-1.5 mb-3 ${className}`}>
      <span className="w-2 h-2 rounded-full bg-primary" />
      <span className="w-2 h-2 rounded-full bg-accent-red" />
      <span className="w-2 h-2 rounded-full bg-accent-green" />
      <span className="w-2 h-2 rounded-full bg-accent-blue" />
    </div>
  );
}
