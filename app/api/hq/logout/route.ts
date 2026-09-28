import { NextResponse } from 'next/server'

import { revokeAccess } from '@/lib/hq-auth'

export async function POST() {
  await revokeAccess()
  return NextResponse.json({ ok: true })
}
