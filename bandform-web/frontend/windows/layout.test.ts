import { describe, it, expect, beforeEach } from "vitest";
import { centeredRow, cascadeFromCenter } from "./layout";

function setViewport(width: number, height: number) {
  Object.defineProperty(window, "innerWidth", { value: width, configurable: true, writable: true });
  Object.defineProperty(window, "innerHeight", { value: height, configurable: true, writable: true });
}

describe("centeredRow", () => {
  beforeEach(() => setViewport(1024, 768));

  it("centers a row and steps x by width + gap", () => {
    const positions = centeredRow([{ width: 100, height: 40 }, { width: 100, height: 40 }], 50, 20);

    // totalWidth = 200 + 20 = 220; x0 = (1024 - 220) / 2 = 402
    expect(positions).toEqual([
      { x: 402, y: 50 },
      { x: 522, y: 50 }, // 402 + 100 + 20
    ]);
  });

  it("never places the first item further left than the 16px floor", () => {
    setViewport(100, 768);
    const positions = centeredRow([{ width: 400, height: 40 }], 0, 20);
    expect(positions[0].x).toBe(16);
  });
});

describe("cascadeFromCenter", () => {
  beforeEach(() => setViewport(1024, 768));

  it("centers the first window on the viewport", () => {
    // x = (1024 - 400) / 2 = 312; y = max((768 - 300) / 2, 96) = 234
    expect(cascadeFromCenter(0, { width: 400, height: 300 })).toEqual({ x: 312, y: 234 });
  });

  it("offsets each subsequent window diagonally by 32px", () => {
    expect(cascadeFromCenter(2, { width: 400, height: 300 })).toEqual({ x: 312 + 64, y: 234 + 64 });
  });
});
