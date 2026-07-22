export default function Card({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-2xl shadow-[0_6px_20px_rgba(0,0,0,0.06)] p-6">
      {children}
    </div>
  );
}