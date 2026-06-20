import { NextResponse } from 'next/server'

export function GET() {
  return NextResponse.json({ release: 'cleanup-desk', committed: true })
}
