using System.Collections.Generic;
using KanbanBoard.Models;

namespace KanbanBoard.PersistenceManagers.Interfaces
{
    public interface ITicketPersistenceManager : IPersistenceManager<Ticket>
    {
        IEnumerable<Ticket> LoadAll();

        Ticket Load(int id);

        int Add(Ticket ticket);

        void Delete(int id);
        
        IEnumerable<Ticket> LoadByUserId(int userId);
    }
}