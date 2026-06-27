import { describe, it, expect } from "vitest";
import { addName, removeAt } from "./names";

describe("addName", () => {
  it("appends a trimmed name", () => {
    expect(addName(["A"], "  B  ")).toEqual(["A", "B"]);
  });

  it("ignores empty or whitespace-only input", () => {
    expect(addName(["A"], "")).toEqual(["A"]);
    expect(addName(["A"], "   ")).toEqual(["A"]);
  });

  it("ignores case-insensitive duplicates", () => {
    expect(addName(["Anna"], "anna")).toEqual(["Anna"]);
    expect(addName(["Anna"], "ANNA ")).toEqual(["Anna"]);
  });

  it("does not mutate the original list", () => {
    const list = ["A"];
    addName(list, "B");
    expect(list).toEqual(["A"]);
  });
});

describe("removeAt", () => {
  it("removes the item at the given index", () => {
    expect(removeAt(["A", "B", "C"], 1)).toEqual(["A", "C"]);
  });

  it("returns an unchanged copy for out-of-range indices", () => {
    expect(removeAt(["A", "B"], 5)).toEqual(["A", "B"]);
    expect(removeAt(["A", "B"], -1)).toEqual(["A", "B"]);
  });

  it("does not mutate the original list", () => {
    const list = ["A", "B"];
    removeAt(list, 0);
    expect(list).toEqual(["A", "B"]);
  });
});
