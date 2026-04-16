import { useParams, useNavigate } from 'react-router-dom';
import { useTickets } from '../context/TicketContext';
import { useAuth } from '../context/AuthContext';
import { StatusBadge, PriorityBadge, SlaBadge } from '../components/StatusBadge';
import { getSlaStatus, getSlaRemaining, formatDate } from '../utils/sla';
import { MANAGERS } from '../data/mockData';
import { useState } from 'react';

// Status timeline steps
const TIMELINE_STEPS = ['created', 'approved', 'assigned', 'completed'];

function TimelineStep({ step, currentStatus, isRejected }) {
  const steps    = TIMELINE_STEPS;
  const curIdx   = isRejected ? -1 : steps.indexOf(currentStatus);
  const stepIdx  = steps.indexOf(step);
  const isDone   = !isRejected && stepIdx <= curIdx;
  const isCurrent = !isRejected && stepIdx === curIdx;

  const labels = { created: 'Created', approved: 'Approved', assigned: 'Assigned', completed: 'Completed' };
  const icons  = { created: '📝', approved: '✅', assigned: '🔀', completed: '🏁' };

  return (
    <div className={`flex items-center gap-3 ${stepIdx < steps.length - 1 ? 'flex-1' : ''}`}>
      <div className={`flex flex-col items-center gap-1`}>
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm transition-all ${
          isCurrent ? 'bg-orange-600 orange-glow scale-110'
          : isDone  ? 'bg-orange-700/60 text-orange-300'
          :           'bg-gray-800 text-gray-600'
        }`}>
          {icons[step]}
        </div>
        <span className={`text-xs font-medium ${
          isCurrent ? 'text-orange-400'
          : isDone  ? 'text-gray-300'
          :           'text-gray-600'
        }`}>{labels[step]}</span>
      </div>
      {stepIdx < steps.length - 1 && (
        <div className={`h-0.5 flex-1 rounded transition-all ${isDone && !isCurrent ? 'bg-orange-700/60' : 'bg-gray-800'}`} />
      )}
    </div>
  );
}

export default function TicketDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { tickets, approveTicket, rejectTicket, forwardTicket, completeTicket } = useTickets();
  const { user } = useAuth();

  const ticket = tickets.find(t => t.id === id);
  const [selectedManager, setSelectedManager] = useState(MANAGERS[0]);
  const [showForward, setShowForward] = useState(false);

  if (!ticket) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <p className="text-4xl mb-4">404</p>
        <p className="text-gray-400 mb-6">Ticket not found.</p>
        <button className="btn-primary" onClick={() => navigate(-1)}>← Go Back</button>
      </div>
    );
  }

  const slaStatus    = getSlaStatus(ticket.slaDeadline);
  const slaRemaining = getSlaRemaining(ticket.slaDeadline);
  const isRejected   = ticket.status === 'rejected';

  return (
    <div className="page-enter max-w-3xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      {/* Back */}
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm text-gray-400 hover:text-orange-400 transition-colors">
        ← Back
      </button>

      {/* Header card */}
      <div className="card p-6">
        <div className="flex flex-wrap items-start justify-between gap-4 mb-5">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="font-mono text-orange-500">{ticket.id}</span>
              <PriorityBadge priority={ticket.priority} />
              <SlaBadge status={slaStatus} />
            </div>
            <h1 className="text-xl font-bold text-white">{ticket.title}</h1>
          </div>
          <StatusBadge status={ticket.status} />
        </div>

        <p className="text-gray-300 text-sm leading-relaxed mb-6">{ticket.description}</p>

        {/* Meta grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
          {[
            { label: 'Submitted By',  value: ticket.createdByName },
            { label: 'Created',       value: formatDate(ticket.createdAt) },
            { label: 'SLA Deadline',  value: formatDate(ticket.slaDeadline) },
            { label: 'SLA Status',    value: slaRemaining },
          ].map(m => (
            <div key={m.label} className="bg-gray-800/60 rounded-xl p-3">
              <p className="text-gray-500 mb-1">{m.label}</p>
              <p className="text-gray-200 font-medium">{m.value}</p>
            </div>
          ))}
        </div>

        {/* Assigned / Forwarded info */}
        {ticket.forwardedTo && (
          <div className="mt-4 bg-purple-900/20 border border-purple-700/30 rounded-xl px-4 py-3 text-sm text-purple-300">
            → Forwarded to: <span className="font-semibold">{ticket.forwardedTo}</span>
          </div>
        )}

        {/* Rejection note */}
        {ticket.notes && (
          <div className="mt-4 bg-red-900/20 border border-red-700/30 rounded-xl px-4 py-3 text-sm text-red-300">
            <span className="font-semibold">Rejection note: </span>{ticket.notes}
          </div>
        )}

        {/* Image preview */}
        {ticket.imagePreview && (
          <div className="mt-5">
            <p className="text-xs text-gray-500 mb-2">Attached Screenshot</p>
            <img src={ticket.imagePreview} alt="attachment" className="rounded-xl max-h-64 object-contain border border-gray-700" />
          </div>
        )}
      </div>

      {/* Status Timeline */}
      <div className="card p-6">
        <h2 className="text-sm font-semibold text-gray-300 mb-5">Status Timeline</h2>
        {isRejected ? (
          <div className="flex items-center gap-3 text-red-400 text-sm">
            <span className="w-9 h-9 bg-red-900/40 border border-red-700/40 rounded-xl flex items-center justify-center text-base">❌</span>
            <div>
              <p className="font-semibold">Ticket Rejected</p>
              {ticket.notes && <p className="text-xs text-gray-400 mt-0.5">{ticket.notes}</p>}
            </div>
          </div>
        ) : (
          <div className="flex items-start gap-0">
            {TIMELINE_STEPS.map(step => (
              <TimelineStep key={step} step={step} currentStatus={ticket.status} isRejected={isRejected} />
            ))}
          </div>
        )}
      </div>

      {/* Manager Actions */}
      {user?.role === 'manager' && (
        <div className="card p-6">
          <h2 className="text-sm font-semibold text-gray-300 mb-4">Manager Actions</h2>
          <div className="flex flex-wrap gap-3">
            {ticket.status === 'created' && (
              <>
                <button className="btn-success" onClick={() => approveTicket(ticket.id, user.name)}>✓ Approve</button>
                <button className="btn-danger"  onClick={() => rejectTicket(ticket.id)}>✗ Reject</button>
              </>
            )}
            {ticket.status === 'approved' && (
              <>
                <button className="btn-purple" onClick={() => setShowForward(true)}>→ Forward to Manager</button>
                <button className="btn-success" onClick={() => completeTicket(ticket.id)}>✓ Mark Complete</button>
              </>
            )}
            {showForward && (
              <div className="flex items-center gap-3 w-full mt-2">
                <select value={selectedManager} onChange={e => setSelectedManager(e.target.value)} className="form-input flex-1">
                  {MANAGERS.map(m => <option key={m}>{m}</option>)}
                </select>
                <button className="btn-purple" onClick={() => { forwardTicket(ticket.id, selectedManager); setShowForward(false); }}>
                  Confirm Forward
                </button>
              </div>
            )}
            {!['created','approved'].includes(ticket.status) && (
              <p className="text-sm text-gray-500">No actions available for this status.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
