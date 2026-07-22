"use client"

import { useState } from "react"

type Props = {
  onClose: () => void
  onConfirm: (times: string[]) => void
}

export default function TimePickerModal({ onClose, onConfirm }: Props) {
  const hours = Array.from({ length: 12 }, (_, i) => i + 9) // 9 → 20

  const [selected, setSelected] = useState<number[]>([])

  function toggleHour(h: number) {
    if (selected.includes(h)) {
      setSelected(selected.filter(x => x !== h))
      return
    }

    if (selected.length >= 2) return

    setSelected([...selected, h].sort((a, b) => a - b))
  }

  function handleConfirm() {
    if (selected.length === 0) return

    const formatted = selected.map(h => `${h}:00`)
    onConfirm(formatted)
    onClose()
  }

  return (
    <div style={overlay} onClick={onClose}>
      <div style={drawer} onClick={(e) => e.stopPropagation()}>

        {/* TITLE */}
        <h3 style={title}>Elige la hora</h3>

        {/* GRID */}
        <div style={grid}>
          {hours.map((h) => {
            const isSelected = selected.includes(h)

            return (
              <button
                key={h}
                onClick={() => toggleHour(h)}
                style={{
                  ...hourBtn,
                  background: isSelected ? "#111" : "#f5f5f5",
                  color: isSelected ? "#fff" : "#111",
                }}
              >
                {h}:00
              </button>
            )
          })}
        </div>

        {/* INFO */}
        <p style={info}>
          Puedes elegir hasta 2 horarios
        </p>

        {/* CTA */}
        <button
          onClick={handleConfirm}
          disabled={selected.length === 0}
          style={{
            ...confirmBtn,
            opacity: selected.length === 0 ? 0.4 : 1,
          }}
        >
          Confirmar horario
        </button>

        {/* CANCEL */}
        <button onClick={onClose} style={cancelBtn}>
          Cancelar
        </button>

      </div>
    </div>
  )
}

/* ---------- STYLES ---------- */

const overlay: React.CSSProperties = {
  position: "fixed",
  inset: 0,
  background: "rgba(0,0,0,0.25)",
  display: "flex",
  alignItems: "flex-end",
  justifyContent: "center",
  zIndex: 3000,
}

const drawer: React.CSSProperties = {
  width: "100%",
  maxWidth: 500,
  background: "#fff",
  borderRadius: "28px 28px 0 0",
  padding: "24px 20px 30px",
  textAlign: "center",
}

const title: React.CSSProperties = {
  fontSize: 18,
  fontWeight: 600,
  marginBottom: 16,
}

const grid: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(3, 1fr)",
  gap: 10,
  marginBottom: 16,
}

const hourBtn: React.CSSProperties = {
  padding: "12px 0",
  borderRadius: 12,
  border: "none",
  fontWeight: 500,
  fontSize: 14,
}

const info: React.CSSProperties = {
  fontSize: 12,
  opacity: 0.6,
  marginBottom: 16,
}

const confirmBtn: React.CSSProperties = {
  width: "100%",
  padding: 14,
  borderRadius: 12,
  border: "none",
  background: "#111",
  color: "#fff",
  fontSize: 15,
  fontWeight: 600,
  marginBottom: 10,
}

const cancelBtn: React.CSSProperties = {
  fontSize: 13,
  background: "none",
  border: "none",
  color: "#888",
}