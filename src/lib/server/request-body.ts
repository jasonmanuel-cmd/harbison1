export class BodyError extends Error {
  status: number
  constructor(message: string, status: number) { super(message); this.status = status }
}

// Bound bytes as they arrive: Content-Length alone is absent on chunked bodies.
export async function readJsonBody(request: Request, maxBytes = 16_384, timeoutMs = 5000): Promise<unknown> {
  if (!/^application\/json(?:\s*;|$)/i.test(request.headers.get('content-type') || '')) {
    throw new BodyError('Use application/json', 415)
  }
  const length = Number(request.headers.get('content-length') || 0)
  if (length > maxBytes) throw new BodyError('Inquiry is too large', 413)
  const reader = request.body?.getReader()
  if (!reader) throw new BodyError('Invalid inquiry', 400)
  let timer: ReturnType<typeof setTimeout> | undefined
  const deadline = new Promise<never>((_, reject) => {
    timer = setTimeout(() => reject(new BodyError('Inquiry body timed out', 408)), timeoutMs)
  })
  try {
    const chunks: Uint8Array[] = []
    let total = 0
    while (true) {
      const { done, value } = await Promise.race([reader.read(), deadline])
      if (done) break
      total += value.byteLength
      if (total > maxBytes) throw new BodyError('Inquiry is too large', 413)
      chunks.push(value)
    }
    const bytes = new Uint8Array(total)
    let offset = 0
    for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.length }
    return JSON.parse(new TextDecoder('utf-8', { fatal: true }).decode(bytes))
  } finally {
    clearTimeout(timer)
    // Cancellation can itself wait on an uncooperative underlying stream.
    void reader.cancel().catch(() => {})
  }
}
