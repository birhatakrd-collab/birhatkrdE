export enum OptimizationFocus {
  READABILITY = 'Readability',
  PERFORMANCE = 'Performance',
  SECURITY = 'Security',
  MODERNIZATION = 'Modernization (ES6+)',
  BUG_FIXING = 'Bug Fixing'
}

export interface RefactorResult {
  improvedCode: string;
  explanation: string;
  keyChanges: string[];
}

export interface RefactorRequest {
  code: string;
  language: string;
  focus: OptimizationFocus;
}

export interface HistoryItem extends RefactorResult {
  id: string;
  timestamp: number;
  originalCode: string;
  language: string;
}