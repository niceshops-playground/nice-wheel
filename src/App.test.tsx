import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, fireEvent, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { App } from "./App";

beforeEach(() => {
  sessionStorage.clear();
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

  it("persists names to sessionStorage", async () => {
    const user = userEvent.setup();
    const { unmount } = render(<App />);
    await user.type(screen.getByLabelText("Add a name"), "Anna");
    await user.click(screen.getByRole("button", { name: "Add" }));
    unmount();

    render(<App />);
    expect(screen.getByText("Names (1)")).toBeInTheDocument();
  });
});
