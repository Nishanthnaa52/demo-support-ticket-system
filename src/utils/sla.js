/** SLA helpers */

/** Returns SLA deadline: createdAt + 24 hours */
export function computeSlaDeadline(createdAt) {
  return createdAt + 24 * 60 * 60 * 1000;
}

/** Returns 'On Time' | 'SLA Breached' */
export function getSlaStatus(slaDeadline) {
  return Date.now() <= slaDeadline ? 'On Time' : 'SLA Breached';
}

/** Returns remaining time string or 'Overdue by X' */
export function getSlaRemaining(slaDeadline) {
  const diff = slaDeadline - Date.now();
  if (diff <= 0) {
    const over = Math.abs(diff);
    const hrs  = Math.floor(over / 3_600_000);
    const mins = Math.floor((over % 3_600_000) / 60_000);
    return `Overdue by ${hrs}h ${mins}m`;
  }
  const hrs  = Math.floor(diff / 3_600_000);
  const mins = Math.floor((diff % 3_600_000) / 60_000);
  return `${hrs}h ${mins}m remaining`;
}

/** Format timestamp to readable date */
export function formatDate(ts) {
  if (!ts) return '—';
  return new Date(ts).toLocaleString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

/** Time ago string */
export function timeAgo(ts) {
  const diff = Date.now() - ts;
  const mins  = Math.floor(diff / 60_000);
  const hours = Math.floor(diff / 3_600_000);
  const days  = Math.floor(diff / 86_400_000);
  if (mins < 1)   return 'just now';
  if (mins < 60)  return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
}
