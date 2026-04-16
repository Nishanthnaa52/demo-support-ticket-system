import { useState, useMemo } from 'react';
import { useTickets } from '../context/TicketContext';
import { useAuth } from '../context/AuthContext';
import TicketTable from '../components/TicketTable';
import StatCard from '../components/StatCard';
import { MANAGERS } from '../data/mockData';

export default function ManagerDashboard() {
  const { tickets, approveTicket, rejectTicket, forwardTicket, completeTicket } = useTickets();
  const { user } = useAuth();
  const [search, setSearch] = useState('');
  const [tab, setTab] = useState('pending'); // 'pending' | 'approved' | 'all'
  const [forwardModal, setForwardModal] = useState(null); // ticketId
  const [rejectModal, setRejectModal] = useState(null);
  const [rejectNote, setRejectNote] = useState('');
  const [selectedManager, setSelectedManager] = useState(MANAGERS[0]);

  const allTickets = tickets;
  const pendingTickets  = allTickets.filter(t => t.status === 'created');
  const approvedTickets = allTickets.filter(t => t.status === 'approved');

  const displayTickets = useMemo(() => {
    const base = tab === 'pending' ? pendingTickets
               : tab === 'approved' ? approvedTickets
               : allTickets;
    return base.filter(t =>
      !search ||
      t.title.toLowerCase().includes(search.toLowerCase()) ||
      t.id.toLowerCase().includes(search.toLowerCase())
    );
  }, [tab, search, tickets]);

  const handleApprove = (id) => approveTicket(id, user.name);
  const handleReject  = () => {
    if (!rejectModal) return;
    rejectTicket(rejectModal, rejectNote);
    setRejectModal(null);
    setRejectNote('');
  };
  const handleForward = () => {
    if (!forwardModal) return;
    forwardTicket(forwardModal, selectedManager);
    setForwardModal(null);
  };

  const actionButtons = (ticket) => {
    if (ticket.status === 'created') return (
      <>
        <button className="btn-success text-xs" onClick={() => handleApprove(ticket.id)}>✓ Approve</button>
        <button className="btn-danger text-xs"  onClick={() => { setRejectModal(ticket.id); setRejectNote(''); }}>✗ Reject</button>
      </>
    );
    if (ticket.status === 'approved') return (
      <>
        <button className="btn-purple text-xs"  onClick={() => setForwardModal(ticket.id)}>→ Forward</button>
        <button className="btn-success text-xs" onClick={() => completeTicket(ticket.id)}>✓ Complete</button>
      </>
    );
    return null;
  };

  return (
    <div className="page-enter max-w-screen-2xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Manager Dashboard</h1>
        <p className="text-gray-400 text-sm mt-1">Review, approve, and dispatch support tickets</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Tickets"   value={allTickets.length}      icon="🎫" color="orange" />
        <StatCard label="Needs Approval"  value={pendingTickets.length}  icon="⏳" color="yellow" />
        <StatCard label="Approved"        value={approvedTickets.length} icon="✅" color="blue"   />
        <StatCard label="Completed"       value={allTickets.filter(t => t.status === 'completed').length} icon="🏁" color="green" />
      </div>

      {/* Tabs + Search */}
      <div className="card p-4 space-y-4">
        <div className="flex flex-wrap items-center gap-3 justify-between">
          {/* Tabs */}
          <div className="flex gap-1 bg-gray-800 rounded-xl p-1">
            {[['pending','Pending Approval'],['approved','Approved'],['all','All Tickets']].map(([key, label]) => (
              <button key={key} onClick={() => setTab(key)}
                className={`px-4 py-1.5 rounded-lg text-xs font-medium transition-all ${tab === key ? 'bg-orange-600 text-white' : 'text-gray-400 hover:text-white'}`}>
                {label}
              </button>
            ))}
          </div>
          {/* Search */}
          <div className="relative flex-1 min-w-40 max-w-xs">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              id="manager-search"
              type="text"
              placeholder="Search tickets..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="form-input pl-9"
            />
          </div>
        </div>
      </div>

      {/* Table */}
      <TicketTable
        tickets={displayTickets}
        actions={actionButtons}
        emptyMessage={`No ${tab === 'all' ? '' : tab} tickets found.`}
      />

      {/* Forward Modal */}
      {forwardModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="card w-full max-w-sm p-6 animate-fade-in">
            <h3 className="text-lg font-bold text-white mb-1">Forward Ticket</h3>
            <p className="text-sm text-gray-400 mb-4">Select a manager to forward <span className="text-orange-400 font-mono">{forwardModal}</span> to:</p>
            <select
              value={selectedManager}
              onChange={e => setSelectedManager(e.target.value)}
              className="form-input mb-4"
            >
              {MANAGERS.map(m => <option key={m} value={m}>{m}</option>)}
            </select>
            <div className="flex gap-3">
              <button className="btn-primary flex-1" onClick={handleForward}>Forward</button>
              <button className="btn-ghost flex-1" onClick={() => setForwardModal(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {rejectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="card w-full max-w-sm p-6 animate-fade-in">
            <h3 className="text-lg font-bold text-white mb-1">Reject Ticket</h3>
            <p className="text-sm text-gray-400 mb-4">Provide a reason for rejecting <span className="text-orange-400 font-mono">{rejectModal}</span>:</p>
            <textarea
              value={rejectNote}
              onChange={e => setRejectNote(e.target.value)}
              placeholder="Reason for rejection (optional)..."
              rows={3}
              className="form-input resize-none mb-4"
            />
            <div className="flex gap-3">
              <button className="btn-danger flex-1" onClick={handleReject}>Reject</button>
              <button className="btn-ghost flex-1" onClick={() => setRejectModal(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
