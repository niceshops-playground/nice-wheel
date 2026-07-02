import { describe, it, expect } from "vitest";
import { decodeState, encodeState, shareUrl } from "./share";

describe("encodeState", () => {
  it("encodes team and names", () => {
    const q = encodeState({ team: "Red Team", names: ["Anna", "Bo"] });
    expect(decodeState(q)).toEqual({ team: "Red Team", names: ["Anna", "Bo"] });
  });

  it("omits empty team and empty names", () => {
    expect(encodeState({ team: "  ", names: [] })).toBe("");
  });
});

describe("decodeState", () => {
  it("parses names from a query string", () => {
    expect(decodeState("?names=Anna,Bo,Cy")).toEqual({
      team: "",
      names: ["Anna", "Bo", "Cy"],
    });
  });

  it("trims and drops empty entries", () => {
    expect(decodeState("names= Anna , , Bo ").names).toEqual(["Anna", "Bo"]);
  });

  it("dedupes case-insensitively", () => {
    expect(decodeState("names=Anna,anna,ANNA").names).toEqual(["Anna"]);
  });

  it("returns empty state for a blank query", () => {
    expect(decodeState("")).toEqual({ team: "", names: [] });
  });

  it("round-trips names with spaces", () => {
    const state = { team: "QA", names: ["Ann Marie", "Bob"] };
    expect(decodeState(encodeState(state))).toEqual(state);
  });
});

describe("shareUrl", () => {
  it("builds an absolute link from origin + pathname", () => {
    const url = shareUrl(
      { team: "QA", names: ["Anna"] },
      "https://wheel.example",
      "/",
    );
    expect(url).toBe("https://wheel.example/?team=QA&names=Anna");
  });

  it("returns the bare base when state is empty", () => {
    expect(shareUrl({ team: "", names: [] }, "https://x.io", "/app")).toBe(
      "https://x.io/app",
    );
  });
});
