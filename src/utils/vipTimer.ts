export interface VipTimeRemaining {
  isExpired: boolean;
  totalDays: number;
  months: number;
  weeks: number;
  days: number;
  displayText: string;
  badgeText: string;
  expiryDateFormatted: string;
}

const STORAGE_VIP_EXPIRES_KEY = 'mikvebe_vip_expires_at';
const STORAGE_VIP_ACTIVATED_KEY = 'mikvebe_vip_activated_at';

/**
 * Gets the current VIP expiration Date, or initializes `months` from now if VIP is active.
 */
export function getOrCreateVipExpirationDate(isPremium: boolean, months: number = 5): Date | null {
  if (!isPremium) return null;

  try {
    const stored = localStorage.getItem(STORAGE_VIP_EXPIRES_KEY);
    if (stored) {
      const parsed = new Date(stored);
      if (!isNaN(parsed.getTime())) {
        return parsed;
      }
    }
  } catch (e) {
    console.warn('Error reading VIP expiry date:', e);
  }

  // If no expiration date is set yet, initialize based on months
  const now = new Date();
  const days = Math.max(1, months) * 30;
  const expires = new Date(now.getTime() + days * 24 * 60 * 60 * 1000);
  try {
    localStorage.setItem(STORAGE_VIP_ACTIVATED_KEY, now.toISOString());
    localStorage.setItem(STORAGE_VIP_EXPIRES_KEY, expires.toISOString());
  } catch (e) {
    console.warn('Error saving VIP expiry date:', e);
  }

  return expires;
}

/**
 * Calculates remaining time in Georgian according to user specification:
 * 5 months -> 4 months -> 3 months -> 2 months -> 1 month -> weeks -> days.
 */
export function getVipRemainingTime(expiresAt: Date | string | null | undefined): VipTimeRemaining {
  if (!expiresAt) {
    return {
      isExpired: true,
      totalDays: 0,
      months: 0,
      weeks: 0,
      days: 0,
      displayText: 'ვადა ამოიწურა',
      badgeText: 'არააქტიური',
      expiryDateFormatted: '',
    };
  }

  const expDate = typeof expiresAt === 'string' ? new Date(expiresAt) : expiresAt;
  const now = new Date();
  const diffMs = expDate.getTime() - now.getTime();

  if (diffMs <= 0 || isNaN(diffMs)) {
    return {
      isExpired: true,
      totalDays: 0,
      months: 0,
      weeks: 0,
      days: 0,
      displayText: 'ვადა ამოწურულია',
      badgeText: 'ვადაგასული',
      expiryDateFormatted: expDate.toLocaleDateString('ka-GE'),
    };
  }

  const totalDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
  const months = Math.floor(totalDays / 30);
  const remainingDays = totalDays % 30;
  const weeks = Math.floor(remainingDays / 7);
  const days = remainingDays % 7;

  let displayText = '';
  let badgeText = '';

  if (totalDays >= 150) {
    displayText = 'ვიპი 6 თვით (დარჩენილია 6 თვე)';
    badgeText = 'ვიპი 6 თვით';
  } else if (totalDays >= 120) {
    displayText = 'ვიპი 5 თვით (დარჩენილია 5 თვე)';
    badgeText = 'ვიპი 5 თვით';
  } else if (totalDays >= 90) {
    displayText = 'ვიპი 4 თვით (დარჩენილია 4 თვე)';
    badgeText = 'ვიპი 4 თვით';
  } else if (totalDays >= 60) {
    displayText = 'ვიპი 3 თვით (დარჩენილია 3 თვე)';
    badgeText = 'ვიპი 3 თვით';
  } else if (totalDays >= 30) {
    displayText = 'ვიპი 2 თვით (დარჩენილია 2 თვე)';
    badgeText = 'ვიპი 2 თვით';
  } else if (totalDays >= 14) {
    const w = Math.floor(totalDays / 7);
    displayText = `ვიპი 1 თვით (დარჩენილია ${w} კვირა)`;
    badgeText = 'ვიპი 1 თვით';
  } else if (totalDays >= 7) {
    const w = Math.floor(totalDays / 7);
    displayText = `ვიპი ${w} კვირით (დარჩენილია ${totalDays} დღე)`;
    badgeText = `ვიპი ${w} კვირით`;
  } else {
    displayText = `ვიპი ${totalDays} დღით (დარჩენილია ${totalDays} დღე)`;
    badgeText = `ვიპი ${totalDays} დღით`;
  }

  return {
    isExpired: false,
    totalDays,
    months,
    weeks,
    days,
    displayText,
    badgeText,
    expiryDateFormatted: expDate.toLocaleDateString('ka-GE', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }),
  };
}

export function setVipExpirationOnActivation(months: number = 5): { activatedAt: string; expiresAt: string } {
  const now = new Date();
  const days = Math.max(1, months) * 30;
  const expires = new Date(now.getTime() + days * 24 * 60 * 60 * 1000);
  const activatedAt = now.toISOString();
  const expiresAt = expires.toISOString();

  try {
    localStorage.setItem(STORAGE_VIP_ACTIVATED_KEY, activatedAt);
    localStorage.setItem(STORAGE_VIP_EXPIRES_KEY, expiresAt);
  } catch (e) {
    console.warn('Error storing VIP dates:', e);
  }

  return { activatedAt, expiresAt };
}
