
export interface InningsData {
  match_id: number;
  batter: string;
  runs: number;
  impact: number;
  balls: number;
  avg_pressure: number;
}

export type StoryAct = 1 | 2 | 3 | 4 | 5 | 6;

export interface FilterState {
  minRuns: number;
  minImpact: number;
  revealNames: boolean;
  showTop100: boolean;
  showZone: boolean;
}
