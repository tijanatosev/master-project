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

        public IEnumerable<Ticket> GetByTeamId(int teamId)
        {
            if (!ValidateId(teamId))
            {
                return new List<Ticket>();
            }

            return ticketPersistenceManager.LoadByTeamId(teamId);
        }

        public IEnumerable<Ticket> GetByColumnId(int columnId)
        {
            if (!ValidateId(columnId))
            {
                return new List<Ticket>();
            }

            return ticketPersistenceManager.LoadByColumnId(columnId);
        }

        public bool UpdateColumn(int id, int columnId)
        {
            if (!ValidateId(id) || ticketPersistenceManager.Load(id) == null)
            {
                return false;
            }

            return ticketPersistenceManager.UpdateColumn(id, columnId) > 0;
        }

        private bool ValidateId(int id)
        {
            return id > 0;
        }
    }
}