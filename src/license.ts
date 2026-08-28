const SLUG = 'bookmark-import-audit';
const BASE_URL = 'https://api.sociobot.in/api/v1';
const TOKEN_KEY = `sb_license:${SLUG}`;
const VERDICT_KEY = `sb_license_verdict:${SLUG}`;
const DAY = 86_400_000;

interface Verdict { valid: boolean; checkedAt: number; reason: string }

export interface LicenseState {
  unlocked: boolean;
  notice?: string;
  verifying: boolean;
}

function cachedVerdict(): Verdict | null {
  try { return JSON.parse(localStorage.getItem(VERDICT_KEY) ?? 'null') as Verdict | null; }
  catch { return null; }
}

export function checkoutUrl(): string {
  return `${BASE_URL}/products/${SLUG}/checkout`;
}

export function acceptReturnedLicense(): void {
  const url = new URL(window.location.href);
  const token = url.searchParams.get('license');
  if (!token) return;
  localStorage.setItem(TOKEN_KEY, token.trim());
  localStorage.removeItem(VERDICT_KEY);
  url.searchParams.delete('license');
  history.replaceState({}, '', `${url.pathname}${url.search}${url.hash}`);
}

export function storeLicense(token: string): void {
  localStorage.setItem(TOKEN_KEY, token.trim());
  localStorage.removeItem(VERDICT_KEY);
}

export function initialLicenseState(): LicenseState {
  const token = localStorage.getItem(TOKEN_KEY);
  const verdict = cachedVerdict();
  return {
    unlocked: Boolean(token && verdict?.valid),
    notice: verdict && !verdict.valid ? 'This license is no longer active.' : undefined,
    verifying: Boolean(token && (!verdict || Date.now() - verdict.checkedAt >= DAY))
  };
}

export async function verifyLicense(force = false): Promise<LicenseState> {
  const token = localStorage.getItem(TOKEN_KEY);
  if (!token) return { unlocked: false, verifying: false };
  const cached = cachedVerdict();
  if (!force && cached && Date.now() - cached.checkedAt < DAY) {
    return { unlocked: cached.valid, verifying: false, notice: cached.valid ? undefined : 'This license is no longer active.' };
  }
  try {
    const response = await fetch(`${BASE_URL}/products/${SLUG}/verify?license=${encodeURIComponent(token)}`);
    if (!response.ok) throw new Error('Verification service unavailable');
    const result = await response.json() as { valid: boolean; reason: string };
    localStorage.setItem(VERDICT_KEY, JSON.stringify({ valid: result.valid, reason: result.reason, checkedAt: Date.now() }));
    return { unlocked: result.valid, verifying: false, notice: result.valid ? undefined : 'This license is no longer active.' };
  } catch {
    return {
      unlocked: Boolean(cached?.valid),
      verifying: false,
      notice: cached?.valid ? 'Offline — using the last valid license check.' : 'License verification needs a connection. Your audit remains available.'
    };
  }
}
