import { SEED_TICKETS, SEED_NOTIFICATIONS } from '../data/mockData';

const TICKETS_KEY       = 'sd_tickets';
const NOTIFS_KEY        = 'sd_notifications';
const USER_KEY          = 'sd_user';

// ─── Bootstrap (seed data if first run) ─────────────────────────────────
export function bootstrap() {
  if (!localStorage.getItem(TICKETS_KEY)) {
    localStorage.setItem(TICKETS_KEY, JSON.stringify(SEED_TICKETS));
  }
  if (!localStorage.getItem(NOTIFS_KEY)) {
    localStorage.setItem(NOTIFS_KEY, JSON.stringify(SEED_NOTIFICATIONS));
  }
}

// ─── User ────────────────────────────────────────────────────────────────
export function saveUser(user)    { localStorage.setItem(USER_KEY, JSON.stringify(user)); }
export function loadUser()        { const d = localStorage.getItem(USER_KEY); return d ? JSON.parse(d) : null; }
export function clearUser()       { localStorage.removeItem(USER_KEY); }

// ─── Tickets ─────────────────────────────────────────────────────────────
export function loadTickets()     {
  const d = localStorage.getItem(TICKETS_KEY);
  return d ? JSON.parse(d) : [];
}

export function saveTickets(tickets) {
  localStorage.setItem(TICKETS_KEY, JSON.stringify(tickets));
}

export function addTicket(ticket) {
  const tickets = loadTickets();
  tickets.unshift(ticket);
  saveTickets(tickets);
}

export function updateTicket(id, changes) {
  const tickets = loadTickets().map(t =>
    t.id === id ? { ...t, ...changes, updatedAt: Date.now() } : t
  );
  saveTickets(tickets);
}

export function getTicketById(id) {
  return loadTickets().find(t => t.id === id) || null;
}

// ─── Notifications ───────────────────────────────────────────────────────
export function loadNotifications() {
  const d = localStorage.getItem(NOTIFS_KEY);
  return d ? JSON.parse(d) : [];
}

export function saveNotifications(notifs) {
  localStorage.setItem(NOTIFS_KEY, JSON.stringify(notifs));
}

export function addNotification(notif) {
  const notifs = loadNotifications();
  notifs.unshift({ ...notif, id: `n${Date.now()}`, time: Date.now(), read: false });
  saveNotifications(notifs);
}

export function markAllRead() {
  const notifs = loadNotifications().map(n => ({ ...n, read: true }));
  saveNotifications(notifs);
}

// ─── ID generator ────────────────────────────────────────────────────────
export function generateTicketId() {
  const tickets = loadTickets();
  const max = tickets.reduce((acc, t) => {
    const n = parseInt(t.id.replace('TKT-', ''), 10);
    return isNaN(n) ? acc : Math.max(acc, n);
  }, 0);
  return `TKT-${String(max + 1).padStart(3, '0')}`;
}
