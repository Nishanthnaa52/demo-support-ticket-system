import { createContext, useContext, useState, useCallback } from 'react';
import {
  loadTickets, saveTickets, addTicket as storageAdd,
  updateTicket as storageUpdate, generateTicketId,
} from '../utils/storage';
import { computeSlaDeadline } from '../utils/sla';
import { addNotification } from '../utils/storage';

const TicketContext = createContext(null);

export function TicketProvider({ children }) {
  const [tickets, setTickets] = useState(() => loadTickets());

  // Refresh from storage
  const refresh = useCallback(() => setTickets(loadTickets()), []);

  // Create new ticket (employee)
  const createTicket = useCallback((data, user) => {
    const id = generateTicketId();
    const now = Date.now();
    const ticket = {
      id,
      title: data.title,
      description: data.description,
      priority: data.priority,
      status: 'created',
      createdBy: user.id,
      createdByName: user.name,
      assignedTo: null,
      forwardedTo: null,
      createdAt: now,
      slaDeadline: computeSlaDeadline(now),
      updatedAt: now,
      imagePreview: data.imagePreview || null,
      notes: '',
    };
    storageAdd(ticket);
    setTickets(loadTickets());
    return ticket;
  }, []);

  // Approve ticket (manager)
  const approveTicket = useCallback((id, managerName) => {
    storageUpdate(id, { status: 'approved', assignedTo: managerName });
    addNotification({ message: `Ticket ${id} has been approved ✅`, role: 'employee' });
    addNotification({ message: `Ticket ${id} approved — ready for assignment`, role: 'ceo' });
    setTickets(loadTickets());
  }, []);

  // Reject ticket (manager)
  const rejectTicket = useCallback((id, notes = '') => {
    storageUpdate(id, { status: 'rejected', notes });
    addNotification({ message: `Ticket ${id} was rejected ❌`, role: 'employee' });
    setTickets(loadTickets());
  }, []);

  // Forward ticket to cross-functional manager
  const forwardTicket = useCallback((id, targetManager) => {
    storageUpdate(id, { status: 'assigned', forwardedTo: targetManager });
    addNotification({ message: `Ticket ${id} assigned to ${targetManager}`, role: 'employee' });
    addNotification({ message: `Ticket ${id} has been forwarded to ${targetManager}`, role: 'ceo' });
    setTickets(loadTickets());
  }, []);

  // Complete ticket
  const completeTicket = useCallback((id) => {
    storageUpdate(id, { status: 'completed' });
    addNotification({ message: `Ticket ${id} has been marked as completed ✅`, role: 'employee' });
    addNotification({ message: `Ticket ${id} completed successfully`, role: 'ceo' });
    setTickets(loadTickets());
  }, []);

  return (
    <TicketContext.Provider value={{
      tickets, refresh,
      createTicket, approveTicket, rejectTicket, forwardTicket, completeTicket,
    }}>
      {children}
    </TicketContext.Provider>
  );
}

export function useTickets() {
  const ctx = useContext(TicketContext);
  if (!ctx) throw new Error('useTickets must be used inside TicketProvider');
  return ctx;
}
