import { NextResponse } from 'next/server'

export const runtime = 'nodejs'

type ParsedTransaction = {
  date: string
  description: string
  amount: number
  prepHint: string
  risk: string
}

function suggestPrep(description: string) {
  const d = description.toLowerCase()
  if (d.includes('amazon')) return 'Request receipt or business purpose'
  if (d.includes('uber') || d.includes('lyft')) return 'Confirm purpose before import'
  if (d.includes('stripe') || d.includes('square')) return 'Match payout detail before import'
  if (d.includes('adobe') || d.includes('google') || d.includes('microsoft')) return 'Likely recurring vendor; review support'
  if (d.includes('payroll') || d.includes('gusto') || d.includes('adp')) return 'Compare to payroll report'
  return 'Needs reviewer context'
}

function parseCsv(text: string): ParsedTransaction[] {
  const lines = text.split(/\r?\n/).filter(Boolean)
  return lines.slice(1).map((line) => {
    const cols = line.split(',').map((x) => x.trim().replace(/^"|"$/g, ''))
    const [date = 'Unknown date', description = 'Unknown vendor', amountRaw = '0'] = cols
    const amount = Number(amountRaw.replace(/[^0-9.-]/g, '')) || 0
    const prepHint = suggestPrep(description)
    return { date, description, amount, prepHint, risk: prepHint.includes('Request') || prepHint.includes('context') ? 'Needs follow-up' : 'Reviewer check' }
  })
}

function summarize(rows: ParsedTransaction[]) {
  const followUp = rows.filter((row) => row.risk === 'Needs follow-up')
  return {
    rowCount: rows.length,
    total: rows.reduce((sum, row) => sum + row.amount, 0),
    needsReviewCount: followUp.length,
    vendors: Array.from(new Set(rows.map((row) => row.description))).slice(0, 12),
    questions: followUp.slice(0, 10).map((row) => `Confirm support and context for ${row.description} on ${row.date}.`),
  }
}

export async function POST(request: Request) {
  const formData = await request.formData()
  const firmName = String(formData.get('firmName') || '')
  const contactEmail = String(formData.get('contactEmail') || '')
  const clientName = String(formData.get('clientName') || '')
  const cleanupType = String(formData.get('cleanupType') || '')
  const notes = String(formData.get('notes') || '')
  const file = formData.get('file')
  let rows: ParsedTransaction[] = []
  if (file instanceof File) rows = parseCsv(await file.text())
  return NextResponse.json({
    jobId: `CD-${Date.now().toString().slice(-6)}`,
    status: 'pre_ledger_packet_generated_for_review',
    positioning: 'Pre-ledger cleanup prep, not a live QBO/Xero transaction inbox.',
    intake: { firmName, contactEmail, clientName, cleanupType, notes },
    summary: summarize(rows),
    stagedRows: rows.slice(0, 50),
    boundary: 'Cleanup Desk prepares review packets only. Final decisions stay with the professional firm.',
  })
}
