// Types for HAQMATE application

export type AppPage = 
  | 'landing'
  | 'dashboard'
  | 'complaint-generator'
  | 'dark-pattern-detector'
  | 'know-your-rights'
  | 'my-cases'
  | 'escalation-guide';

export type CaseStatus = 'open' | 'in-progress' | 'resolved' | 'closed';

export type ProblemCategory =
  | 'defective-product'
  | 'refund-dispute'
  | 'misleading-ad'
  | 'hidden-charges'
  | 'warranty-dispute'
  | 'ecommerce'
  | 'service-failure'
  | 'other';

export interface Case {
  id: string;
  title: string;
  company: string;
  product: string;
  amount: number;
  purchaseDate: string;
  category: ProblemCategory;
  description: string;
  desiredResolution: string;
  status: CaseStatus;
  complaint: string;
  createdAt: string;
  updatedAt: string;
  notes: string;
}

export interface DarkPatternResult {
  pattern: string;
  description: string;
  risk: 'low' | 'medium' | 'high';
  recommendation: string;
  detected: boolean;
}

export interface RightsCard {
  id: string;
  title: string;
  category: string;
  icon: string;
  summary: string;
  explanation: string;
  nextSteps: string[];
  evidenceChecklist: string[];
  officialSource: string;
  sourceUrl: string;
  relevantLaw: string;
}

export interface Notification {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
}
