import { useNavigate } from 'react-router-dom';
import { StatusBadge, PriorityBadge, SlaBadge } from './StatusBadge';
import { getSlaStatus, formatDate, timeAgo } from '../utils/sla';

export default function TicketCard({ ticket, actions }) {
  const navigate = useNavigate();
  const slaStatus = getSlaStatus(ticket.slaDeadline);

  return (
    <div
      className="card p-5 hover:border-orange-700/40 transition-all duration-200 cursor-pointer group"
      onClick={() => navigate(`/ticket/${ticket.id}`)}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono text-orange-500">{ticket.id}</span>
            <PriorityBadge priority={ticket.priority} />
          </div>
          <h3 className="font-semibold text-white group-hover:text-orange-400 transition-colors leading-snug">
            {ticket.title}
          </h3>
        </div>
        <StatusBadge status={ticket.status} />
      </div>

      {/* Description */}
      <p className="text-sm text-gray-400 line-clamp-2 mb-4">{ticket.description}</p>

      {/* Footer */}
      <div className="flex flex-wrap items-center gap-3 justify-between text-xs text-gray-500">
        <div className="flex items-center gap-3">
          <SlaBadge status={slaStatus} />
          <span>By {ticket.createdByName}</span>
        </div>
        <span>{timeAgo(ticket.createdAt)}</span>
      </div>

      {/* Action buttons (optional) */}
      {actions && (
        <div className="mt-4 pt-4 border-t border-gray-800 flex flex-wrap gap-2" onClick={e => e.stopPropagation()}>
          {actions}
        </div>
      )}
    </div>
  );
}
