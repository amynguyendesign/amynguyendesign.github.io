import { assessMove, winningMoves } from './rules.js';
self.onmessage = ({data}) => {
  try {
    const fn = data.action === 'assessMove' ? assessMove : winningMoves;
    self.postMessage({ result: fn(...data.args) });
  } catch (error) { self.postMessage({ error: error.message || 'Could not verify the position.' }); }
};
