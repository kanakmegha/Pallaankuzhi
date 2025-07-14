import React from 'react';
import { X, ArrowRight, Target, Trophy, RotateCcw, Play } from 'lucide-react';

interface TutorialProps {
  isOpen: boolean;
  onClose: () => void;
}

const Tutorial: React.FC<TutorialProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border-4 border-tamil-red">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b-2 border-tamil-red bg-tamil-turmeric">
          <h2 className="text-3xl font-bold text-tamil-red">Pallanguzhi Game Rules</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-tamil-saffron rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-tamil-red border border-tamil-red"
            aria-label="Close"
          >
            <X className="w-6 h-6 text-tamil-red" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 text-tamil-brown">
          {/* Game Overview */}
          <div className="space-y-3 bg-tamil-turmeric p-4 rounded-lg border border-tamil-red">
            <h3 className="text-xl font-semibold text-tamil-red flex items-center">
              <Trophy className="w-6 h-6 mr-2" />
              Objective
            </h3>
            <p className="text-lg">
              Capture the most shells by emptying your side's pits. Win when a player can only fill one pit with their score pile shells.
            </p>
          </div>

          {/* Setup */}
          <div className="space-y-3">
            <h3 className="text-xl font-semibold text-tamil-red">Setup</h3>
            <ul className="list-disc list-inside space-y-2 text-lg">
              <li>14 pits total (7 per player) with 5 shells each (70 shells total)</li>
              <li>Player 1: Bottom row (pits 0-6)</li>
              <li>Player 2: Top row (pits 7-13)</li>
              <li>Each player has a score pile for captured shells</li>
            </ul>
          </div>

          {/* Updated Rules */}
          <div className="space-y-3 bg-tamil-saffron p-4 rounded-lg border border-tamil-red">
            <h3 className="text-xl font-semibold text-tamil-red flex items-center">
              <ArrowRight className="w-6 h-6 mr-2" />
              How to Play (Updated Rules)
            </h3>
            <ol className="list-decimal list-inside space-y-3 text-lg">
              <li>
                <strong>Pick shells:</strong> Click on a pit on your side that contains shells
              </li>
              <li>
                <strong>Sow counterclockwise:</strong> Drop shells one by one in each pit moving counterclockwise
              </li>
              <li>
                <strong>4-Shell Rule:</strong> If any pit gets exactly 4 shells during sowing, that player immediately captures those 4 shells to their score pile, and the pit becomes empty
              </li>
              <li>
                <strong>Continue sowing:</strong> After placing the last shell, check the next pit:
                <ul className="list-disc list-inside ml-6 mt-2 space-y-1">
                  <li>If the next pit has shells, pick them all up and continue sowing</li>
                  <li>If the next pit is empty, capture those shells (0) and end your turn</li>
                </ul>
              </li>
            </ol>
          </div>

          {/* Round System */}
          <div className="space-y-3 bg-tamil-gold p-4 rounded-lg border border-tamil-red">
            <h3 className="text-xl font-semibold text-tamil-red flex items-center">
              <RotateCcw className="w-6 h-6 mr-2" />
              Round System
            </h3>
            <ul className="list-disc list-inside space-y-2 text-lg">
              <li>Round ends when all pits on one player's side are empty</li>
              <li>That player refills their pits with 5 shells each from their score pile</li>
              <li>Pits that cannot be filled (not enough shells) become unusable</li>
              <li>Game ends when a player can only fill one pit</li>
            </ul>
          </div>

          {/* Sample Game */}
          <div className="space-y-3 bg-tamil-sandalwood p-4 rounded-lg border border-tamil-red">
            <h3 className="text-xl font-semibold text-tamil-red flex items-center">
              <Play className="w-6 h-6 mr-2" />
              Sample Game Walkthrough
            </h3>
            
            <div className="space-y-4">
              <div className="p-3 bg-white rounded border border-tamil-red">
                <h4 className="font-semibold text-tamil-red">Step 1: Player 1's Turn</h4>
                <p>Player 1 picks 5 shells from pit 2. Board starts: [5,5,5,5,5,5,5,5,5,5,5,5,5,5]</p>
                <p>Sows counterclockwise to pits 3-7: [5,5,0,6,6,6,6,6,5,5,5,5,5,5]</p>
                <p>Last shell lands in pit 7, next pit 8 has 5 shells, picks up and continues to 9-13: [5,5,0,6,6,6,6,0,0,6,6,6,6,6]</p>
                <p>Last shell in pit 13, next pit 0 has 5 shells, picks up and continues...</p>
              </div>

              <div className="p-3 bg-white rounded border border-tamil-red">
                <h4 className="font-semibold text-tamil-red">Step 2: 4-Shell Rule Example</h4>
                <p>During sowing, if pit 5 reaches exactly 4 shells, Player 1 immediately captures those 4 shells.</p>
                <p>Pit 5 becomes empty, and sowing continues from the next pit.</p>
                <p>Player 1's score increases by 4 shells.</p>
              </div>

              <div className="p-3 bg-white rounded border border-tamil-red">
                <h4 className="font-semibold text-tamil-red">Step 3: Turn Ending</h4>
                <p>Player continues sowing until the last shell is placed.</p>
                <p>Check the next pit: if empty, capture 0 shells and turn ends.</p>
                <p>If next pit has shells, pick them up and continue sowing.</p>
              </div>

              <div className="p-3 bg-white rounded border border-tamil-red">
                <h4 className="font-semibold text-tamil-red">Step 4: Round End</h4>
                <p>When Player 1's side becomes empty, they refill pits with 5 shells each from their score.</p>
                <p>If they can't fill all 7 pits, unfilled pits become unusable (marked with X).</p>
                <p>Game continues until someone can only fill one pit.</p>
              </div>
            </div>
          </div>

          {/* Winning */}
          <div className="space-y-3">
            <h3 className="text-xl font-semibold text-tamil-red">Winning the Game</h3>
            <ul className="list-disc list-inside space-y-2 text-lg">
              <li>Game ends when a player can only fill one pit with their score pile shells</li>
              <li>The player with the most shells in their score pile wins</li>
              <li>If scores are equal, it's a tie</li>
            </ul>
          </div>

          {/* Strategy Tips */}
          <div className="space-y-3 bg-tamil-saffron p-4 rounded-lg border border-tamil-red">
            <h3 className="text-xl font-semibold text-tamil-red">Strategy Tips</h3>
            <ul className="list-disc list-inside space-y-2 text-lg">
              <li>Watch for opportunities to create 4-shell pits for immediate captures</li>
              <li>Plan moves to continue sowing from pits with many shells</li>
              <li>Try to empty your opponent's side to force a round end</li>
              <li>Manage your score pile carefully for refilling pits</li>
              <li>In later rounds, protect your remaining usable pits</li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t-2 border-tamil-red bg-tamil-turmeric">
          <button
            onClick={onClose}
            className="w-full px-6 py-3 bg-tamil-red hover:bg-tamil-brown text-white font-semibold rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-tamil-gold focus:ring-offset-2 text-lg border border-tamil-brown"
          >
            Got it! Let's Play
          </button>
        </div>
      </div>
    </div>
  );
};

export default Tutorial;