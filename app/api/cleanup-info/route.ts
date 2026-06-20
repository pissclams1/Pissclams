import { NextResponse } from 'next/server'

export function GET() {
  return NextResponse.json({
    product: 'Cleanup Desk',
    route: '/api/cleanup-jobs',
    input: 'multipart form data with CSV file',
    output: 'review packet JSON'
  })
}
