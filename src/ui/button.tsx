export default function Button({
  children,
  variant = "primary",
}: {
  children: React.ReactNode;
  variant?: "primary" | "secondary";
}) {
  if (variant === "secondary") {
    return (
      <button className="px-6 py-3 border border-[#EAEAEA] rounded-xl bg-white hover:bg-gray-50 transition">
        {children}
      </button>
    );
  }

  return (
    <button className="px-6 py-3 rounded-xl bg-[#FF6A3D] text-white hover:bg-[#E85C33] transition font-medium">
      {children}
    </button>
  );
}