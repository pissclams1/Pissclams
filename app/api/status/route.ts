import { NextResponse } from 'next/server'

export function GET() {
  return NextResponse.json({ product: 'Cleanup Desk', status: 'backend online' })
}
