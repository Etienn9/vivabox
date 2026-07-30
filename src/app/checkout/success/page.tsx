"use client"

import { Suspense, useState, useRef } from "react"
import { useSearchParams } from "next/navigation"
import { User, Gift, Package } from "lucide-react"
import CheckoutProgress from "../CheckoutProgress"

import DatePickerModal from "@/components/ui/DatePickerModal"
import TimePickerModal from "@/components/ui/TimePickerModal"

type Type = "self" | "gift"

export default function SuccessPage() {
  return (
    <Suspense fallback={null}>
      <SuccessPageContent />
    </Suspense>
  )
}

function SuccessPageContent() {
  const searchParams = useSearchParams()

  const ventaId = searchParams.get("ventaId") || ""

  // 🔥 NORMALIZACIÓN CRÍTICA
  const deliveryTypeRaw = searchParams.get("deliveryType") || "digital"
  const deliveryType =
    deliveryTypeRaw === "physical" ? "fisico" : "digital"

  const isPhysical = deliveryType === "fisico"

  const [type, setType] = useState<Type | null>(null)

  // contacto único
  const [nombre, setNombre] = useState("")
  const [contacto, setContacto] = useState("")

  // delivery
  const [schedule, setSchedule] = useState(false)
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [selectedTime, setSelectedTime] = useState<string | null>(null)

  const [city, setCity] = useState("")
  const [address, setAddress] = useState("")
  const [addressExtra, setAddressExtra] = useState("")

  // message
  const [para, setPara] = useState("")
  const [de, setDe] = useState("")
  const [mensaje, setMensaje] = useState("")

  const [openDate, setOpenDate] = useState(false)
  const [openTime, setOpenTime] = useState(false)

  const [loading, setLoading] = useState(false)

  const idempotencyKeyRef = useRef<string | null>(null)
  const isSubmittingRef = useRef(false)

  function getIdempotencyKey() {
    if (!idempotencyKeyRef.current) {
      idempotencyKeyRef.current = crypto.randomUUID()
    }
    return idempotencyKeyRef.current
  }

  function isValid() {
    if (!ventaId || !type) return false

    if (type === "gift" && (!nombre || !contacto)) return false

    if (type === "self" && !contacto) return false

    if (isPhysical && (!city || !address)) return false

    if (!isPhysical && schedule && (!selectedDate || !selectedTime)) return false

    return true
  }

  function buildPayload() {
  let fecha_envio = null
  let hora_envio = null

  if (schedule && selectedDate && selectedTime) {
    const [h, m] = selectedTime.split(":")
    const dateObj = new Date(
      selectedDate.getFullYear(),
      selectedDate.getMonth(),
      selectedDate.getDate(),
      Number(h),
      Number(m)
    )

    const year = selectedDate.getFullYear()
const month = String(selectedDate.getMonth() + 1).padStart(2, "0")
const day = String(selectedDate.getDate()).padStart(2, "0")

fecha_envio = `${year}-${month}-${day}`
    hora_envio = selectedTime
  }

  return {
    ventaId,

    deliveryType: isPhysical ? "physical" : "digital",

    items: [
      {
        // 👇 NOUVELLE LOGIQUE
        para: para || "",          // destinataire
        de: de || "",              // qui envoie

        beneficiario: type === "self"
  ? "self"
  : nombre || "",

contacto: contacto || "",

        mensaje: mensaje || "",

        direccion: isPhysical ? address : "",
        ciudad: isPhysical ? city : "",
        detalles: addressExtra || "",

        programado: schedule,
        fecha_envio,
        hora_envio,
      },
    ],
  }
}

  async function handleSubmit() {
    if (isSubmittingRef.current) return
    if (!isValid()) return alert("Completa los datos")

    isSubmittingRef.current = true
    setLoading(true)

    try {
      const res = await fetch("/api/checkout/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(buildPayload()),
      })

      const data = await res.json()

      if (!data.ok) {
        alert(data.error || "Error")
        setLoading(false)
        isSubmittingRef.current = false
        return
      }

      window.location.reload()
    } catch {
      alert("Error")
      setLoading(false)
      isSubmittingRef.current = false
    }
  }

  function formatDate(date: Date) {
    return date.toLocaleDateString("es-CO", {
      day: "numeric",
      month: "short",
    })
  }

  const ctaLabel =
    deliveryType === "digital" && !schedule
      ? "Enviar ahora"
      : "Confirmar envío"

  return (
    <>
      <CheckoutProgress current="enviar" />

      <div className="max-w-[640px] mx-auto py-8 px-4 space-y-8 pb-32">

        {/* HEADER */}
        <div className="text-center space-y-2">
          <p className="text-sm text-green-600 font-medium">Pago confirmado</p>
          <h1 className="text-2xl font-semibold flex items-center justify-center gap-2">
            <Package size={20} strokeWidth={1.5} />
            {type === "self"
              ? "Tu Vivabox está lista"
              : "Tu regalo está listo"}
          </h1>
        </div>

        {/* STEP 1 */}
        <div className="bg-white border-2 border-[#fe842f] rounded-2xl p-5 space-y-4">
          <p className="font-semibold">¿Para quién es?</p>

          <div className="space-y-2">
            <button
              onClick={() => setType("self")}
              className={`p-3 border rounded-xl w-full flex gap-2 ${
                type === "self" ? "bg-orange-50 border-[#fe842f]" : ""
              }`}
            >
              <User size={16} strokeWidth={1.5} /> Para mí
            </button>

            <button
              onClick={() => setType("gift")}
              className={`p-3 border rounded-xl w-full flex gap-2 ${
                type === "gift" ? "bg-orange-50 border-[#fe842f]" : ""
              }`}
            >
              <Gift size={16} strokeWidth={1.5} /> Es un regalo
            </button>
          </div>
        </div>

        {/* STEP 2 */}
        {type && (
          <div className="bg-white border rounded-2xl p-5 space-y-4">

            <p className="font-semibold">
              {isPhysical
                ? "¿A quién y a dónde enviamos?"
                : "¿A quién enviamos?"}
            </p>

            {type === "gift" && (
              <>
                <input
                  placeholder="Nombre"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  className="w-full border px-3 py-2 rounded-lg"
                />

                <input
                  placeholder="Número de contacto (WhatsApp)"
                  value={contacto}
                  onChange={(e) => setContacto(e.target.value)}
                  className="w-full border px-3 py-2 rounded-lg"
                />
              </>
            )}

            {type === "self" && (
  <input
    placeholder="Número de contacto (WhatsApp)"
    value={contacto}
    onChange={(e) => setContacto(e.target.value)}
    className="w-full border px-3 py-2 rounded-lg"
  />
)}
            {isPhysical && (
              <>
                <div className="pt-2" />

                <input
                  placeholder="Ciudad"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full border px-3 py-2 rounded-lg"
                />

                <input
                  placeholder="Dirección"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full border px-3 py-2 rounded-lg"
                />

                <input
                  placeholder="Complemento"
                  value={addressExtra}
                  onChange={(e) => setAddressExtra(e.target.value)}
                  className="w-full border px-3 py-2 rounded-lg"
                />
              </>
            )}

            {!isPhysical && (
              <>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setSchedule(false)}
                    className={`p-3 border rounded-xl ${
                      !schedule ? "bg-orange-50 border-[#fe842f]" : ""
                    }`}
                  >
                    Enviar ahora
                  </button>

                  <button
                    onClick={() => setSchedule(true)}
                    className={`p-3 border rounded-xl ${
                      schedule ? "bg-orange-50 border-[#fe842f]" : ""
                    }`}
                  >
                    Programar
                  </button>
                </div>

                {schedule && (
                  <div className="space-y-3">
                    <button
                      onClick={() => setOpenDate(true)}
                      className="w-full border rounded-xl py-3"
                    >
                      {selectedDate
                        ? formatDate(selectedDate)
                        : "Elegir fecha"}
                    </button>

                    {selectedDate && (
                      <button
                        onClick={() => setOpenTime(true)}
                        className="w-full border rounded-xl py-3"
                      >
                        {selectedTime || "Elegir hora"}
                      </button>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* MENSAJE */}
        {type === "gift" && (
          <div className="bg-white border rounded-2xl p-5 space-y-3">
            <p className="font-semibold">Agrega un mensaje (opcional)</p>

            <input
              placeholder="Para"
              value={para}
              onChange={(e) => setPara(e.target.value)}
              className="w-full border px-3 py-2 rounded-lg"
            />

            <input
              placeholder="De"
              value={de}
              onChange={(e) => setDe(e.target.value)}
              className="w-full border px-3 py-2 rounded-lg"
            />

            <textarea
              placeholder="Escribe tu mensaje"
              value={mensaje}
              onChange={(e) => setMensaje(e.target.value)}
              maxLength={200}
              className="w-full border px-3 py-2 rounded-lg"
            />

            <p className="text-sm text-gray-500">
              Lo verá cuando abra su Vivabox 💛
            </p>
          </div>
        )}
      </div>

      {openDate && (
        <DatePickerModal
          onClose={() => setOpenDate(false)}
          onSelect={(d) => {
            setSelectedDate(d)
            setOpenDate(false)
          }}
        />
      )}

      {openTime && (
        <TimePickerModal
          onClose={() => setOpenTime(false)}
          onConfirm={(times) => {
            setSelectedTime(times[0])
            setOpenTime(false)
          }}
        />
      )}

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4">
        <button
          onClick={handleSubmit}
          disabled={!isValid() || loading}
          className="w-full bg-[#fe842f] text-white py-4 rounded-xl"
        >
          {loading ? "Procesando..." : ctaLabel}
        </button>
      </div>
    </>
  )
}