export const createDemoStep = (
  explanation: string,
  board: number[],
  player1Seeds: number,
  player2Seeds: number,
  currentPlayer: 1 | 2,
  highlightedPit: number | null = null,
  captureAnimation: number | null = null,
  showCompliment: boolean = false,
  complimentMessage: string = "",
  complimentType: 'capture' | 'relay' | 'strategy' | 'comeback' = 'strategy',
  sowingAnimation: number[] = []
) => ({
  explanation,
  board,
  player1Seeds,
  player2Seeds,
  currentPlayer,
  highlightedPit,
  captureAnimation,
  showCompliment,
  complimentMessage,
  complimentType,
  sowingAnimation,
});

export const demoSteps = [
  createDemoStep(
    "Welcome to Pallanguzhi! Each pit starts with 5 seeds. Player 1 (bottom) goes first.",
    [5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5],
    0, 0, 1
  ),
  createDemoStep(
    "Player 1 selects pit 3 (has 5 seeds). Seeds are sown counterclockwise.",
    [5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5],
    0, 0, 1, 2
  ),
  createDemoStep(
    "Seeds from pit 3 are picked up and sown one by one counterclockwise.",
    [5, 5, 0, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5],
    0, 0, 1, 2, null, false, "", 'strategy', [3, 4, 5, 6, 7]
  ),
  createDemoStep(
    "After sowing: pit 4 gets 1 seed, pit 5 gets 1 seed, pit 6 gets 1 seed, pit 7 gets 1 seed, pit 8 gets 1 seed.",
    [5, 5, 0, 6, 6, 6, 6, 6, 5, 5, 5, 5, 5, 5],
    0, 0, 1, 7
  ),
  createDemoStep(
    "Last seed landed in pit 8 which had seeds. Relay sowing! Take all seeds from pit 8 and continue.",
    [5, 5, 0, 6, 6, 6, 6, 0, 5, 5, 5, 5, 5, 5],
    0, 0, 1, 7, null, true, "Amazing relay sowing! Keep the momentum going!", 'relay'
  ),
  createDemoStep(
    "Sowing the 6 seeds from pit 8: each pit gets one seed counterclockwise.",
    [5, 5, 0, 6, 6, 6, 6, 0, 6, 6, 6, 6, 6, 6],
    0, 0, 1, 13, null, false, "", 'strategy', [8, 9, 10, 11, 12, 13]
  ),
  createDemoStep(
    "Last seed landed in pit 14 which had seeds. Another relay! Continue sowing...",
    [5, 5, 0, 6, 6, 6, 6, 0, 6, 6, 6, 6, 6, 0],
    0, 0, 1, 13, null, true, "Incredible chain relay! You're on fire!", 'relay'
  ),
  createDemoStep(
    "Sowing 6 more seeds: pit 1 gets 1, pit 2 gets 1, pit 3 gets 1, pit 4 gets 1, pit 5 gets 1, pit 6 gets 1.",
    [6, 6, 1, 7, 7, 7, 7, 0, 6, 6, 6, 6, 6, 0],
    0, 0, 1, 6, null, false, "", 'strategy', [0, 1, 2, 3, 4, 5]
  ),
  createDemoStep(
    "Last seed landed in pit 7 which had seeds. Final relay sowing continues...",
    [6, 6, 1, 7, 7, 7, 0, 0, 6, 6, 6, 6, 6, 0],
    0, 0, 1, 6, null, true, "Triple relay combo! Masterful strategy!", 'relay'
  ),
  createDemoStep(
    "Sowing final 7 seeds: each pit gets one seed until all seeds are distributed.",
    [6, 6, 1, 7, 7, 7, 0, 1, 7, 7, 7, 7, 7, 1],
    0, 0, 1, 13, null, false, "", 'strategy', [7, 8, 9, 10, 11, 12, 13]
  ),
  createDemoStep(
    "Final seed landed in pit 14 which was empty! Capture rule applies: take seeds from next pit (pit 1).",
    [0, 6, 1, 7, 7, 7, 0, 1, 7, 7, 7, 7, 7, 1],
    6, 0, 2, null, 0, true, "Excellent capture! Strategic thinking pays off!", 'capture'
  ),
  createDemoStep(
    "Player 1 captured 6 seeds! Now it's Player 2's turn. Player 2 selects pit 11.",
    [0, 6, 1, 7, 7, 7, 0, 1, 7, 7, 7, 7, 7, 1],
    6, 0, 2, 10
  ),
  createDemoStep(
    "Player 2 sows 7 seeds from pit 11 counterclockwise: pit 12, 13, 14, 1, 2, 3, 4.",
    [1, 7, 2, 8, 7, 7, 0, 1, 7, 7, 0, 8, 8, 2],
    6, 0, 2, 3, null, false, "", 'strategy', [11, 12, 13, 0, 1, 2, 3]
  ),
  createDemoStep(
    "Last seed landed in pit 4 which had seeds. Relay continues with 8 seeds from pit 4.",
    [1, 7, 2, 0, 7, 7, 0, 1, 7, 7, 0, 8, 8, 2],
    6, 0, 2, 3, null, true, "Player 2 fights back with a relay!", 'relay'
  ),
  createDemoStep(
    "Sowing continues: pit 5, 6, 7, 8, 9, 10, 11, 12 each get one seed.",
    [1, 7, 2, 0, 8, 8, 1, 2, 8, 8, 1, 9, 9, 2],
    6, 0, 2, 11, null, false, "", 'strategy', [4, 5, 6, 7, 8, 9, 10, 11]
  ),
  createDemoStep(
    "The game continues with players taking turns, using relay sowing and capture rules until one side is empty!",
    [1, 7, 2, 0, 8, 8, 1, 2, 8, 8, 1, 9, 9, 2],
    6, 0, 1
  ),
];