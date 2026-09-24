#!/usr/bin/env python3
"""Independent verification of mate/puzzles.js with python-chess.

Reproduce:  cd mate && python validate.py
Needs: python-chess (pip install chess) and node (to read the ES module data).
Checks every puzzle: valid legal position (Board.is_valid), not already over, correct side to move,
exhaustive search finds the mate (mate-in-2: no mate-in-1 exists, and at least one first move after
which EVERY legal reply allows a mate-in-1). Checks every verdict: side to move is in check and
answer matches Board.is_checkmate(). Exits 1 on any failure.
"""
import json, os, subprocess, sys
import chess

HERE = os.path.dirname(os.path.abspath(__file__))


def load_data():
    js = ("import('./puzzles.js').then(m => console.log(JSON.stringify("
          "{puzzles: m.puzzles, verdicts: m.verdicts, provenance: m.provenance})))")
    out = subprocess.run(["node", "--no-warnings", "--input-type=module", "-e", js],
                         cwd=HERE, capture_output=True, text=True, check=True)
    return json.loads(out.stdout)


def mates_in_1(board):
    res = []
    for m in board.legal_moves:
        board.push(m)
        mate = board.is_checkmate()
        board.pop()
        if mate:
            res.append(board.san(m))
    return res


def winning_first_moves_mate_in_2(board):
    """First moves after which every legal reply allows a mate in 1 (immediate mates excluded)."""
    win = []
    for m in list(board.legal_moves):
        board.push(m)
        if board.is_checkmate():
            board.pop()
            continue
        replies = list(board.legal_moves)
        ok = bool(replies)
        for r in replies:
            board.push(r)
            ok = ok and bool(mates_in_1(board))
            board.pop()
            if not ok:
                break
        board.pop()
        if ok:
            win.append(m)
    return win


def classify(board):
    kinds = {"escape": [], "capture": [], "block": []}
    checkers = board.checkers()
    for m in board.legal_moves:
        if board.piece_at(m.from_square).piece_type == chess.KING:
            kinds["escape"].append(board.san(m))
        elif m.to_square in checkers or board.is_en_passant(m):
            kinds["capture"].append(board.san(m))
        else:
            kinds["block"].append(board.san(m))
    return kinds


def main():
    data = load_data()
    puzzles, verdicts = data["puzzles"], data["verdicts"]
    failures = []

    def fail(msg):
        failures.append(msg)
        print("FAIL", msg)

    ids = [p["id"] for p in puzzles] + [v["id"] for v in verdicts]
    if len(ids) != len(set(ids)):
        fail("duplicate ids")
    for p in puzzles:
        for key in ("id", "fen", "mateIn", "pattern", "title", "lesson"):
            if not p.get(key):
                fail(f"{p.get('id')}: missing {key}")
        b = chess.Board(p["fen"])
        if not b.is_valid():
            fail(f"{p['id']}: invalid position status={b.status()!r}")
            continue
        if b.is_game_over():
            fail(f"{p['id']}: already game over")
            continue
        m1 = mates_in_1(b)
        if p["mateIn"] == 1:
            if not m1:
                fail(f"{p['id']}: no mate in 1")
            if sorted(m1) != sorted(p.get("solutions", m1)):
                fail(f"{p['id']}: solutions list {p.get('solutions')} != exhaustive {m1}")
            print(f"ok  {p['id']:34} mate in 1  {m1}")
        elif p["mateIn"] == 2:
            if m1:
                fail(f"{p['id']}: has mate in 1 {m1}, not a genuine mate-in-2")
            win = [b.san(m) for m in winning_first_moves_mate_in_2(b)]
            if not win:
                fail(f"{p['id']}: no forced mate in 2")
            if sorted(win) != sorted(p.get("solutions", win)):
                fail(f"{p['id']}: solutions list {p.get('solutions')} != exhaustive {win}")
            print(f"ok  {p['id']:34} mate in 2  {win}")
        else:
            fail(f"{p['id']}: unsupported mateIn {p['mateIn']}")

    for v in verdicts:
        b = chess.Board(v["fen"])
        if not b.is_valid():
            fail(f"{v['id']}: invalid position status={b.status()!r}")
            continue
        if not b.is_check():
            fail(f"{v['id']}: side to move is not in check")
            continue
        answer = "mate" if b.is_checkmate() else "not"
        if answer != v["answer"]:
            fail(f"{v['id']}: answer {v['answer']} but position is {answer}")
        kinds = classify(b)
        print(f"ok  {v['id']:34} {answer:4}  {kinds}")

    m1 = [p for p in puzzles if p["mateIn"] == 1]
    m2 = [p for p in puzzles if p["mateIn"] == 2]
    colors = {p["fen"].split()[1] for p in puzzles}
    print(f"\n{len(m1)} mate-in-1, {len(m2)} mate-in-2, {len(verdicts)} verdicts; sides to move: {sorted(colors)}")
    if len(m1) < 24: fail("fewer than 24 mate-in-1 puzzles")
    if len(m2) < 6: fail("fewer than 6 mate-in-2 puzzles")
    if len(verdicts) < 12: fail("fewer than 12 verdicts")
    if colors != {"w", "b"}: fail("puzzles must include both colors to move")
    va = {v["answer"] for v in verdicts}
    if va != {"mate", "not"}: fail("verdicts must mix mate and not")
    if not data["provenance"]: fail("missing provenance")

    if failures:
        print(f"\n{len(failures)} failure(s)")
        sys.exit(1)
    print("\nALL CHECKS PASSED")


if __name__ == "__main__":
    main()
