# Checkmate, spotted.

A standalone chess training game for Amy Nguyen Studio. First version, awaiting user review. Nothing published.

## Design brief
Train the missing skill: recognizing mate before calculating every branch. Three modes: mate in 1, mate in 2, and mate-or-not verification. The king-box overlay is an optional hint. After an attempted move, classify every legal defense into Escape, Capture, Block. Let players play a defense to see why a check is not mate. Accept every valid solution, not just a predetermined move.

## Implementation
- `index.html`, `styles.css`, `app.js`: vanilla ES modules, original SVG chess pieces, self-hosted Space Grotesk, portfolio dusty pastel palette.
- `rules.js`, `puzzles.js`, `vendor/`: legal move validation and verified composed positions.
- No runtime API, no account, no analytics additions. Local browser progress only (`studio-mate-spotted-v1`). Five unique unassisted solves make the daily practice marks. Hints and mistakes do not count as clean solves. Repeated solves of the same position cannot inflate daily progress.
- URL parameters `mode`, `puzzle`, `collection` restore navigable state; browser Back and Forward supported.
- Tap/click movement, keyboard arrow-square navigation, explicit promotion choice, board flip, retry and review collection.

## Delivery
Canonical repository: `/workspace/amynguyendesign.github.io`, subpath `/mate/`. Existing `portfolio-preview` serves the working tree. Studio entry added locally; no push until approval. Unrelated `gym/index.html` draft must remain uncommitted and must NOT ship with this feature.

## Product limits
This is a compact training set, not a full chess site. Composed positions isolate patterns; no imported games or personalized engine analysis. Mate-in-2 validation covers all legal opponent replies, although the player practices one selected reply. Review mode contains all positions ever missed or revealed, not a spaced-repetition scheduler.

## Verification, 2026-09-24
- 27 mate-in-1, 7 mate-in-2, 20 verdict positions.
- `node mate/tests.cjs`: 537 assertions passed. `python mate/validate.py`: independent legality and exhaustive solution checks passed.
- Browser-verified: Rd8# clean solve; Qg8+ Rxg8 Nf7# two-stage solve; mate-or-not wrong answer; Bf8 legal blocking replay; rook promotion rejected with Kg7 defense; retry restores pawn; hints reveal Q promotion without incrementing clean score; king-box explanation for a pawn-controlled square.
- Responsive measurements: at 1280×800, 420px board at y307, bottom727; at 390×844, 335px board at y352 and judge buttons at y705. No horizontal overflow. Final mobile headline fits on one line. Pieces are outlined SVG with paper/lavender-blue squares; covered squares have diagonal texture plus a dot, own-piece squares a dashed box plus ×, and escapes blush with an open circle. Light standalone design; reduced-motion support.
- Actual public preview URL returns HTTP 200. `inspect_ingress` chose an internal backend hostname and returned a diagnostic-only 404; the public browser and HTTP request both work. Diagnose the public URL directly if that internal-host mismatch recurs.
- Expensive search runs in `solver.js`, a module Web Worker, keeping the board responsive; cancelled puzzles terminate pending search.
