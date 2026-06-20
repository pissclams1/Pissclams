import { NextResponse } from 'next/server'

export function GET() {
  return NextResponse.json({ marker: 'cleanup-desk' })
}
