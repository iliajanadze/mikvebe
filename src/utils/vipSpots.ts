export interface VipSpotsInfo {
  totalSpots: number;
  claimedSpots: number;
  remainingSpots: number;
  isPromoActive: boolean;
  percentageClaimed: number;
}

const STORAGE_VIP_SPOTS_CLAIMED_KEY = 'mikvebe_vip_spots_claimed_v4';
const DEFAULT_TOTAL = 2000;
const DEFAULT_CLAIMED = 0;

export async function fetchVipSpotsInfo(): Promise<VipSpotsInfo> {
  try {
    const res = await fetch('/api/vip/spots');
    if (res.ok) {
      const data = await res.json();
      localStorage.setItem(STORAGE_VIP_SPOTS_CLAIMED_KEY, String(data.claimedSpots));
      return data;
    }
  } catch (err) {
    console.warn('Could not fetch VIP spots from server, falling back to local storage:', err);
  }

  // Fallback to local storage
  const storedClaimed = localStorage.getItem(STORAGE_VIP_SPOTS_CLAIMED_KEY);
  const claimed = storedClaimed ? Number(storedClaimed) : DEFAULT_CLAIMED;
  const remaining = Math.max(0, DEFAULT_TOTAL - claimed);

  return {
    totalSpots: DEFAULT_TOTAL,
    claimedSpots: claimed,
    remainingSpots: remaining,
    isPromoActive: remaining > 0,
    percentageClaimed: Math.min(100, Math.round((claimed / DEFAULT_TOTAL) * 100)),
  };
}

export async function claimVipSpot(): Promise<VipSpotsInfo> {
  try {
    const res = await fetch('/api/vip/claim', { method: 'POST' });
    if (res.ok) {
      const data = await res.json();
      localStorage.setItem(STORAGE_VIP_SPOTS_CLAIMED_KEY, String(data.claimedSpots));
      return data;
    }
  } catch (err) {
    console.warn('Could not post VIP claim to server:', err);
  }

  // Local fallback increment
  const storedClaimed = localStorage.getItem(STORAGE_VIP_SPOTS_CLAIMED_KEY);
  const claimed = (storedClaimed ? Number(storedClaimed) : DEFAULT_CLAIMED) + 1;
  localStorage.setItem(STORAGE_VIP_SPOTS_CLAIMED_KEY, String(claimed));
  const remaining = Math.max(0, DEFAULT_TOTAL - claimed);

  return {
    totalSpots: DEFAULT_TOTAL,
    claimedSpots: claimed,
    remainingSpots: remaining,
    isPromoActive: remaining > 0,
    percentageClaimed: Math.min(100, Math.round((claimed / DEFAULT_TOTAL) * 100)),
  };
}
