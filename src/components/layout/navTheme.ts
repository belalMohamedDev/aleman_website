/** Dispatched (detail: boolean) by dark full-screen sections to keep the navbar in its dark style */
export const NAV_OVER_DARK_EVENT = 'aleman:nav-over-dark';

let current = false;
// Each dark section reports under its own name; the navbar stays dark while any of them is
// under it, so neighbouring sections can't switch it off for each other at their boundary
const darkSources = new Set<string>();

/** Current value, so a navbar that mounts after the signal was sent can still pick it up */
export const getNavOverDark = () => current;

export const setNavOverDark = (dark: boolean, source = 'stage') => {
  if (dark) darkSources.add(source);
  else darkSources.delete(source);
  const next = darkSources.size > 0;
  if (current === next) return;
  current = next;
  window.dispatchEvent(new CustomEvent(NAV_OVER_DARK_EVENT, { detail: next }));
};
