import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const body = await req.json()

    const response = await fetch(process.env.APPS_SCRIPT_URL!, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        action: "start",
        ...body,
      }),
    })

    const text = await response.text()
console.log("RAW RESPONSE:", text)

let data

try {
  data = JSON.parse(text)
} catch (e) {
  console.error("JSON PARSE ERROR:", e)
  return NextResponse.json({ ok: false, error: "INVALID_JSON_FROM_GAS" })
}

    return NextResponse.json(data)

  } catch (error) {
    return NextResponse.json({ ok: false, error: "SERVER_ERROR" })
  }
}