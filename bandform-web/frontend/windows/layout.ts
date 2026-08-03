interface Size {
  width: number;
  height: number;
}

interface Position {
  x: number;
  y: number;
}

// Lays a fixed row of windows out centered horizontally at a given y --
// used once for the always-on dashboard widgets.
export function centeredRow(sizes: Size[], y: number, gap: number): Position[] {
  if (typeof window === "undefined") {
    return sizes.map(() => ({ x: 16, y }));
  }
  const totalWidth = sizes.reduce((sum, size) => sum + size.width, 0) + gap * Math.max(sizes.length - 1, 0);
  let x = Math.max((window.innerWidth - totalWidth) / 2, 16);
  return sizes.map((size) => {
    const position = { x, y };
    x += size.width + gap;
    return position;
  });
}

// Centers a window on the viewport with a small diagonal offset per
// already-open window, so several opened-from-nav windows don't stack
// exactly on top of each other.
export function cascadeFromCenter(index: number, size: Size): Position {
  if (typeof window === "undefined") {
    return { x: 16, y: 96 };
  }
  const step = 32;
  const x = Math.max((window.innerWidth - size.width) / 2 + index * step, 16);
  const y = Math.max((window.innerHeight - size.height) / 2, 96) + index * step;
  return { x, y };
}
