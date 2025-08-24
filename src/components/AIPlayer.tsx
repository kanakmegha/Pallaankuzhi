import { GameState } from './PallanguzhiGame';

// Q-Learning parameters
const ALPHA = 0.1; // Learning rate
const GAMMA = 0.95; // Discount factor
const EPSILON_START = 0.9; // Initial exploration rate
const EPSILON_DECAY = 0.995; // Exploration decay
const EPSILON_MIN = 0.1; // Minimum exploration rate

export interface AIState {
  qTable: Map<string, Map<number, number>>;
  epsilon: number;
  gamesPlayed: number;
  wins: number;
  difficulty: 'easy' | 'medium' | 'hard' | 'expert';
}

export class AIPlayer {
  private qTable: Map<string, Map<number, number>>;
  private epsilon: number;
  private gamesPlayed: number;
  private wins: number;
  private lastState: string | null = null;
  private lastAction: number | null = null;

  constructor(savedState?: AIState) {
    this.qTable = savedState?.qTable || new Map();
    this.epsilon = savedState?.epsilon || EPSILON_START;
    this.gamesPlayed = savedState?.gamesPlayed || 0;
    this.wins = savedState?.wins || 0;
  }

  // Convert game state to string for Q-table
  private stateToString(gameState: GameState): string {
    // Simplified state representation focusing on key features
    const player2Pits = gameState.board.slice(7, 14);
    const player1Pits = gameState.board.slice(0, 7);
    const seedDiff = gameState.player2Seeds - gameState.player1Seeds;
    
    return `${player2Pits.join(',')}_${player1Pits.join(',')}_${seedDiff}`;
  }

  // Get valid moves for AI (player 2)
  private getValidMoves(gameState: GameState): number[] {
    const validMoves: number[] = [];
    for (let i = 7; i < 14; i++) {
      if (gameState.board[i] > 0) {
        validMoves.push(i);
      }
    }
    return validMoves;
  }

  // Evaluate board position for reward calculation
  evaluatePosition(gameState: GameState): number {
    const seedDiff = gameState.player2Seeds - gameState.player1Seeds;
    const boardAdvantage = gameState.board.slice(7, 14).reduce((sum, seeds) => sum + seeds, 0) -
                          gameState.board.slice(0, 7).reduce((sum, seeds) => sum + seeds, 0);
    
    return seedDiff * 10 + boardAdvantage;
  }

  // Choose action using epsilon-greedy strategy
  chooseMove(gameState: GameState): number {
    const validMoves = this.getValidMoves(gameState);
    if (validMoves.length === 0) return -1;

    const stateKey = this.stateToString(gameState);
    
    // Exploration vs Exploitation
    if (Math.random() < this.epsilon) {
      // Random exploration
      return validMoves[Math.floor(Math.random() * validMoves.length)];
    }

    // Get Q-values for current state
    const stateQValues = this.qTable.get(stateKey) || new Map();
    
    // Choose action with highest Q-value
    let bestAction = validMoves[0];
    let bestValue = stateQValues.get(bestAction) || 0;
    
    for (const action of validMoves) {
      const qValue = stateQValues.get(action) || 0;
      if (qValue > bestValue) {
        bestValue = qValue;
        bestAction = action;
      }
    }
    
    return bestAction;
  }

  // Update Q-values based on reward
  updateQValue(gameState: GameState, reward: number): void {
    if (this.lastState === null || this.lastAction === null) return;

    const currentStateKey = this.stateToString(gameState);
    const currentStateQValues = this.qTable.get(currentStateKey) || new Map();
    
    // Get max Q-value for current state
    const maxQValue = Math.max(...Array.from(currentStateQValues.values()), 0);
    
    // Update Q-value for last state-action pair
    let lastStateQValues = this.qTable.get(this.lastState);
    if (!lastStateQValues) {
      lastStateQValues = new Map();
      this.qTable.set(this.lastState, lastStateQValues);
    }
    
    const oldQValue = lastStateQValues.get(this.lastAction) || 0;
    const newQValue = oldQValue + ALPHA * (reward + GAMMA * maxQValue - oldQValue);
    lastStateQValues.set(this.lastAction, newQValue);
  }

  // Prepare for next move
  prepareMove(gameState: GameState, action: number): void {
    this.lastState = this.stateToString(gameState);
    this.lastAction = action;
  }

  // Handle game end
  gameEnded(gameState: GameState, won: boolean): void {
    this.gamesPlayed++;
    if (won) this.wins++;

    // Give final reward
    const finalReward = won ? 100 : (gameState.player2Seeds > gameState.player1Seeds ? 50 : -50);
    this.updateQValue(gameState, finalReward);

    // Decay epsilon (reduce exploration over time)
    this.epsilon = Math.max(EPSILON_MIN, this.epsilon * EPSILON_DECAY);
    
    // Reset for next game
    this.lastState = null;
    this.lastAction = null;
  }

  // Get current difficulty level
  getDifficulty(): 'easy' | 'medium' | 'hard' | 'expert' {
    const winRate = this.gamesPlayed > 0 ? this.wins / this.gamesPlayed : 0;
    
    if (this.gamesPlayed < 10) return 'easy';
    if (winRate < 0.3) return 'easy';
    if (winRate < 0.5) return 'medium';
    if (winRate < 0.7) return 'hard';
    return 'expert';
  }

  // Get AI statistics
  getStats() {
    return {
      gamesPlayed: this.gamesPlayed,
      wins: this.wins,
      winRate: this.gamesPlayed > 0 ? (this.wins / this.gamesPlayed * 100).toFixed(1) : '0.0',
      difficulty: this.getDifficulty(),
      epsilon: this.epsilon.toFixed(3),
      qTableSize: this.qTable.size
    };
  }

  // Export state for persistence
  exportState(): AIState {
    return {
      qTable: this.qTable,
      epsilon: this.epsilon,
      gamesPlayed: this.gamesPlayed,
      wins: this.wins,
      difficulty: this.getDifficulty()
    };
  }
}