type Props = {
  children: React.ReactNode
  variant?: "primary" | "secondary"
}

export default function Button({ children, variant = "primary" }: Props) {

  const base =
    "inline-flex items-center justify-center rounded-xl px-6 py-4 text-[16px] font-medium transition"

  const styles = {
    primary: "bg-[#FF6A3D] text-white hover:bg-[#E85C33]",
    secondary: "bg-white border border-neutral-300 hover:bg-neutral-50"
  }

  return (
    <button className={`${base} ${styles[variant]}`}>
      {children}
    </button>
  )
}