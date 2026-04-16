import { useState, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTickets } from '../context/TicketContext';
import { StatusBadge, PriorityBadge, SlaBadge } from '../components/StatusBadge';
import { getSlaStatus, formatDate } from '../utils/sla';
import { useNavigate } from 'react-router-dom';

const PRIORITIES = ['low', 'medium', 'high'];

export default function EmployeeDashboard() {
  const { user } = useAuth();
  const { tickets, createTicket } = useTickets();
  const navigate = useNavigate();
  const fileRef = useRef(null);

  // My tickets
  const myTickets = tickets.filter(t => t.createdBy === `u-${user?.role}`
    || t.createdByName === user?.name);

  // Form state
  const [form, setForm] = useState({ title: '', description: '', priority: 'medium', imagePreview: null });
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState('create'); // 'create' | 'tickets'

  const validate = () => {
    const e = {};
    if (!form.title.trim())       e.title       = 'Title is required';
    if (!form.description.trim()) e.description = 'Description is required';
    return e;
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => setForm(f => ({ ...f, imagePreview: ev.target.result }));
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setSubmitting(true);
    setTimeout(() => {
      const ticket = createTicket(form, user);
      setSuccess(`Ticket ${ticket.id} created successfully!`);
      setForm({ title: '', description: '', priority: 'medium', imagePreview: null });
      if (fileRef.current) fileRef.current.value = '';
      setSubmitting(false);
      setActiveTab('tickets');
      setTimeout(() => setSuccess(''), 4000);
    }, 500);
  };

  const stats = {
    total:     myTickets.length,
    pending:   myTickets.filter(t => t.status === 'created').length,
    approved:  myTickets.filter(t => ['approved','assigned'].includes(t.status)).length,
    completed: myTickets.filter(t => t.status === 'completed').length,
  };

  return (
    <div className="page-enter max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Hello, {user?.name?.split(' ')[0]} 👋</h1>
        <p className="text-gray-400 text-sm mt-1">Submit and track your support tickets</p>
      </div>

      {/* Mini stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'My Tickets', value: stats.total,     icon: '🎫', color: 'orange' },
          { label: 'Pending',    value: stats.pending,   icon: '⏳', color: 'yellow' },
          { label: 'In Progress',value: stats.approved,  icon: '🔄', color: 'blue'   },
          { label: 'Resolved',   value: stats.completed, icon: '✅', color: 'green'  },
        ].map(s => (
          <div key={s.label}
            className={`bg-gradient-to-br from-${s.color}-600/20 to-${s.color}-800/10 border border-${s.color}-700/30 rounded-2xl p-4 flex items-start gap-3`}>
            <span className="text-xl">{s.icon}</span>
            <div>
              <p className="text-2xl font-bold text-white">{s.value}</p>
              <p className="text-xs text-gray-400">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Success toast */}
      {success && (
        <div className="bg-green-900/40 border border-green-700/50 rounded-xl px-4 py-3 text-green-300 text-sm flex items-center gap-2 animate-fade-in">
          <span>✅</span> {success}
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-800 rounded-xl p-1 w-fit">
        {[['create','+ New Ticket'],['tickets','My Tickets']].map(([key, label]) => (
          <button key={key} onClick={() => setActiveTab(key)}
            className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === key ? 'bg-orange-600 text-white' : 'text-gray-400 hover:text-white'}`}>
            {label}
          </button>
        ))}
      </div>

      {/* Create Ticket Form */}
      {activeTab === 'create' && (
        <div className="card p-6 animate-fade-in">
          <h2 className="text-lg font-semibold text-white mb-6">Submit a New Ticket</h2>
          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Title <span className="text-orange-500">*</span></label>
              <input
                id="ticket-title"
                type="text"
                value={form.title}
                onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                placeholder="Brief summary of the issue..."
                className={`form-input ${errors.title ? 'border-red-600' : ''}`}
              />
              {errors.title && <p className="text-xs text-red-400 mt-1">{errors.title}</p>}
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Description <span className="text-orange-500">*</span></label>
              <textarea
                id="ticket-description"
                rows={4}
                value={form.description}
                onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                placeholder="Describe the problem in detail..."
                className={`form-input resize-none ${errors.description ? 'border-red-600' : ''}`}
              />
              {errors.description && <p className="text-xs text-red-400 mt-1">{errors.description}</p>}
            </div>

            {/* Priority */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Priority</label>
              <div className="flex gap-3">
                {PRIORITIES.map(p => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setForm(f => ({ ...f, priority: p }))}
                    className={`px-4 py-2 rounded-xl border text-sm font-medium capitalize transition-all ${
                      form.priority === p
                        ? p === 'high'   ? 'bg-red-700/40 border-red-500 text-red-300'
                        : p === 'medium' ? 'bg-yellow-700/40 border-yellow-500 text-yellow-300'
                        :                  'bg-green-700/40 border-green-500 text-green-300'
                      : 'border-gray-700 text-gray-400 hover:border-gray-600'
                    }`}
                  >
                    {p === 'high' ? '🔴' : p === 'medium' ? '🟡' : '🟢'} {p}
                  </button>
                ))}
              </div>
            </div>

            {/* Image upload */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Attach Screenshot (optional)</label>
              <div
                className="border-2 border-dashed border-gray-700 hover:border-orange-600/50 rounded-xl p-6 text-center cursor-pointer transition-colors"
                onClick={() => fileRef.current?.click()}
              >
                {form.imagePreview ? (
                  <div className="space-y-3">
                    <img src={form.imagePreview} alt="Preview" className="max-h-40 mx-auto rounded-lg object-contain" />
                    <p className="text-xs text-gray-400">Click to change image</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="text-3xl">📎</div>
                    <p className="text-sm text-gray-400">Click to upload an image</p>
                    <p className="text-xs text-gray-600">PNG, JPG, GIF up to 10MB (preview only)</p>
                  </div>
                )}
              </div>
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
              />
            </div>

            {/* Submit */}
            <button id="submit-ticket" type="submit" disabled={submitting} className="btn-primary w-full py-3">
              {submitting ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                  </svg>
                  Submitting…
                </span>
              ) : 'Submit Ticket'}
            </button>
          </form>
        </div>
      )}

      {/* My Tickets */}
      {activeTab === 'tickets' && (
        <div className="animate-fade-in space-y-4">
          {myTickets.length === 0 ? (
            <div className="card p-12 text-center">
              <div className="text-4xl mb-4">🎫</div>
              <p className="text-gray-400">You haven't submitted any tickets yet.</p>
              <button className="btn-primary mt-4" onClick={() => setActiveTab('create')}>+ Create First Ticket</button>
            </div>
          ) : (
            myTickets.map(ticket => {
              const sla = getSlaStatus(ticket.slaDeadline);
              return (
                <div
                  key={ticket.id}
                  onClick={() => navigate(`/ticket/${ticket.id}`)}
                  className="card p-5 hover:border-orange-700/40 transition-all cursor-pointer group"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <span className="font-mono text-xs text-orange-500">{ticket.id}</span>
                        <PriorityBadge priority={ticket.priority} />
                        <SlaBadge status={sla} />
                      </div>
                      <h3 className="font-semibold text-white group-hover:text-orange-400 transition-colors">{ticket.title}</h3>
                      <p className="text-xs text-gray-500 mt-1">{formatDate(ticket.createdAt)}</p>
                    </div>
                    <StatusBadge status={ticket.status} />
                  </div>
                  {ticket.notes && (
                    <p className="mt-3 text-xs text-gray-400 bg-gray-800/60 rounded-lg px-3 py-2">
                      <span className="text-gray-300 font-medium">Note: </span>{ticket.notes}
                    </p>
                  )}
                  {ticket.forwardedTo && (
                    <p className="mt-2 text-xs text-purple-400">→ Forwarded to: {ticket.forwardedTo}</p>
                  )}
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}
