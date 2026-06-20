import { NextResponse } from 'next/server'

export const runtime = 'nodejs'

type ParsedTransaction = {
  date: string
  description: string
  amount: number
  suggestedCategory: string
  risk: string
}

function suggestCategory(description: string) {
  const d = description.toLowerCase()
  if (d.includes('amazon')) return 'Office supplies / ask client'
  if (d.includes('uber') || d.includes('lyft')) return 'Travel / ask client'
  if (d.includes('shell') || d.includes('exxon') || d.includes('chevron')) return 'Auto / fuel / ask client'
  if (d.includes('stripe') || d.includes('square')) return 'Merchant processing'
  if (d.includes('adobe') || d.includes('google') || d.includes('microsoft')) return 'Software / subscriptions'
  if (d.includes('irs') || d.includes('tax')) return 'Taxes / professional review'
  if (d.includes('payroll') || d.includes('gusto') || d.includes('adp')) return 'Payroll'
  return 'Uncategorized / review'
}

function parseCsv(text: string): ParsedTransaction[] {
  const lines = text.split(/\r?\n/).filter(Boolean)
  const rows = lines.slice(1)
  return rows.map((line) => {
    const cols = line.split(',').map((x) => x.trim().replace(/^"|"$/g, ''))
    const [date = 'Unknown date', description = 'Unknown vendor', amountRaw = '0'] = cols
    const amount = Number(amountRaw.replace(/[^0-9.-]/g, '')) || 0
    const suggestedCategory = suggestCategory(description)
    return {
      date,
      description,
      amount,
      suggestedCategory,
      risk: suggestedCategory.includes('ask') || suggestedCategory.includes('Uncategorized') ? 'Needs client question' : 'Low-risk suggestion',
    }
  })
}

function summarize(transactions: ParsedTransaction[]) {
  const total = transactions.reduce((sum, t) => sum + t.amount, 0)
  const needsReview = transactions.filter((t) => t.risk === 'Needs client question')
  const vendors = Array.from(new Set(transactions.map((t) => t.description))).slice(0, 12)
  return {
    transactionCount: transactions.length,
    total,
    needsReviewCount: needsReview.length,
    vendors,
    questions: needsReview.slice(0, 10).map((t) => `Confirm business purpose/category for ${t.description} on ${t.date} (${t.amount.toFixed(2)}).`),
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

  let transactions: ParsedTransaction[] = []
  if (file instanceof File) {
    const text = await file.text()
    transactions = parseCsv(text)
  }

  const summary = summarize(transactions)

  return NextResponse.json({
    jobId: `CD-${Date.now().toString().slice(-6)}`,
    status: 'packet_generated_for_review',
    intake: { firmName, contactEmail, clientName, cleanupType, notes },
    summary,
    transactions: transactions.slice(0, 50),
    disclaimer: 'Cleanup Desk prepares review packets only. A qualified bookkeeper, accountant, or CPA must make final accounting and tax decisions.',
  })
}
