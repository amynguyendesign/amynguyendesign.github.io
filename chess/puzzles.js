// puzzles.js — curated positions for the Studio mate trainer.
// Every position below is hand-composed for teaching and machine-verified:
//   python-chess  Board.is_valid(), not already game over, exhaustive legal search  (validate.py)
//   chess.js      same checks through rules.js                                        (tests.cjs)
// `solutions` lists EVERY winning first move found by exhaustive search — the trainer accepts all of
// them via rules.js; the list is documentation, not the source of truth.
// Puzzles are keyed {id, fen, mateIn, pattern, title, lesson}. Verdicts are {id, fen, answer, lesson}.

export const provenance =
  'All positions are original compositions made for this trainer (not taken from games or databases). ' +
  'They isolate one mating pattern each, with just enough material to make the pattern legal and the solution ' +
  'unambiguous. Every position was verified programmatically: legal (python-chess Board.is_valid), not already ' +
  'checkmate or stalemate, and solved by exhaustive search over all legal moves (mate-in-2 positions have no ' +
  'mate-in-1 and every opponent reply is covered). Verdict positions place the side to move in check and were ' +
  'checked the same way. Re-run mate/validate.py or mate/tests.cjs to reproduce.';

export const puzzles = [
  // ---------------------------------------------------------------- mate in 1, White to move
  {
    id: 'm1-back-rank-w', fen: '6k1/5ppp/8/8/8/8/5PPP/3R2K1 w - - 0 1', mateIn: 1,
    pattern: 'back rank', title: 'The classic back rank',
    lesson: 'Three pawns in front of the king look like shelter but they are a wall. A rook landing on the back rank with no defender to capture it is mate.',
    solutions: ['Rd8#'],
  },
  {
    id: 'm1-smothered-w', fen: '6rk/6pp/8/4N3/8/8/8/6K1 w - - 0 1', mateIn: 1,
    pattern: 'smothered mate', title: 'Smothered',
    lesson: 'The king is boxed in by its own pieces, so a knight check needs no support at all. Check which knight jump cannot be captured by the h-pawn.',
    solutions: ['Nf7#'],
  },
  {
    id: 'm1-queen-bishop-battery-w', fen: '5rk1/5ppp/8/8/8/3Q4/6PP/1B4K1 w - - 0 1', mateIn: 1,
    pattern: 'queen and bishop battery', title: 'Battery on the diagonal',
    lesson: 'The bishop behind the queen is what makes the capture on h7 safe: after the queen moves, the bishop covers the same square from behind.',
    solutions: ['Qxh7#'],
  },
  {
    id: 'm1-arabian-w', fen: '7k/3R4/5N2/p7/8/8/8/6K1 w - - 0 1', mateIn: 1,
    pattern: 'rook and knight (Arabian mate)', title: 'Arabian mate',
    lesson: 'Rook and knight in the corner: the knight guards the rook and the escape square diagonally in front of the king, the rook takes the rest of the box.',
    solutions: ['Rh7#'],
  },
  {
    id: 'm1-supported-queen-knight-w', fen: '5r1k/pp5p/8/5N2/8/6Q1/8/6K1 w - - 0 1', mateIn: 1,
    pattern: 'supported queen', title: 'Queen next to the king',
    lesson: 'A queen adjacent to the king is only mate if the king cannot take it. Count who defends the landing square before you commit.',
    solutions: ['Qg7#'],
  },
  {
    id: 'm1-double-check-w', fen: '3qkr2/5ppp/8/8/4N3/8/6PP/4R1K1 w - - 0 1', mateIn: 1,
    pattern: 'double check', title: 'Double check',
    lesson: 'Against a double check, capturing or blocking is impossible: only the king may move. The knight jump that also gives check itself is the one that mates.',
    solutions: ['Nf6#'],
  },
  {
    id: 'm1-anastasia-w', fen: '5r2/4Nppk/8/8/8/R7/6PP/6K1 w - - 0 1', mateIn: 1,
    pattern: "Anastasia's mate", title: "Anastasia's mate",
    lesson: 'The knight on e7 covers g8 and g6, the pawn on g7 blocks its own king. A rook arriving on the h-file finishes the box.',
    solutions: ['Rh3#'],
  },
  {
    id: 'm1-epaulette-w', fen: '3rkr2/pp4pp/8/8/8/1Q6/6PP/6K1 w - - 0 1', mateIn: 1,
    pattern: 'epaulette mate', title: 'Epaulettes',
    lesson: 'Two rooks flanking their own king like epaulettes take away its side squares. A queen two squares in front, safe from capture, covers everything else.',
    solutions: ['Qe6#'],
  },
  {
    id: 'm1-pawn-supported-queen-w', fen: '5r1k/7p/7P/8/8/6Q1/5PPP/6K1 w - - 0 1', mateIn: 1,
    pattern: 'pawn-supported queen', title: 'A pawn is enough',
    lesson: 'The humble h6 pawn is the whole story: it defends g7, so the queen can sit right next to the king.',
    solutions: ['Qg7#'],
  },
  {
    id: 'm1-boden-w', fen: '2kr4/p2p4/2p5/8/5B2/8/6PP/5BK1 w - - 0 1', mateIn: 1,
    pattern: "Boden's mate", title: "Boden's crisscross",
    lesson: 'Two bishops on crossing diagonals. One already covers b8 and c7; the other arrives with check and takes b7. The king is trapped between its own rook and pawns.',
    solutions: ['Ba6#'],
  },
  {
    id: 'm1-rook-edge-w', fen: '7k/5K2/8/8/8/8/8/R7 w - - 0 1', mateIn: 1,
    pattern: 'king and rook edge mate', title: 'Rook on the edge',
    lesson: 'Basic endgame geometry: your king takes the squares in front of the enemy king, the rook checks along the edge. Check the file, not the rank.',
    solutions: ['Rh1#'],
  },
  {
    id: 'm1-queen-edge-w', fen: '4k3/8/4K3/8/8/8/8/1Q6 w - - 0 1', mateIn: 1,
    pattern: 'king and queen edge mate', title: 'Queen on the edge',
    lesson: 'With the kings in opposition, the queen only needs to land anywhere on the back rank that the enemy king cannot reach.',
    solutions: ['Qb8#'],
  },
  {
    id: 'm1-promotion-w', fen: '7k/p4P2/2n5/8/8/3B4/6PP/6K1 w - - 0 1', mateIn: 1,
    pattern: 'promotion mate', title: 'Promote with care',
    lesson: 'Only one promotion piece covers both g7 and g8. The bishop already watches h7. Rook promotion lets the king slip to g7.',
    solutions: ['f8=Q#'],
  },
  {
    id: 'm1-opera-w', fen: '1n2k3/5ppp/8/6B1/8/8/6PP/3R2K1 w - - 0 1', mateIn: 1,
    pattern: 'Opera mate (rook supported by bishop)', title: 'Opera mate',
    lesson: 'The rook checks on the back rank and the bishop on g5 both protects it and covers e7. The king has nowhere to go.',
    solutions: ['Rd8#'],
  },
  {
    id: 'm1-ladder-w', fen: '7k/R7/8/8/5p2/8/6K1/1R6 w - - 0 1', mateIn: 1,
    pattern: 'two-rook ladder mate', title: 'Ladder',
    lesson: 'One rook seals the seventh rank so the king cannot come forward; the other rook delivers the check on the eighth.',
    solutions: ['Rb8#'],
  },
  {
    id: 'm1-hook-w', fen: '3rkr2/R5pp/1p6/3N4/2P5/8/6PP/6K1 w - - 0 1', mateIn: 1,
    pattern: 'hook mate (rook, knight and pawn)', title: 'Hook mate',
    lesson: 'Rook checks next to the king, the knight protects the rook, the pawn protects the knight. Three pieces linked in a chain, and the king has no square.',
    solutions: ['Re7#'],
  },
  {
    id: 'm1-greco-w', fen: 'rn5k/6p1/8/8/2BQ4/8/6PP/6K1 w - - 0 1', mateIn: 1,
    pattern: "Greco's mate (bishop covers g8)", title: "Greco's mate",
    lesson: 'The bishop on c4 quietly owns g8. That turns a simple queen check down the h-file into mate.',
    solutions: ['Qh4#'],
  },
  {
    id: 'm1-back-rank-b', fen: '3r2k1/5ppp/8/8/8/8/5PPP/6K1 b - - 0 1', mateIn: 1,
    pattern: 'back rank', title: 'Back rank, Black to move',
    lesson: 'Same idea with colors reversed. Before playing it, confirm the rook cannot be captured on the first rank.',
    solutions: ['Rd1#'],
  },
  {
    id: 'm1-smothered-b', fen: '6k1/8/8/8/4n3/8/6PP/6RK b - - 0 1', mateIn: 1,
    pattern: 'smothered mate', title: 'Smothered, Black to move',
    lesson: 'Two knight checks are available. One can be taken by a pawn; the other cannot be touched.',
    solutions: ['Nf2#'],
  },
  {
    id: 'm1-queen-bishop-battery-b', fen: '1b4k1/8/3q4/8/8/8/5PPP/5RK1 b - - 0 1', mateIn: 1,
    pattern: 'queen and bishop battery', title: 'Battery from b8',
    lesson: 'The long diagonal from b8 runs straight to h2. The queen captures, the bishop behind it makes the capture safe.',
    solutions: ['Qxh2#'],
  },
  {
    id: 'm1-arabian-b', fen: '6k1/8/8/8/2P5/5n2/r7/1N5K b - - 0 1', mateIn: 1,
    pattern: 'rook and knight (Arabian mate)', title: 'Arabian, Black to move',
    lesson: 'The knight on f3 already covers g1 and h2. The rook slides along the second rank to a square the knight protects.',
    solutions: ['Rh2#'],
  },
  {
    id: 'm1-double-check-b', fen: '4r1k1/ppp3pp/8/4n3/8/8/5P2/3QKR2 b - - 0 1', mateIn: 1,
    pattern: 'double check', title: 'Double check, Black to move',
    lesson: 'Moving the knight opens the e-file. Only the knight square that also attacks the king and covers d2 leaves White with nothing.',
    solutions: ['Nf3#'],
  },
  {
    id: 'm1-anastasia-b', fen: '6k1/8/r7/8/8/8/4nPPK/5R2 b - - 0 1', mateIn: 1,
    pattern: "Anastasia's mate", title: 'Anastasia, Black to move',
    lesson: 'The knight on e2 takes g1 and g3 away from the king. The rook lift to the h-file does the rest.',
    solutions: ['Rh6#'],
  },
  {
    id: 'm1-epaulette-b', fen: '6k1/8/1q6/8/8/8/PP4PP/3RKR2 b - - 0 1', mateIn: 1,
    pattern: 'epaulette mate', title: 'Epaulettes, Black to move',
    lesson: 'White\'s rooks on d1 and f1 are the epaulettes. A queen on e3 cannot be captured and covers every remaining square.',
    solutions: ['Qe3#'],
  },
  {
    id: 'm1-pawn-supported-queen-b', fen: '6k1/8/6q1/8/8/7p/5P1P/5R1K b - - 0 1', mateIn: 1,
    pattern: 'pawn-supported queen', title: 'The h3 pawn decides',
    lesson: 'The pawn on h3 protects g2, so the queen can land next to the king. Without that pawn the king would simply capture.',
    solutions: ['Qg2#'],
  },
  {
    id: 'm1-promotion-b', fen: '6k1/8/3b4/8/8/2N5/P4p2/7K b - - 0 1', mateIn: 1,
    pattern: 'promotion mate', title: 'Promote with care, Black to move',
    lesson: 'The bishop on d6 already covers h2. Promoting to a queen also covers g2; a rook would let the king out.',
    solutions: ['f1=Q#'],
  },
  {
    id: 'm1-opera-b', fen: '3r2k1/8/8/8/6b1/8/5PPP/1N2K3 b - - 0 1', mateIn: 1,
    pattern: 'Opera mate (rook supported by bishop)', title: 'Opera mate, Black to move',
    lesson: 'The rook lands on d1 with check; the bishop on g4 both protects it and covers e2. Check that the knight on b1 cannot capture.',
    solutions: ['Rd1#'],
  },

  // ---------------------------------------------------------------- mate in 2
  {
    id: 'm2-philidor-legacy-w', fen: '4r2k/p5pp/7N/q7/8/1Q6/6PP/6K1 w - - 0 1', mateIn: 2,
    pattern: "Philidor's legacy (queen sacrifice, smothered mate)", title: "Philidor's legacy",
    lesson: 'Sacrifice the queen on g8 so the rook must capture and complete the box around its own king. Then the knight delivers a smothered mate.',
    solutions: ['Qg8+'],
  },
  {
    id: 'm2-anastasia-w', fen: '2r4k/p3N1pp/3bp3/7Q/8/R7/5PP1/6K1 w - - 0 1', mateIn: 2,
    pattern: "Anastasia's mate (queen sacrifice)", title: 'Anastasia in two',
    lesson: 'Give up the queen on h7 to drag the king onto the h-file. The knight on e7 already covers the escape squares, so a rook lift ends it.',
    solutions: ['Qxh7+'],
  },
  {
    id: 'm2-queen-sac-back-rank-w', fen: '1n4rk/p5pp/4Q3/8/1B6/8/6PP/5RK1 w - - 0 1', mateIn: 2,
    pattern: 'queen sacrifice, back rank', title: 'Clear the back rank',
    lesson: 'The rook on g8 is the only defender of the back rank. Take it with the queen, and the recapture leaves f8 open for a rook protected by the bishop.',
    solutions: ['Qxg8+'],
  },
  {
    id: 'm2-boden-w', fen: '2kr3r/pp1n1pp1/2n5/8/5B2/5Q2/6PP/5BK1 w - - 0 1', mateIn: 2,
    pattern: "Boden's mate (queen sacrifice)", title: 'Boden in two',
    lesson: 'The queen sacrifice on c6 forces the b-pawn to capture, opening the a6-c8 diagonal. The bishop on f4 already covers b8 and c7.',
    solutions: ['Qxc6+'],
  },
  {
    id: 'm2-philidor-legacy-b', fen: '6k1/8/1q6/8/Q7/7n/6PP/4R2K b - - 0 1', mateIn: 2,
    pattern: "Philidor's legacy (queen sacrifice, smothered mate)", title: "Philidor's legacy, Black to move",
    lesson: 'The queen check on g1 cannot be taken by the king because the knight guards g1. The rook must capture, and the knight mates on f2.',
    solutions: ['Qg1+'],
  },
  {
    id: 'm2-anastasia-b', fen: '6k1/6pp/r7/8/7q/3B4/P3nPPP/5R1K b - - 0 1', mateIn: 2,
    pattern: "Anastasia's mate (queen sacrifice)", title: 'Anastasia in two, Black to move',
    lesson: 'Capture on h2 with the queen. The king must take, and the rook on a6 swings to the h-file with the knight covering g1 and g3.',
    solutions: ['Qxh2+'],
  },
  {
    id: 'm2-queen-sac-back-rank-b', fen: '5rk1/p5pp/8/1b6/8/4q3/P5PP/1N4RK b - - 0 1', mateIn: 2,
    pattern: 'queen sacrifice, back rank', title: 'Clear the back rank, Black to move',
    lesson: 'Take the rook on g1 with the queen. After the king recaptures, the rook lands on f1 protected by the bishop from b5.',
    solutions: ['Qxg1+'],
  },
  // ---------------------------------------------------------------- added Sep 2026: standard named patterns
  {
    id: 'm1-damiano-w', fen: '5rk1/pp6/6P1/8/8/7Q/5PP1/6K1 w - - 0 1', mateIn: 1,
    pattern: "Damiano's mate", title: "Damiano's mate",
    lesson: "The pawn on g6 guards h7 and f7. The queen lands on h7, and the rook on f8 blocks the last door.",
    solutions: ["Qh7#"],
  },
  {
    id: 'm1-damiano-2-w', fen: 'r4bk1/p4p2/1p4P1/7Q/8/8/5PP1/6K1 w - - 0 1', mateIn: 1,
    pattern: "Damiano's mate", title: "Damiano's mate",
    lesson: "Same shape, different blocker: the bishop on f8 and the pawn on f7 box the king in. The queen lands on h7, guarded by the g6 pawn.",
    solutions: ["Qh7#"],
  },
  {
    id: 'm1-damiano-bishop-w', fen: '5rk1/pp3pp1/8/8/4Q3/3B4/5PPP/6K1 w - - 0 1', mateIn: 1,
    pattern: "Damiano's bishop mate", title: "Damiano's bishop mate",
    lesson: "The queen steps off the diagonal and the bishop behind her lights it up. Qh7 is guarded, and the rook on f8 blocks the escape.",
    solutions: ["Qh7#"],
  },
  {
    id: 'm1-lolli-w', fen: 'r5k1/pp3p1p/5PpQ/8/8/8/5PPP/6K1 w - - 0 1', mateIn: 1,
    pattern: "Lolli's mate", title: "Lolli's mate",
    lesson: "A white pawn wedged on f6 guards g7. The queen swings in from h6 and the king has nowhere left to stand.",
    solutions: ["Qg7#"],
  },
  {
    id: 'm1-dovetail-w', fen: '1Q2r3/p3kppp/1p6/8/8/8/5PPP/3R2K1 w - - 0 1', mateIn: 1,
    pattern: "dovetail mate", title: "Dovetail mate",
    lesson: "The queen lands diagonally next to the king on d6, guarded by the rook. The king's own rook and pawn fill the two squares she can't reach.",
    solutions: ["Qd6#"],
  },
  {
    id: 'm1-swallow-w', fen: '5r1b/pp4k1/8/7P/8/3Q4/PP6/2K5 w - - 0 1', mateIn: 1,
    pattern: "swallow's tail mate", title: "Swallow's tail mate",
    lesson: "The queen lands straight in front of the king on g6, guarded by the h5 pawn. The rook and bishop behind the king are the forked tail.",
    solutions: ["Qg6#"],
  },
  {
    id: 'm1-morphy-w', fen: 'r6k/pp5p/8/8/7B/8/PP6/K5R1 w - - 0 1', mateIn: 1,
    pattern: "Morphy's mate", title: "Morphy's mate",
    lesson: "The rook owns the g-file and the king's own pawn blocks h7. The bishop only needs to reach the long diagonal.",
    solutions: ["Bf6#"],
  },
  {
    id: 'm1-anderssen-w', fen: 'r5k1/pp4P1/5K2/8/8/8/8/7R w - - 0 1', mateIn: 1,
    pattern: "Anderssen's mate", title: "Anderssen's mate",
    lesson: "The pawn on g7 guards h8, and the king on f6 guards the pawn. The rook drops onto the back rank.",
    solutions: ["Rh8#"],
  },
  {
    id: 'm1-blind-swine-w', fen: '5rk1/1R5R/p7/2p5/8/8/5PPP/6K1 w - - 0 1', mateIn: 1,
    pattern: "blind swine mate", title: "Blind swine mate",
    lesson: "Two rooks on the seventh rank guard each other. The second one arrives on g7 and the king is stuck between them.",
    solutions: ["Rbg7#"],
  },
  {
    id: 'm1-triangle-w', fen: '4kb1r/pp3ppp/8/3R4/6Q1/8/5PPP/6K1 w - - 0 1', mateIn: 1,
    pattern: "triangle mate", title: "Triangle mate",
    lesson: "The queen lands on d7, guarded by the rook two squares behind her. King, queen and rook form a triangle.",
    solutions: ["Qd7#"],
  },
  {
    id: 'm1-corner-w', fen: 'r6k/pp5p/8/4N3/8/8/PP6/K5R1 w - - 0 1', mateIn: 1,
    pattern: "corner mate", title: "Corner mate",
    lesson: "The rook seals the g-file and the king's own pawn blocks h7. A knight jump to f7 finishes it.",
    solutions: ["Nf7#"],
  },
];

// Side to move is in check. answer: 'mate' when there is no legal defense, 'not' otherwise.
export const verdicts = [
  { id: 'v-back-rank-mate', fen: '3R2k1/5ppp/8/8/8/8/5PPP/6K1 b - - 0 1', answer: 'mate',
    lesson: 'No luft, no defender on the back rank, nothing to interpose. This is the textbook back-rank mate.' },
  { id: 'v-back-rank-luft-h6', fen: '3R2k1/5pp1/7p/8/8/8/5PPP/6K1 b - - 0 1', answer: 'not',
    lesson: 'The pawn on h6 instead of h7 leaves h7 open: the king walks out. One pawn step is the difference between mate and nothing.' },
  { id: 'v-back-rank-capture', fen: 'r2R2k1/5ppp/8/8/8/8/5PPP/6K1 b - - 0 1', answer: 'not',
    lesson: 'The pawns still seal the king in, but the rook on a8 simply captures the checking piece.' },
  { id: 'v-back-rank-block', fen: '3R2k1/5ppp/8/2b5/8/8/5PPP/6K1 b - - 0 1', answer: 'not',
    lesson: 'A far-away bishop can interpose on f8. Always scan the whole board for a piece that can reach the line of the check.' },
  { id: 'v-back-rank-luft-g6', fen: '3R2k1/5p1p/6p1/8/8/8/5PPP/6K1 b - - 0 1', answer: 'not',
    lesson: 'The g-pawn has advanced, so g7 is an escape square. The check looks identical to the mate but the box has a hole.' },
  { id: 'v-smothered-mate', fen: '6rk/5Npp/8/8/8/8/8/6K1 b - - 0 1', answer: 'mate',
    lesson: 'Rook, pawns and corner form the box; the knight cannot be captured. Smothered mate.' },
  { id: 'v-smothered-capture', fen: '6rk/5Npp/8/3q4/8/8/8/6K1 b - - 0 1', answer: 'not',
    lesson: 'Same box, but the queen on d5 sees f7 and takes the knight. A smothered mate needs the checking knight to be untouchable.' },
  { id: 'v-battery-mate', fen: '5rk1/5ppQ/8/8/8/8/6PP/1B4K1 b - - 0 1', answer: 'mate',
    lesson: 'The queen on h7 is protected from behind by the bishop on b1, so the king cannot take it. Mate.' },
  { id: 'v-battery-king-takes', fen: '5rk1/5ppQ/8/8/8/8/6PP/6K1 b - - 0 1', answer: 'not',
    lesson: 'Remove the bishop and the same queen check is just a blunder: the king captures on h7.' },
  { id: 'v-arabian-mate', fen: '7k/7R/5N2/8/8/8/8/6K1 b - - 0 1', answer: 'mate',
    lesson: 'The knight on f6 defends the rook and covers g8; the rook covers g7 and the h-file. Nothing is left.' },
  { id: 'v-greco-block', fen: 'rn5k/6p1/5n2/8/2B4Q/8/6PP/6K1 b - - 0 1', answer: 'not',
    lesson: 'The king has no squares, but a check along a line can be blocked: the knight from f6 interposes on h7 or h5.' },
  { id: 'v-double-check-mate', fen: '3qkr2/5ppp/5N2/8/8/8/6PP/4R1K1 b - - 0 1', answer: 'mate',
    lesson: 'Double check from rook and knight. Capturing or blocking one attacker never answers the other, and the king has no square. Mate.' },
  { id: 'v-double-check-escape', fen: '3qkr2/5ppp/3N4/8/8/8/6PP/4R1K1 b - - 0 1', answer: 'not',
    lesson: 'Also a double check, but the knight on d6 does not cover d7. The king steps out. Double check is only mate when the box is complete.' },
  { id: 'v-epaulette-mate', fen: '3rkr2/pp4pp/4Q3/8/8/8/6PP/6K1 b - - 0 1', answer: 'mate',
    lesson: 'The rooks on d8 and f8 block their own king, the queen on e6 covers d7, e7 and f7 and cannot be captured.' },
  { id: 'v-anastasia-mate', fen: '5r2/4Nppk/8/7R/8/8/6PP/6K1 b - - 0 1', answer: 'mate',
    lesson: 'Rook on the h-file, knight covering g8 and g6, own pawn on g7. The rook on f8 cannot reach h-file squares between the rook and the king.' },
  { id: 'v-white-luft-escape', fen: '6k1/8/8/8/8/8/5P1P/4r1K1 w - - 0 1', answer: 'not',
    lesson: 'The g-pawn is missing, so g2 is free. The rook check on the first rank is not mate.' },
  { id: 'v-white-block', fen: '6k1/8/8/8/8/3B4/5PPP/r5K1 w - - 0 1', answer: 'not',
    lesson: 'The bishop on d3 can drop back to f1 or b1 and block the rank. A blocked check is not mate.' },
  { id: 'v-white-capture', fen: '6k1/8/8/8/3Q4/8/5PPP/r5K1 w - - 0 1', answer: 'not',
    lesson: 'The queen on d4 captures the rook along the long diagonal (or blocks on d1). Look for long-range defenders.' },
  { id: 'v-white-opera-mate', fen: '3r2k1/8/8/8/6b1/8/5PPP/1N1rK3 w - - 0 1', answer: 'mate',
    lesson: 'Rook on d1 protected by the bishop on g4, which also covers e2. The knight on b1 does not reach d1. Mate.' },
  { id: 'v-en-passant-capture', fen: '8/2N5/8/4k3/3Pp3/B1P5/8/K4R2 b - d3 0 1', answer: 'not',
    lesson: 'White just played d2-d4 with check and every king square is covered, yet it is not mate: the e4 pawn captures the checker en passant. Special rules count as defenses.' },
];
