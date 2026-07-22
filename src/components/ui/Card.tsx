type Props = {
  children: React.ReactNode
}

export default function Card({ children }: Props) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-neutral-100 overflow-hidden">
      {children}
    </div>
  )
}