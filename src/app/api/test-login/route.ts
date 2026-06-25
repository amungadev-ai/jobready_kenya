import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    // Step 0: parse body safely
    let body: any
    try {
      body = await req.json()
    } catch (e: any) {
      return NextResponse.json({ step: 'parse', error: 'Could not parse JSON body', detail: e.message })
    }

    const { email, password } = body
    return NextResponse.json({ step: 'parsed', email: email || '(missing)', hasPassword: !!password })

    // --- We'll add DB steps back once we confirm basic parsing works ---
  } catch (err: any) {
    return NextResponse.json({ step: 'exception', error: err?.message || String(err), code: err?.code }, { status: 500 })
  }
}

// Simple GET to test the endpoint is alive
export async function GET() {
  return NextResponse.json({ alive: true, timestamp: new Date().toISOString() })
}