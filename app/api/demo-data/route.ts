import { NextResponse } from 'next/server'

export function GET() {
  return NextResponse.json({ endpoint: '/api/cleanup-jobs' })
}
