export type AuthRole = 'vendor' | 'technician';

export type VerifyOtpResult = {
  accessToken: string;
  tokenType: string;
  expiresInSeconds: number;
  roles: AuthRole[];
  user: {
    id: string;
    phone: string;
    firstName: string;
    lastName: string;
    email: string;
    referralCode: string;
    creditsBalance: number;
  };
};

export const ROLE_SELECTION_COPY: Record<AuthRole, { title: string; description: string }> = {
  vendor: {
    title: "I'm managing today",
    description: 'Open the Vendor Dashboard',
  },
  technician: {
    title: "I'm working in the field today",
    description: 'Open the Technician Job Dashboard',
  },
};

export type RequestOtpResponse = {
  message: string;
  expiresInSeconds: number;
  phone: string;
  smsSent: boolean;
  debugOtp?: string;
};
