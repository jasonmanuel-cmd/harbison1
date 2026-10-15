export type SharedCrmConfig = { url?: string; secret?: string }

export function sharedCrmConfigured(config: SharedCrmConfig): boolean {
  return Boolean(config.url || config.secret)
}

export async function saveToSharedCrm(
  lead: Record<string, string | undefined>, submissionId: string, config: SharedCrmConfig,
  send: typeof fetch = fetch,
): Promise<{ id: string; duplicate: boolean }> {
  if (!config.url || !config.secret || config.secret.length < 32) throw new Error('Shared CRM is not fully configured')
  const url = new URL(config.url)
  if (url.protocol !== 'https:' && !(url.protocol === 'http:' && ['localhost', '127.0.0.1'].includes(url.hostname))) {
    throw new Error('Shared CRM requires HTTPS')
  }
  const response = await send(url, {
    method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${config.secret}` },
    body: JSON.stringify({ version: 1, brand: 'harbison_standard', submission_id: submissionId, lead }),
    signal: AbortSignal.timeout(20000), redirect: 'error',
  })
  const reply = await response.json().catch(() => null)
  if (!response.ok || !reply?.ok || reply.stored !== true || reply.id !== submissionId) throw new Error('Shared CRM did not confirm this inquiry')
  return { id: reply.id, duplicate: reply.duplicate === true }
}
