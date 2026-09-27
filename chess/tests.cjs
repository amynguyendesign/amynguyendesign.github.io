#!/usr/bin/env node
// Contract tests for mate/rules.js and cross-check of mate/puzzles.js through the same engine.
// Run:  node mate/tests.cjs        (Node 18+, no dependencies; uses dynamic import of the ES modules)
'use strict';
const path = require('path');
const { pathToFileURL } = require('url');

let failures = 0, passes = 0;
function eq(actual, expected, label) {
  const a = JSON.stringify(actual), e = JSON.stringify(expected);
  if (a === e) { passes++; return; }
  failures++; console.log('FAIL ' + label + '\n   expected ' + e + '\n   actual   ' + a);
}
function ok(cond, label) { if (cond) passes++; else { failures++; console.log('FAIL ' + label); } }
const sans = (moves) => moves.map((m) => m.san).sort();
const byStatus = (box, status) => box.filter((b) => b.status === status).map((b) => b.square);

(async () => {
  const dir = pathToFileURL(__dirname + path.sep).href;
  const R = await import(dir + 'rules.js');
  const D = await import(dir + 'puzzles.js');

  // ---------------------------------------------------------------- kingBox
  // Default color: hunted king (side not to move) when not in check.
  let box = R.kingBox('6k1/5ppp/8/8/8/8/5PPP/3R2K1 w - - 0 1');
  eq(box.map((b) => b.square), ['f7', 'f8', 'g7', 'h7', 'h8'], 'kingBox: only on-board squares around g8');
  eq(byStatus(box, 'blocked'), ['f7', 'g7', 'h7'], 'kingBox: own pawns are blocked');
  eq(byStatus(box, 'escape'), ['f8', 'h8'], 'kingBox: open back-rank squares are escapes before the check');
  // Default color: side to move when it is in check.
  box = R.kingBox('3R2k1/5ppp/8/8/8/8/5PPP/6K1 b - - 0 1');
  eq(byStatus(box, 'covered'), ['f8', 'h8'], 'kingBox: in check, defaults to the checked king; rook covers f8/h8');
  eq(box.find((b) => b.square === 'f8').attackers, ['d8'], 'kingBox: attackers listed by square');
  // Explicit color argument.
  box = R.kingBox('3R2k1/5ppp/8/8/8/8/5PPP/6K1 b - - 0 1', 'w');
  eq(box.map((b) => b.square), ['f1', 'f2', 'g2', 'h1', 'h2'], 'kingBox: explicit color selects the white king');
  // X-ray through the vacated origin: rook on d3 covers d7 even though the king on d6 stands in between.
  box = R.kingBox('8/8/3k4/8/8/3R4/8/4K3 w - - 0 1');
  eq(byStatus(box, 'covered'), ['d5', 'd7'], 'kingBox: x-ray through the king square counts');
  ok(/through the square the king leaves/.test(box.find((b) => b.square === 'd7').reason), 'kingBox: x-ray reason mentions the vacated square');
  // Capturing on the destination: the captured piece no longer defends, but other attackers do.
  box = R.kingBox('7k/6R1/4N3/8/8/8/8/6K1 w - - 0 1');
  eq(box.find((b) => b.square === 'g7'), { square: 'g7', status: 'covered', attackers: ['e6'], reason: 'Capturing the rook here is not safe: knight on e6 would still attack it.' }, 'kingBox: protected piece cannot be captured');
  box = R.kingBox('7k/6R1/8/8/8/8/8/6K1 w - - 0 1');
  eq(box.find((b) => b.square === 'g7').status, 'escape', 'kingBox: unprotected piece can be captured');
  // Pinned pieces still attack: the white rook on b1 is pinned by Ra1 against Ke1, yet covers b7/b8.
  box = R.kingBox('k7/8/8/8/8/8/8/rR2K3 w - - 0 1', 'b');
  eq(byStatus(box, 'covered'), ['b7', 'b8'], 'kingBox: pinned rook still covers squares');
  // Pawn attack direction is respected.
  box = R.kingBox('8/8/8/3k4/8/2P1P3/8/4K3 w - - 0 1', 'b');
  eq(byStatus(box, 'covered'), ['d4'], 'kingBox: white pawns attack diagonally forward (c3,e3 cover d4 only)');
  box = R.kingBox('4k3/8/8/8/8/8/3p1p2/4K3 w - - 0 1', 'w');
  eq(byStatus(box, 'covered'), [], 'kingBox: black pawns on d2/f2 attack e1 itself, not any box square');
  box = R.kingBox('4k3/8/8/8/8/8/2p3p1/4K3 w - - 0 1', 'w');
  eq(byStatus(box, 'covered'), ['d1', 'f1'], 'kingBox: black pawns c2/g2 cover d1 and f1');
  // Enemy king covers adjacent squares (kings can never touch).
  box = R.kingBox('8/8/8/3k4/8/3K4/8/8 w - - 0 1', 'b');
  eq(byStatus(box, 'covered'), ['c4', 'd4', 'e4'], 'kingBox: enemy king covers the squares next to it');

  // ---------------------------------------------------------------- inspectCheck
  let ic = R.inspectCheck('6k1/5ppp/8/8/8/8/5PPP/3R2K1 w - - 0 1');
  eq(ic, { check: false, mate: false, stalemate: false, king: 'g1', checkers: [], escape: [], capture: [], block: [] }, 'inspectCheck: no check -> empty arrays');
  ic = R.inspectCheck('r2R2k1/5ppp/8/8/8/8/5PPP/6K1 b - - 0 1');
  eq([ic.check, ic.mate, ic.checkers, sans(ic.capture), ic.escape.length, ic.block.length], [true, false, ['d8'], ['Rxd8'], 0, 0], 'inspectCheck: capture bucket');
  ic = R.inspectCheck('3R2k1/5ppp/8/2b5/8/8/5PPP/6K1 b - - 0 1');
  eq([sans(ic.block), ic.capture.length, ic.escape.length], [['Bf8'], 0, 0], 'inspectCheck: block bucket');
  ic = R.inspectCheck('5rk1/5ppQ/8/8/8/8/6PP/6K1 b - - 0 1');
  eq([sans(ic.escape), ic.capture.length], [['Kxh7'], 0], 'inspectCheck: king takes checker is an escape, not a capture');
  ic = R.inspectCheck('3qkr2/5ppp/5N2/8/8/8/6PP/4R1K1 b - - 0 1');
  eq([ic.mate, ic.checkers, ic.escape.length + ic.capture.length + ic.block.length], [true, ['e1', 'f6'], 0], 'inspectCheck: double check mate, both checkers listed');
  ic = R.inspectCheck('3qkr2/5ppp/3N4/8/8/8/6PP/4R1K1 b - - 0 1');
  eq([ic.mate, sans(ic.escape), ic.capture.length, ic.block.length], [false, ['Kd7'], 0, 0], 'inspectCheck: double check, only king moves');
  ic = R.inspectCheck('8/2N5/8/4k3/3Pp3/B1P5/8/K4R2 b - d3 0 1');
  eq([ic.mate, sans(ic.capture), ic.escape.length, ic.block.length], [false, ['exd3'], 0, 0], 'inspectCheck: en passant capture of the checking pawn is a capture');
  ic = R.inspectCheck('7k/5Q2/5K2/8/8/8/8/8 b - - 0 1');
  eq([ic.check, ic.mate, ic.stalemate], [false, false, true], 'inspectCheck: stalemate reported');
  ic = R.inspectCheck('3R2k1/5ppp/8/8/8/8/5PPP/6K1 b - - 0 1');
  eq([ic.check, ic.mate, ic.stalemate], [true, true, false], 'inspectCheck: mate reported by legal move generator');
  // Every legal move lands in exactly one bucket.
  for (const v of D.verdicts) {
    const r = R.inspectCheck(v.fen);
    const c = new R.Chess(v.fen);
    ok(r.check, 'verdict in check: ' + v.id);
    eq(r.escape.length + r.capture.length + r.block.length, c.moves().length, 'inspectCheck partitions all legal moves: ' + v.id);
    eq(r.mate ? 'mate' : 'not', v.answer, 'verdict answer matches engine: ' + v.id);
  }

  // ---------------------------------------------------------------- assessMove
  let a = R.assessMove('6k1/5ppp/8/8/8/8/5PPP/3R2K1 w - - 0 1', { from: 'd1', to: 'd8' });
  eq([a.legal, a.san, a.mate, a.winning], [true, 'Rd8#', true, true], 'assessMove: mate in 1 winning');
  a = R.assessMove('6k1/5ppp/8/8/8/8/5PPP/3R2K1 w - - 0 1', { from: 'd1', to: 'd7' });
  eq([a.legal, a.san, a.mate, a.winning, typeof a.fen], [true, 'Rd7', false, false, 'string'], 'assessMove: legal non-mate returns fen for the UI');
  eq(R.assessMove('6k1/5ppp/8/8/8/8/5PPP/3R2K1 w - - 0 1', { from: 'd1', to: 'e2' }), { legal: false }, 'assessMove: illegal move');
  eq(R.assessMove('6k1/5ppp/8/8/8/8/5PPP/3R2K1 w - - 0 1', { from: 'g8', to: 'h8' }), { legal: false }, 'assessMove: moving the wrong side is illegal');
  eq(R.assessMove('7k/p4P2/2n5/8/8/3B4/6PP/6K1 w - - 0 1', { from: 'f7', to: 'f8' }), { legal: false }, 'assessMove: promotion requires a promotion piece');
  a = R.assessMove('7k/p4P2/2n5/8/8/3B4/6PP/6K1 w - - 0 1', { from: 'f7', to: 'f8', promotion: 'r' });
  eq([a.legal, a.san, a.winning], [true, 'f8=R+', false], 'assessMove: rook promotion is legal but not mate');
  a = R.assessMove('7k/p4P2/2n5/8/8/3B4/6PP/6K1 w - - 0 1', { from: 'f7', to: 'f8', promotion: 'q' });
  eq([a.san, a.winning], ['f8=Q#', true], 'assessMove: queen promotion mates');
  // mate in 2
  a = R.assessMove('4r2k/p5pp/7N/q7/8/1Q6/6PP/6K1 w - - 0 1', { from: 'b3', to: 'g8' }, 2);
  eq([a.legal, a.san, a.mate, a.winning, a.reply, a.replyFen], [true, 'Qg8+', false, true, { from: 'e8', to: 'g8', san: 'Rxg8' }, '6rk/p5pp/7N/q7/8/8/6PP/6K1 w - - 0 2'], 'assessMove: mate-in-2 winning move returns the forced reply');
  eq(sans(R.matingMoves(a.replyFen)), ['Nf7#'], 'assessMove: replyFen has the finishing mate');
  a = R.assessMove('4r2k/p5pp/7N/q7/8/1Q6/6PP/6K1 w - - 0 1', { from: 'h6', to: 'f7' }, 2);
  eq([a.winning, a.defenses.map((d) => d.san)], [false, ['Kg8']], 'assessMove: wrong mate-in-2 move lists refuting defenses');
  ok(a.defenses[0].fen.split(' ')[1] === 'w', 'assessMove: defense fen is the position after the defense');
  a = R.assessMove('4r2k/p5pp/7N/q7/8/1Q6/6PP/6K1 w - - 0 1', { from: 'b3', to: 'b7' }, 2);
  eq(a.winning, false, 'assessMove: quiet non-winning move in mate-in-2 mode');
  ok(a.defenses.length > 0, 'assessMove: quiet non-winning move has counterexamples');
  // A mate in 1 during mate-in-2 mode counts as winning (faster than required).
  a = R.assessMove('6k1/5ppp/8/8/8/8/5PPP/3R2K1 w - - 0 1', { from: 'd1', to: 'd8' }, 2);
  eq([a.mate, a.winning, a.reply], [true, true, undefined], 'assessMove: immediate mate in mate-in-2 mode');
  // Stalemating the opponent is never winning.
  a = R.assessMove('7k/8/6K1/8/8/8/8/5Q2 w - - 0 1', { from: 'f1', to: 'f7' }, 2);
  eq([a.legal, a.winning, a.mate], [true, false, false], 'assessMove: stalemate is not winning');

  // ---------------------------------------------------------------- matingMoves / winningMoves
  eq(sans(R.matingMoves('6rk/6pp/8/4N3/8/8/8/6K1 w - - 0 1')), ['Nf7#'], 'matingMoves: smothered');
  eq(R.matingMoves('6k1/5ppp/8/8/8/8/5PPP/6K1 w - - 0 1'), [], 'matingMoves: none');
  eq(R.winningMoves('6rk/6pp/8/4N3/8/8/8/6K1 w - - 0 1'), R.matingMoves('6rk/6pp/8/4N3/8/8/8/6K1 w - - 0 1'), 'winningMoves(fen,1) === matingMoves');
  eq(sans(R.winningMoves('4r2k/p5pp/7N/q7/8/1Q6/6PP/6K1 w - - 0 1', 2)), ['Qg8+'], 'winningMoves depth 2');
  // Two mating moves are both accepted (no pretence of uniqueness).
  eq(sans(R.matingMoves('6k1/5ppp/8/8/8/8/5PPP/R2R2K1 w - - 0 1')), ['Ra8#', 'Rd8#'], 'matingMoves: all mates returned');

  // ---------------------------------------------------------------- data cross-check through the engine
  const ids = new Set();
  let m1 = 0, m2 = 0; const colors = new Set();
  const t0 = Date.now();
  for (const p of D.puzzles) {
    ok(!ids.has(p.id), 'unique id ' + p.id); ids.add(p.id);
    for (const k of ['id', 'fen', 'mateIn', 'pattern', 'title', 'lesson']) ok(p[k], p.id + ' has ' + k);
    const c = new R.Chess(p.fen);
    colors.add(c.turn());
    ok(!c.isGameOver(), p.id + ' not already over');
    const w = R.winningMoves(p.fen, p.mateIn);
    ok(w.length > 0, p.id + ' solvable');
    eq(sans(w), [...p.solutions].sort(), p.id + ' documented solutions == exhaustive winning moves');
    if (p.mateIn === 2) { eq(R.matingMoves(p.fen), [], p.id + ' has no mate in 1'); m2++; } else m1++;
    for (const mv of w) {
      const res = R.assessMove(p.fen, mv, p.mateIn);
      ok(res.legal && res.winning, p.id + ' assessMove accepts ' + mv.san);
      if (p.mateIn === 2 && !res.mate) ok(R.matingMoves(res.replyFen).length > 0, p.id + ' replyFen solvable in 1');
    }
  }
  for (const v of D.verdicts) { ok(!ids.has(v.id), 'unique id ' + v.id); ids.add(v.id); ok(v.lesson && v.fen && v.answer, v.id + ' fields'); }
  ok(m1 >= 24, 'at least 24 mate-in-1 (' + m1 + ')');
  ok(m2 >= 6, 'at least 6 mate-in-2 (' + m2 + ')');
  ok(D.verdicts.length >= 12, 'at least 12 verdicts (' + D.verdicts.length + ')');
  ok(colors.has('w') && colors.has('b'), 'both colors to move');
  ok(typeof D.provenance === 'string' && D.provenance.length > 50, 'provenance string');
  console.log('data cross-check in ' + (Date.now() - t0) + ' ms');

  console.log(failures ? failures + ' FAILURE(S), ' + passes + ' passed' : 'ALL ' + passes + ' CHECKS PASSED');
  process.exit(failures ? 1 : 0);
})().catch((e) => { console.error(e); process.exit(1); });
