// Color-coded status and priority badges
const STATUS_MAP = {
  created:   { label: 'Created',   cls: 'badge-created',   dot: 'bg-gray-400'   },
  approved:  { label: 'Approved',  cls: 'badge-approved',  dot: 'bg-blue-400'   },
  assigned:  { label: 'Assigned',  cls: 'badge-assigned',  dot: 'bg-purple-400' },
  completed: { label: 'Completed', cls: 'badge-completed', dot: 'bg-green-400'  },
  rejected:  { label: 'Rejected',  cls: 'badge-rejected',  dot: 'bg-red-400'    },
};

const PRIORITY_MAP = {
  high:   { label: 'High',   cls: 'badge-high'   },
  medium: { label: 'Medium', cls: 'badge-medium' },
  low:    { label: 'Low',    cls: 'badge-low'    },
};

const SLA_MAP = {
  'On Time':     { label: 'On Time',      cls: 'badge-ontime'  },
  'SLA Breached': { label: 'SLA Breached', cls: 'badge-breached' },
};

export function StatusBadge({ status }) {
  const cfg = STATUS_MAP[status] || { label: status, cls: 'badge-created', dot: 'bg-gray-400' };
  return (
    <span className={`badge ${cfg.cls}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
      {cfg.label}
    </span>
  );
}

export function PriorityBadge({ priority }) {
  const cfg = PRIORITY_MAP[priority] || { label: priority, cls: 'badge-created' };
  return <span className={`badge ${cfg.cls}`}>{cfg.label}</span>;
}

export function SlaBadge({ status }) {
  const cfg = SLA_MAP[status] || { label: status, cls: 'badge-ontime' };
  return <span className={`badge ${cfg.cls}`}>{cfg.label}</span>;
}
