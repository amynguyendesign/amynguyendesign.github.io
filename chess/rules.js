// rules.js — chess rules layer for the Studio mate trainer.
// ES module. Depends only on the vendored chess.js (v1.4.0, BSD-2-Clause) in ./vendor/.
// No network, no build step. Exports: Chess, kingBox, inspectCheck, assessMove, matingMoves, winningMoves,
// plus small helpers (attackersOf, kingSquare, otherColor).

import { Chess, SQUARES } from './vendor/chess.js';
export { Chess, SQUARES };

const FILES = 'abcdefgh';
const PIECE_NAMES = { p: 'pawn', n: 'knight', b: 'bishop', r: 'rook', q: 'queen', k: 'king' };
const KNIGHT_STEPS = [[1, 2], [2, 1], [2, -1], [1, -2], [-1, -2], [-2, -1], [-2, 1], [-1, 2]];
const KING_STEPS = [[1, 0], [1, 1], [0, 1], [-1, 1], [-1, 0], [-1, -1], [0, -1], [1, -1]];
const DIAG_STEPS = [[1, 1], [1, -1], [-1, 1], [-1, -1]];
const ORTHO_STEPS = [[1, 0], [-1, 0], [0, 1], [0, -1]];

export function otherColor(color) {
  return color === 'w' ? 'b' : 'w';
}

function toCoords(square) {
  return [FILES.indexOf(square[0]), Number(square[1]) - 1];
}

function toSquare(file, rank) {
  if (file < 0 || file > 7 || rank < 0 || rank > 7) return null;
  return FILES[file] + (rank + 1);
}

// Board snapshot as a Map<square, {type, color}> so we can freely remove/move pieces
// without asking chess.js to validate an intermediate position.
function snapshot(chess) {
  const map = new Map();
  for (const row of chess.board()) {
    for (const cell of row) {
      if (cell) map.set(cell.square, { type: cell.type, color: cell.color });
    }
  }
  return map;
}

function loadFen(fen) {
  // Chess constructor throws on structurally invalid FEN; let that propagate with a clear message.
  try {
    return new Chess(fen);
  } catch (err) {
    throw new Error('rules.js: invalid FEN "' + fen + '": ' + (err && err.message ? err.message : err));
  }
}

export function kingSquare(board, color) {
  for (const [sq, piece] of board) {
    if (piece.type === 'k' && piece.color === color) return sq;
  }
  return null;
}

/**
 * All squares from which `byColor` pieces attack `square` on the given board map.
 * This is the pure chess definition of "attack": it ignores pins and whose turn it is
 * (a pinned piece still gives check), pawns attack diagonally only, kings attack adjacent squares,
 * sliders stop at the first occupied square.
 */
export function attackersOf(board, square, byColor) {
  const [f, r] = toCoords(square);
  const out = [];
  const pieceAt = (file, rank) => {
    const sq = toSquare(file, rank);
    return sq ? [sq, board.get(sq)] : [null, undefined];
  };
  // Pawns: a white pawn on (f-1, r-1)/(f+1, r-1) attacks square; black from rank above.
  const pawnRank = byColor === 'w' ? r - 1 : r + 1;
  for (const df of [-1, 1]) {
    const [sq, p] = pieceAt(f + df, pawnRank);
    if (p && p.color === byColor && p.type === 'p') out.push(sq);
  }
  for (const [df, dr] of KNIGHT_STEPS) {
    const [sq, p] = pieceAt(f + df, r + dr);
    if (p && p.color === byColor && p.type === 'n') out.push(sq);
  }
  for (const [df, dr] of KING_STEPS) {
    const [sq, p] = pieceAt(f + df, r + dr);
    if (p && p.color === byColor && p.type === 'k') out.push(sq);
  }
  const slide = (steps, types) => {
    for (const [df, dr] of steps) {
      let file = f + df, rank = r + dr;
      while (true) {
        const [sq, p] = pieceAt(file, rank);
        if (!sq) break;
        if (p) {
          if (p.color === byColor && types.includes(p.type)) out.push(sq);
          break;
        }
        file += df; rank += dr;
      }
    }
  };
  slide(DIAG_STEPS, ['b', 'q']);
  slide(ORTHO_STEPS, ['r', 'q']);
  return out.sort();
}

function describePiece(board, sq) {
  const p = board.get(sq);
  return p ? PIECE_NAMES[p.type] + ' on ' + sq : sq;
}

function joinList(items) {
  if (items.length <= 1) return items[0] || '';
  return items.slice(0, -1).join(', ') + ' and ' + items[items.length - 1];
}

/**
 * kingBox(fen, color?) — the eight squares around a king, each classified for a king step.
 * color defaults to the side NOT to move (the king being hunted) unless the side to move is
 * in check, in which case it is the side to move.
 * Returns [{square, status: 'blocked'|'covered'|'escape', attackers: [squares], reason}]
 * - blocked: occupied by a friendly piece (or the enemy king, which can never be captured)
 * - covered: after the king steps there (leaving its origin, capturing whatever enemy piece stood there)
 *            at least one enemy piece would attack the square. X-rays through the vacated origin count.
 * - escape:  the king could legally stand there (ignoring castling, which is never a "box" move).
 */
export function kingBox(fen, color) {
  const chess = loadFen(fen);
  const turn = chess.turn();
  const target = color === 'w' || color === 'b' ? color : (chess.inCheck() ? turn : otherColor(turn));
  const enemy = otherColor(target);
  const board = snapshot(chess);
  const king = kingSquare(board, target);
  if (!king) return [];
  const [kf, kr] = toCoords(king);
  const result = [];
  for (const [df, dr] of KING_STEPS) {
    const sq = toSquare(kf + df, kr + dr);
    if (!sq) continue;
    const occupant = board.get(sq);
    if (occupant && occupant.color === target) {
      result.push({
        square: sq, status: 'blocked', attackers: [],
        reason: 'Blocked by its own ' + PIECE_NAMES[occupant.type] + '.',
      });
      continue;
    }
    if (occupant && occupant.type === 'k') {
      result.push({
        square: sq, status: 'blocked', attackers: [],
        reason: 'Occupied by the enemy king, which can never be captured.',
      });
      continue;
    }
    // Simulate the king step: vacate the origin, remove any captured enemy piece, place the king.
    const after = new Map(board);
    after.delete(king);
    after.delete(sq);
    after.set(sq, { type: 'k', color: target });
    const attackers = attackersOf(after, sq, enemy);
    if (attackers.length) {
      const before = attackersOf(board, sq, enemy);
      const xray = attackers.filter((a) => !before.includes(a));
      const names = attackers.map((a) => describePiece(board, a));
      let reason = (occupant ? 'Capturing the ' + PIECE_NAMES[occupant.type] + ' here is not safe: ' : 'Covered by the ') +
        joinList(names) + (occupant ? ' would still attack it.' : '.');
      if (xray.length) {
        reason += ' (The ' + joinList(xray.map((a) => describePiece(board, a))) +
          (xray.length > 1 ? ' see' : ' sees') + ' through the square the king leaves.)';
      }
      result.push({ square: sq, status: 'covered', attackers, reason });
    } else {
      result.push({
        square: sq, status: 'escape', attackers: [],
        reason: occupant
          ? 'The king can capture the ' + PIECE_NAMES[occupant.type] + ' here safely.'
          : 'Open square: nothing attacks it once the king steps here.',
      });
    }
  }
  return result.sort((a, b) => (a.square < b.square ? -1 : a.square > b.square ? 1 : 0));
}

function moveObj(m) {
  const o = { from: m.from, to: m.to, san: m.san };
  if (m.promotion) o.promotion = m.promotion;
  return o;
}

function isEnPassant(m) {
  return typeof m.isEnPassant === 'function' ? m.isEnPassant() : String(m.flags || '').includes('e');
}

function isCapture(m) {
  return typeof m.isCapture === 'function' ? m.isCapture() || isEnPassant(m) : /[ce]/.test(String(m.flags || ''));
}

/**
 * inspectCheck(fen) — is the side to move in check, and if so what are ALL its legal defenses?
 * Every legal move is placed in exactly one bucket:
 *   escape:  any king move (including the king capturing the checking piece)
 *   capture: a non-king move that captures a checking piece (en passant included)
 *   block:   every other legal move (interpositions; in double check this is always empty)
 * mate/stalemate come from the legal move generator, not from the buckets.
 */
export function inspectCheck(fen) {
  const chess = loadFen(fen);
  const turn = chess.turn();
  const board = snapshot(chess);
  const king = kingSquare(board, turn);
  const check = chess.inCheck();
  const mate = chess.isCheckmate();
  const stalemate = chess.isStalemate();
  const out = { check, mate, stalemate, king, checkers: [], escape: [], capture: [], block: [] };
  if (!check) return out;
  out.checkers = attackersOf(board, king, otherColor(turn));
  for (const m of chess.moves({ verbose: true })) {
    const o = moveObj(m);
    if (m.piece === 'k') {
      out.escape.push(o);
    } else if (out.checkers.includes(m.to)) {
      out.capture.push(o);
    } else if (isEnPassant(m)) {
      const capturedPawn = m.to[0] + (turn === 'w' ? '5' : '4');
      if (out.checkers.includes(capturedPawn)) out.capture.push(o); else out.block.push(o);
    } else {
      out.block.push(o);
    }
  }
  return out;
}

function tryMove(chess, move) {
  try {
    return chess.move({ from: move.from, to: move.to, promotion: move.promotion || undefined });
  } catch (err) {
    return null;
  }
}

// chess.js already computes '#' in each verbose move's SAN (it plays the move and runs the legal
// move generator for the opponent). Filtering on that suffix, then confirming with isCheckmate,
// is far cheaper than replaying every move a second time.
function matesOn(chess) {
  const out = [];
  for (const m of chess.moves({ verbose: true })) {
    if (!m.san.endsWith('#')) continue;
    chess.move(m);
    const mate = chess.isCheckmate();
    chess.undo();
    if (mate) out.push(moveObj(m));
  }
  return out;
}

/**
 * matingMoves(fen) — every legal move that gives checkmate immediately.
 */
export function matingMoves(fen) {
  return matesOn(loadFen(fen));
}

/**
 * winningMoves(fen, mateIn=1) — first moves that force mate in at most `mateIn` moves.
 * mateIn=1: immediate mates. mateIn=n: moves after which EVERY legal reply leaves a forced
 * mate in n-1 (immediate mates also count; a move that leaves the opponent no legal reply
 * without mating is a stalemate and never counts). Designed for mateIn 1 or 2.
 */
export function winningMoves(fen, mateIn = 1) {
  const chess = loadFen(fen);
  if (mateIn <= 1) return matesOn(chess);
  const out = [];
  for (const m of chess.moves({ verbose: true })) {
    chess.move(m);
    const analysis = forcedMateAfter(chess, mateIn - 1, true);
    chess.undo();
    if (analysis.forced) out.push(moveObj(m));
  }
  return out;
}

// Given a position where the DEFENDER is to move, decide whether every legal reply allows the
// attacker a forced mate in `depth` more moves. Returns {forced, mate, replies:[{move, fen, mates}]}.
// With earlyExit the scan stops at the first refutation (enough for a yes/no answer).
function forcedMateAfter(chess, depth, earlyExit = false) {
  if (chess.isCheckmate()) return { forced: true, mate: true, replies: [] };
  const replies = chess.moves({ verbose: true });
  if (!replies.length) return { forced: false, mate: false, replies: [] };
  const report = [];
  let forced = true;
  for (const r of replies) {
    chess.move(r);
    const fenAfter = chess.fen();
    const mates = depth <= 1 ? matesOn(chess) : winningMoves(fenAfter, depth);
    chess.undo();
    report.push({ move: r, fen: fenAfter, mates });
    if (!mates.length) {
      forced = false;
      if (earlyExit) break;
    }
  }
  return { forced, mate: false, replies: report };
}

// Rank candidate defenses so the "reply" we hand back is the most instructive one:
// the defense that leaves the FEWEST mating continuations is the hardest to answer.
// Ties: prefer checks, then captures, then non-king moves, then SAN for determinism.
function pickDefense(replies) {
  const scored = replies.map((r) => ({
    r,
    key: [
      r.mates.length,
      r.move.san.includes('+') ? 0 : 1,
      isCapture(r.move) ? 0 : 1,
      r.move.piece === 'k' ? 1 : 0,
      r.move.san,
    ],
  }));
  scored.sort((a, b) => {
    for (let i = 0; i < a.key.length; i++) {
      if (a.key[i] < b.key[i]) return -1;
      if (a.key[i] > b.key[i]) return 1;
    }
    return 0;
  });
  return scored[0].r;
}

/**
 * assessMove(fen, move, mateIn=1)
 * move = {from, to, promotion?}. Returns {legal:false} for anything chess.js rejects, otherwise
 * {legal:true, fen, san, mate, winning, reply?, replyFen?, defenses?}
 * - mateIn 1: winning === mate.
 * - mateIn 2: winning when every legal reply allows mate in 1 (an immediate mate also counts).
 *   On success, `reply`/`replyFen` give one instructive defense (fewest mating answers) so the
 *   UI can ask for the finishing move. On failure `defenses` lists every reply after which no
 *   mate in 1 exists (each with the resulting fen) — the counterexamples.
 * `fen` is always the position after the move so the UI can show the king box / defenses.
 */
export function assessMove(fen, move, mateIn = 1) {
  const chess = loadFen(fen);
  if (!move || !move.from || !move.to) return { legal: false };
  const m = tryMove(chess, move);
  if (!m) return { legal: false };
  const result = { legal: true, fen: chess.fen(), san: m.san, mate: chess.isCheckmate(), winning: false };
  if (mateIn <= 1) {
    result.winning = result.mate;
    return result;
  }
  if (result.mate) {
    result.winning = true; // mated faster than required
    return result;
  }
  const analysis = forcedMateAfter(chess, mateIn - 1);
  if (!analysis.forced) {
    result.defenses = analysis.replies
      .filter((r) => !r.mates.length)
      .map((r) => Object.assign(moveObj(r.move), { fen: r.fen }));
    return result;
  }
  result.winning = true;
  const chosen = pickDefense(analysis.replies);
  result.reply = moveObj(chosen.move);
  result.replyFen = chosen.fen;
  return result;
}
