import { renderHook } from "@testing-library/react";
import { useWindowSize } from "../../hooks/useWindowSize";

// Mock window size
Object.defineProperty(window, 'innerWidth', {
  writable: true,
  configurable: true,
  value: 1024,
});

Object.defineProperty(window, 'innerHeight', {
  writable: true,
  configurable: true,
  value: 768,
});

describe("useWindowSize Hook", () => {
  test("returns initial window size", () => {
    const { result } = renderHook(() => useWindowSize());
    
    expect(result.current.windowSize.width).toBe(1024);
    expect(result.current.windowSize.height).toBe(768);
  });
});