import { NextResponse } from 'next/server'

export function GET() {
  return NextResponse.json({ target: 'bookkeepers and small CPA firms' })
}
