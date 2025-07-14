export interface GameState {
  board: number[]; // 14 pits: Player 1 (0-6), Player 2 (7-13)
  turn: 'player1' | 'player2';
  scores: {
    player1: number;
    player2: number;
  };
  round: number;
  unusablePits: {
    player1: number[];
    player2: number[];
  };
  mode: 'twoPlayer' | 'ai';
  gameOver: boolean;
  winner?: 'player1' | 'player2' | 'tie';
}

export interface Position {
  x: number;
  y: number;
}

export interface Shell {
  id: string;
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  animating: boolean;
}