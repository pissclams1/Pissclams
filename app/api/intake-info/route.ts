import { NextResponse } from 'next/server'

export function GET() {
  return NextResponse.json({ intake: '/intake', method: 'multipart form POST' })
}
