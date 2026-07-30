"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"

type Props = {
  onClose: () => void
  onSelect: (date: Date) => void
}

export default function DatePickerModal({ onClose, onSelect }: Props) {
  const today = new Date()

  const [currentMonth, setCurrentMonth] = useState(
    new Date(today.getFullYear(), today.getMonth(), 1)
  )

  function getDaysInMonth(date: Date) {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)

    const days = []

    const startDay = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1

    for (let i = 0; i < startDay; i++) {
      days.push(null)
    }

    for (let d = 1; d <= lastDay.getDate(); d++) {
      days.push(new Date(year, month, d))
    }

    return days
  }

  function isPast(date: Date) {
    return date < new Date(today.setHours(0, 0, 0, 0))
  }

  const days = getDaysInMonth(currentMonth)

  function handleSelect(date: Date) {
    if (isPast(date)) return
    onSelect(date)
    onClose()
  }

  function formatMonth(date: Date) {
    return date.toLocaleDateString("es-CO", {
      month: "long",
      year: "numeric",
    })
  }

  function changeMonth(offset: number) {
    setCurrentMonth(
      new Date(
        currentMonth.getFullYear(),
        currentMonth.getMonth() + offset,
        1
      )
    )
  }

  return (
    <div style={overlay} onClick={onClose}>
      <div style={drawer} onClick={(e) => e.stopPropagation()}>

        {/* HEADER */}
        <div style={header}>
          <button onClick={() => changeMonth(-1)}>
            <ChevronLeft size={20} strokeWidth={1.5} />
          </button>

          <div style={monthLabel}>
            {formatMonth(currentMonth)}
          </div>

          <button onClick={() => changeMonth(1)}>
            <ChevronRight size={20} strokeWidth={1.5} />
          </button>
        </div>

        {/* WEEK DAYS */}
        <div style={weekRow}>
          {["L", "M", "M", "J", "V", "S", "D"].map((d, i) => (
  <div key={i} style={weekDay}>{d}</div>
))}
        </div>

        {/* DAYS */}
        <div style={grid}>
          {days.map((day, i) => {
            if (!day) return <div key={i} />

            const disabled = isPast(day)

            return (
              <button
                key={i}
                onClick={() => handleSelect(day)}
                style={{
                  ...dayBtn,
                  opacity: disabled ? 0.3 : 1,
                  cursor: disabled ? "not-allowed" : "pointer",
                }}
              >
                {day.getDate()}
              </button>
            )
          })}
        </div>

        {/* FOOTER */}
        <button onClick={onClose} style={closeBtn}>
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
}

const header: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: 16,
}

const monthLabel: React.CSSProperties = {
  fontWeight: 600,
  fontSize: 16,
}

const weekRow: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(7, 1fr)",
  marginBottom: 8,
}

const weekDay: React.CSSProperties = {
  textAlign: "center",
  fontSize: 12,
  opacity: 0.6,
}

const grid: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(7, 1fr)",
  gap: 6,
}

const dayBtn: React.CSSProperties = {
  height: 40,
  borderRadius: 10,
  border: "none",
  background: "#f5f5f5",
  fontSize: 14,
}

const closeBtn: React.CSSProperties = {
  marginTop: 16,
  width: "100%",
  padding: 12,
  borderRadius: 12,
  border: "none",
  background: "#eee",
}