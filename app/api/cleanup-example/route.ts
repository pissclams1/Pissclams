import { NextResponse } from 'next/server'

export function GET() {
  return NextResponse.json({
    message: 'Submit a CSV to /api/cleanup-jobs using the intake form.',
    csvColumns: 'date,description,amount'
  })
}
