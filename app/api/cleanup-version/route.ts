import { NextResponse } from 'next/server'

export function GET() {
  return NextResponse.json({ version: 'cleanup-desk-mvp-1' })
}
