import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, fireEvent, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { App } from "./App";

beforeEach(() => {
  // The wheel state lives in the URL now — reset it so tests don't leak into
  // one another.
  window.history.replaceState(null, "", "/");
});

describe("App", () => {
  it("adds names and shows them in the list", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.type(screen.getByLabelText("Add a name"), "Anna");
    await user.click(screen.getByRole("button", { name: "Add" }));
    await user.type(screen.getByLabelText("Add a name"), "Ben");
    await user.click(screen.getByRole("button", { name: "Add" }));

    expect(screen.getByText("Names (2)")).toBeInTheDocument();
    const list = screen.getByRole("list");
    expect(within(list).getByText("Anna")).toBeInTheDocument();
    expect(within(list).getByText("Ben")).toBeInTheDocument();
  });

  it("ignores case-insensitive duplicates", async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.type(screen.getByLabelText("Add a name"), "Anna");
    await user.click(screen.getByRole("button", { name: "Add" }));
    await user.type(screen.getByLabelText("Add a name"), "anna");
    await user.click(screen.getByRole("button", { name: "Add" }));
    expect(screen.getByText("Names (1)")).toBeInTheDocument();
  });

  it("removes a name", async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.type(screen.getByLabelText("Add a name"), "Anna");
    await user.click(screen.getByRole("button", { name: "Add" }));
    await user.click(screen.getByRole("button", { name: "Remove Anna" }));
    expect(screen.getByText("Names (0)")).toBeInTheDocument();
  });

  it("disables Spin until there are at least two names", async () => {
    const user = userEvent.setup();
    render(<App />);
    expect(screen.getByRole("button", { name: /Spin/ })).toBeDisabled();
    await user.type(screen.getByLabelText("Add a name"), "Anna");
    await user.click(screen.getByRole("button", { name: "Add" }));
    expect(screen.getByRole("button", { name: /Spin/ })).toBeDisabled();
    await user.type(screen.getByLabelText("Add a name"), "Ben");
    await user.click(screen.getByRole("button", { name: "Add" }));
    expect(screen.getByRole("button", { name: /Spin/ })).toBeEnabled();
  });

  it("spins and reveals a winner when the animation ends", async () => {
    const user = userEvent.setup();
    render(<App />);
    for (const name of ["Anna", "Ben", "Cleo"]) {
      await user.type(screen.getByLabelText("Add a name"), name);
      await user.click(screen.getByRole("button", { name: "Add" }));
    }

    await user.click(screen.getByRole("button", { name: "Spin" }));
    expect(screen.getByRole("button", { name: "Spinning…" })).toBeInTheDocument();

    // jsdom doesn't run CSS transitions, so emit the transitionend manually.
    fireEvent.transitionEnd(screen.getByLabelText(/Wheel with/));

    const dialog = await screen.findByRole("dialog", { name: "Winner" });
    expect(within(dialog).getByText("Winner")).toBeInTheDocument();
    expect(["Anna", "Ben", "Cleo"]).toContain(
      within(dialog).getByRole("heading").textContent,
    );
  });

  it("locks the name panel while spinning so the winner can't be invalidated", async () => {
    const user = userEvent.setup();
    render(<App />);
    for (const name of ["Anna", "Ben", "Cleo"]) {
      await user.type(screen.getByLabelText("Add a name"), name);
      await user.click(screen.getByRole("button", { name: "Add" }));
    }

    await user.click(screen.getByRole("button", { name: "Spin" }));

    expect(screen.getByLabelText("Add a name")).toBeDisabled();
    expect(screen.getByRole("button", { name: "Add" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Remove Anna" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Clear all" })).toBeDisabled();

    // After the spin settles, the panel is interactive again.
    fireEvent.transitionEnd(screen.getByLabelText(/Wheel with/));
    await screen.findByRole("dialog", { name: "Winner" });
    expect(screen.getByLabelText("Add a name")).toBeEnabled();
  });

  it("dismisses the winner modal with the Escape key", async () => {
    const user = userEvent.setup();
    render(<App />);
    for (const name of ["Anna", "Ben"]) {
      await user.type(screen.getByLabelText("Add a name"), name);
      await user.click(screen.getByRole("button", { name: "Add" }));
    }
    await user.click(screen.getByRole("button", { name: "Spin" }));
    fireEvent.transitionEnd(screen.getByLabelText(/Wheel with/));
    await screen.findByRole("dialog", { name: "Winner" });

    await user.keyboard("{Escape}");
    expect(screen.queryByRole("dialog", { name: "Winner" })).not.toBeInTheDocument();
  });

  it("persists names in the URL across reloads", async () => {
    const user = userEvent.setup();
    const { unmount } = render(<App />);
    await user.type(screen.getByLabelText("Add a name"), "Anna");
    await user.click(screen.getByRole("button", { name: "Add" }));
    expect(window.location.search).toContain("names=Anna");
    unmount();

    // Re-mounting reads the same URL — a shared link behaves identically.
    render(<App />);
    expect(screen.getByText("Names (1)")).toBeInTheDocument();
  });

  it("seeds team and names from the URL and shows the team as the title", () => {
    window.history.replaceState(null, "", "/?team=Red+Team&names=Anna,Ben");
    render(<App />);
    expect(
      screen.getByRole("heading", { level: 1, name: "Red Team" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Names (2)")).toBeInTheDocument();
  });
});
