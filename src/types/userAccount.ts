export interface UserAccount {
  id: string; // unique ID e.g. MIK-89214
  name: string;
  email: string;
  avatarSeed?: string;
  createdAt: string;
  membershipStatus: 'უფასო' | 'პრემიუმ (აქტიური)';
  savedPlanIds: string[];
}

export interface FeedbackSubmission {
  name: string;
  email: string;
  subject?: string;
  message: string;
  rating?: number;
}
