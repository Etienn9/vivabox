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
        action: "pay",
        ...body,
      }),
    })

    const data = await response.json()

    return NextResponse.json(data)

  } catch (error) {
    return NextResponse.json({ ok: false, error: "SERVER_ERROR" })
  }
}