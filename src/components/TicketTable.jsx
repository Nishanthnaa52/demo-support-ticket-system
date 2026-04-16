import { useNavigate } from 'react-router-dom';
import { StatusBadge, PriorityBadge, SlaBadge } from './StatusBadge';
import { getSlaStatus, formatDate } from '../utils/sla';

export default function TicketTable({ tickets, actions, emptyMessage = 'No tickets found.' }) {
  const navigate = useNavigate();

  if (!tickets || tickets.length === 0) {
    return (
      <div className="card p-12 text-center">
        <div className="w-14 h-14 bg-gray-800 rounded-2xl flex items-center justify-center mx-auto mb-4 text-2xl">🎫</div>
        <p className="text-gray-400">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-800 text-xs text-gray-500 uppercase tracking-wider">
              <th className="px-5 py-3.5 text-left font-medium">ID</th>
              <th className="px-5 py-3.5 text-left font-medium">Title</th>
              <th className="px-5 py-3.5 text-left font-medium hidden md:table-cell">Priority</th>
              <th className="px-5 py-3.5 text-left font-medium">Status</th>
              <th className="px-5 py-3.5 text-left font-medium hidden lg:table-cell">SLA</th>
              <th className="px-5 py-3.5 text-left font-medium hidden lg:table-cell">Created</th>
              <th className="px-5 py-3.5 text-left font-medium hidden md:table-cell">By</th>
              {actions && <th className="px-5 py-3.5 text-left font-medium">Actions</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800/60">
            {tickets.map(ticket => {
              const slaStatus = getSlaStatus(ticket.slaDeadline);
              return (
                <tr
                  key={ticket.id}
                  className="hover:bg-white/[0.02] transition-colors group cursor-pointer"
                  onClick={() => navigate(`/ticket/${ticket.id}`)}
                >
                  <td className="px-5 py-4">
                    <span className="font-mono text-orange-500 text-xs">{ticket.id}</span>
                  </td>
                  <td className="px-5 py-4">
                    <p className="font-medium text-gray-200 group-hover:text-orange-400 transition-colors max-w-xs truncate">
                      {ticket.title}
                    </p>
                  </td>
                  <td className="px-5 py-4 hidden md:table-cell">
                    <PriorityBadge priority={ticket.priority} />
                  </td>
                  <td className="px-5 py-4">
                    <StatusBadge status={ticket.status} />
                  </td>
                  <td className="px-5 py-4 hidden lg:table-cell">
                    <SlaBadge status={slaStatus} />
                  </td>
                  <td className="px-5 py-4 text-gray-500 hidden lg:table-cell text-xs">
                    {formatDate(ticket.createdAt)}
                  </td>
                  <td className="px-5 py-4 text-gray-400 hidden md:table-cell text-xs">
                    {ticket.createdByName}
                  </td>
                  {actions && (
                    <td className="px-5 py-4" onClick={e => e.stopPropagation()}>
                      <div className="flex gap-2">
                        {actions(ticket)}
                      </div>
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
