export interface DesignTokens {
  primaryColor: string;
  primaryHover: string;
  accentColor: string;
  borderRadius: 'rounded-md' | 'rounded-xl' | 'rounded-2xl' | 'rounded-full';
  radiusPx: string;
  fontFamily: string;
  darkMode: boolean;
}

export interface StitchScreen {
  id: string;
  name: string;
  deviceType: 'DESKTOP' | 'MOBILE' | 'TABLET';
  description?: string;
  htmlContent?: string;
  screenshotUrl?: string;
  timestamp: string;
}

export interface StitchProjectData {
  id: string;
  name: string;
  description: string;
  ownerEmail?: string;
  screens: StitchScreen[];
  designTokens: DesignTokens;
  updatedAt: string;
}

export type ViewportMode = 'desktop' | 'tablet' | 'mobile' | 'full';

export type ActiveTab = 'website' | 'dashboard' | 'components' | 'custom-import' | 'code-export';
