export interface WordFragment {
  id: string;
  text: string;
  x: number;
  y: number;
  expiresAt: number;
}

export interface Intrusion {
  id: string;
  text: string;
  x: number;
  y: number;
}

export interface Level {
  id: number;
  context: string;
  targetSentence: string[];
  timeLimit: number;
  spawnRate: number; // ms between fragment spawns
  intrusionRate: number; // ms between intrusions
}

export interface GameState {
  status: 'menu' | 'playing' | 'result' | 'gameover';
  currentLevelIndex: number;
  assembledWords: string[];
  stress: number; // 0 to 100
  timeLeft: number;
  score: number;
}
