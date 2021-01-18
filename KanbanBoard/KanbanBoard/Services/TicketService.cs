using System.Collections.Generic;
using KanbanBoard.Models;
using KanbanBoard.PersistenceManagers;
using KanbanBoard.PersistenceManagers.Interfaces;
using KanbanBoard.Services.Interfaces;

namespace KanbanBoard.Services
{
    public class TicketService : ITicketService
    {
        private ITicketPersistenceManager ticketPersistenceManager = new TicketPersistenceManager();
        
        public IEnumerable<Ticket> GetAll()
        {
            return ticketPersistenceManager.LoadAll();
        }

        public Ticket GetById(int id)
        {
            if (!ValidateId(id))
            {
                return null;
            }

            return ticketPersistenceManager.Load(id);
        }

        public int Add(Ticket ticket)
        {
            return ticketPersistenceManager.Add(ticket);
        }

        public void Delete(int id)
        {
            if (!ValidateId(id) || ticketPersistenceManager.Load(id) == null)
            {
                return;
            }
            
            ticketPersistenceManager.Delete(id);
        }
        
        public IEnumerable<Ticket> GetByUserId(int userId)
        {
            if (!ValidateId(userId))
            {
                return null;
            }

            return ticketPersistenceManager.LoadByUserId(userId);
        }
        
        private bool ValidateId(int id)
        {
            return id >= 0;
        }
    }
}