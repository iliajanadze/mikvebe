export interface UserAccount {
  id: string; // unique ID e.g. MIK-89214
  name: string;
  email: string;
  avatarSeed?: string;
  createdAt: string;
  membershipStatus: string; // e.g. '5 თვე უფასო VIP' | 'უფასო' | 'პრემიუმ (აქტიური)'
  isPremium?: boolean;
  vipExpiresAt?: string;
  vipActivatedAt?: string;
  savedPlanIds: string[];
}

export interface FeedbackSubmission {
  name: string;
  email: string;
  subject?: string;
  message: string;
  rating?: number;
}
