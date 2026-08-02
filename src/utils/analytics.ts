type EventPayload = Record<string, unknown>

export function track(event: string, payload?: EventPayload) {
  if (typeof window === "undefined") return

  const w = window as typeof window & { dataLayer?: unknown[] }
  w.dataLayer = w.dataLayer || []
  w.dataLayer.push({ event, ...payload })

  if (process.env.NODE_ENV !== "production") {
    console.debug("[analytics]", event, payload ?? {})
  }
}
