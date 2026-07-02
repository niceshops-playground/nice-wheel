import { useState } from "react";
import { shareUrl } from "../lib/share";

/**
 * Team-name field plus a "copy link" button. The link encodes the current team
 * and names, so a teammate opening it lands on the same wheel.
 */
export function ShareBar({
  team,
  names,
  onTeamChange,
  disabled = false,
}: {
  team: string;
  names: string[];
  onTeamChange: (value: string) => void;
  disabled?: boolean;
}) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    const url = shareUrl(
      { team, names },
      window.location.origin,
      window.location.pathname,
    );
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      // Clipboard blocked (insecure context / permissions): drop the user into
      // a prompt they can copy from manually.
      window.prompt("Copy this share link:", url);
    }
  }

  return (
    <div className="share-bar">
      <input
        className="share-bar__team"
        type="text"
        placeholder="Team name (optional)"
        value={team}
        onChange={(e) => onTeamChange(e.target.value)}
        disabled={disabled}
        maxLength={60}
      />
      <button
        type="button"
        className="share-btn"
        onClick={copy}
        disabled={disabled || names.length === 0}
      >
        {copied ? "Link copied!" : "Copy share link"}
      </button>
    </div>
  );
}
