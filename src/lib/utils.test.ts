import { describe, it, expect } from "vitest";
import { cn } from "./utils";

describe("utils", () => {
  describe("cn", () => {
    it("should merge class names", () => {
      const result = cn("foo", "bar");
      expect(result).toBe("foo bar");
    });

    it("should handle conditional classes", () => {
      const result = cn("foo", false && "bar", "baz");
      expect(result).toBe("foo baz");
    });

    it("should merge tailwind classes correctly", () => {
      const result = cn("px-2 py-1", "px-4");
      expect(result).toBe("py-1 px-4");
    });
  });
});
