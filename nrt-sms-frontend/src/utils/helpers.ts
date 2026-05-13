export function formatDate(date: string): string {
  const d = new Date(date);
  return d.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function formatCredits(n: number): string {
  return n.toLocaleString('en-IN');
}

export function getStatusBadgeClass(status: string): string {
  const map: Record<string, string> = {
    sent: 'primary',
    delivered: 'success',
    failed: 'danger',
    pending: 'warning',
    approved: 'success',
    rejected: 'danger',
    draft: 'secondary',
  };
  return map[status?.toLowerCase()] || 'secondary';
}

export function truncate(str: string, len = 50): string {
  if (str.length <= len) return str;
  return str.substring(0, len) + '...';
}
