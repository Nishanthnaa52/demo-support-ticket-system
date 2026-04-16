import { useState, useMemo } from 'react';
import { useTickets } from '../context/TicketContext';
import StatCard from '../components/StatCard';
import TicketTable from '../components/TicketTable';
import { getSlaStatus } from '../utils/sla';

const STATUS_FILTERS = ['all', 'created', 'approved', 'assigned', 'completed', 'rejected'];

export default function CeoDashboard() {
  const { tickets } = useTickets();
  const [statusFilter, setStatusFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [view, setView] = useState('table'); // 'table' | 'cards'

  // Stats
  const total     = tickets.length;
  const pending   = tickets.filter(t => t.status === 'created').length;
  const completed = tickets.filter(t => t.status === 'completed').length;
  const breached  = tickets.filter(t => getSlaStatus(t.slaDeadline) === 'SLA Breached').length;

  // Filtered tickets
  const filtered = useMemo(() => {
    return tickets
      .filter(t => statusFilter === 'all'   || t.status === statusFilter)
      .filter(t => priorityFilter === 'all' || t.priority === priorityFilter)
      .filter(t =>
        !search ||
        t.title.toLowerCase().includes(search.toLowerCase()) ||
        t.id.toLowerCase().includes(search.toLowerCase()) ||
        t.createdByName.toLowerCase().includes(search.toLowerCase())
      );
  }, [tickets, statusFilter, search, priorityFilter]);

  return (
    <div className="page-enter max-w-screen-2xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold text-white">CEO Dashboard</h1>
        <p className="text-gray-400 text-sm mt-1">Full system overview and SLA monitoring</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Tickets"  value={total}     icon="🎫" color="orange" />
        <StatCard label="Pending"        value={pending}   icon="⏳" color="yellow" sublabel="Awaiting approval" />
        <StatCard label="Completed"      value={completed} icon="✅" color="green"  sublabel="Resolved" />
        <StatCard label="SLA Breached"   value={breached}  icon="⚠️" color="red"   sublabel="Needs action" />
      </div>

      {/* Filters bar */}
      <div className="card p-4">
        <div className="flex flex-wrap gap-3 items-center">
          {/* Search */}
          <div className="relative flex-1 min-w-48">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              id="ceo-search"
              type="text"
              placeholder="Search tickets..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="form-input pl-9"
            />
          </div>

          {/* Status filter */}
          <select
            id="status-filter"
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="form-input w-auto"
          >
            {STATUS_FILTERS.map(s => (
              <option key={s} value={s}>{s === 'all' ? 'All Statuses' : s.charAt(0).toUpperCase() + s.slice(1)}</option>
            ))}
          </select>

          {/* Priority filter */}
          <select
            id="priority-filter"
            value={priorityFilter}
            onChange={e => setPriorityFilter(e.target.value)}
            className="form-input w-auto"
          >
            <option value="all">All Priorities</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>

          {/* View toggle */}
          <div className="flex gap-1 bg-gray-800 rounded-xl p-1">
            <button
              onClick={() => setView('table')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${view === 'table' ? 'bg-orange-600 text-white' : 'text-gray-400 hover:text-white'}`}
            >Table</button>
            <button
              onClick={() => setView('cards')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${view === 'cards' ? 'bg-orange-600 text-white' : 'text-gray-400 hover:text-white'}`}
            >Cards</button>
          </div>
        </div>
      </div>

      {/* Ticket count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-400">
          Showing <span className="text-white font-medium">{filtered.length}</span> of {total} tickets
        </p>
      </div>

      {/* Ticket list */}
      {view === 'table' ? (
        <TicketTable tickets={filtered} emptyMessage="No tickets match your filters." />
      ) : (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.length === 0 ? (
            <div className="col-span-full card p-12 text-center">
              <p className="text-gray-400">No tickets match your filters.</p>
            </div>
          ) : (
            filtered.map(t => {
              const sla = getSlaStatus(t.slaDeadline);
              return (
                <div key={t.id} className="card p-5 hover:border-orange-700/40 transition-all cursor-pointer group"
                  onClick={() => window.location.assign(`/ticket/${t.id}`)}>
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-mono text-xs text-orange-500">{t.id}</span>
                    <span className={`badge ${sla === 'On Time' ? 'badge-ontime' : 'badge-breached'}`}>{sla}</span>
                  </div>
                  <p className="font-semibold text-white group-hover:text-orange-400 transition-colors mb-1">{t.title}</p>
                  <p className="text-xs text-gray-400 line-clamp-2">{t.description}</p>
                  <div className="flex gap-2 mt-3">
                    <span className={`badge badge-${t.status}`}>{t.status}</span>
                    <span className={`badge badge-${t.priority}`}>{t.priority}</span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}
