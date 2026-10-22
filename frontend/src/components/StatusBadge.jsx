import React from "react";

export function StatusBadge({ status }) {
  let badgeClass = "badge-draft";
  const s = (status || "").toLowerCase();

  if (s.includes("approved")) badgeClass = "badge-approved";
  else if (s.includes("settled")) badgeClass = "badge-settled";
  else if (s.includes("review") || s.includes("pending")) badgeClass = "badge-review";
  else if (s.includes("rejected")) badgeClass = "badge-rejected";
  else if (s.includes("submitted")) badgeClass = "badge-submitted";
  else if (s.includes("evidence")) badgeClass = "badge-evidence";
  else if (s.includes("blockchain") || s.includes("valid")) badgeClass = "badge-blockchain";

  return <span className={`badge ${badgeClass}`}>{status}</span>;
}
