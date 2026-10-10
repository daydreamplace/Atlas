// Lets a component keep the GNB hidden while it needs the full screen (e.g.
// a scroll-driven step sequence that is pinned). The Navbar subscribes.

const holders = new Set<symbol>();
const listeners = new Set<() => void>();

const notify = () => listeners.forEach((listener) => listener());

export function lockGnb(holder: symbol) {
  if (holders.has(holder)) return;
  holders.add(holder);
  notify();
}

export function unlockGnb(holder: symbol) {
  if (!holders.delete(holder)) return;
  notify();
}

export function isGnbLocked() {
  return holders.size > 0;
}

export function subscribeGnbLock(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}
