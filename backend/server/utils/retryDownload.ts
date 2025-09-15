export interface RetryOptions {
  attempts: number;
  baseDelayMs: number;
}

export async function withRetry<T>(fn: () => Promise<T>, opts: RetryOptions): Promise<T> {
  let attempt = 0;
  let lastErr: any;
  while (attempt < opts.attempts) {
    try {
      return await fn();
    } catch (err) {
      lastErr = err;
      attempt++;
      const delay = opts.baseDelayMs * 2 ** (attempt - 1);
      console.warn(`Attempt ${attempt} failed. Retrying in ${delay}ms...`);
      await new Promise((r) => setTimeout(r, delay));
    }
  }
  throw lastErr;
}

export async function checkUrlReachable(url: string): Promise<boolean> {
  const res = await fetch(url, { method: "HEAD" });
  return res.ok;
}