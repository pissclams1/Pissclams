import { NextResponse } from 'next/server'

export function GET() {
  return NextResponse.json({ packet: 'cleanup review packet', endpoint: '/api/cleanup-jobs' })
}
