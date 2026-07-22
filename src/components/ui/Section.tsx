type Props = {
  children: React.ReactNode
}

export default function Section({ children }: Props) {
  return (
    <section className="py-[120px]">
      <div className="container">
        {children}
      </div>
    </section>
  )
}