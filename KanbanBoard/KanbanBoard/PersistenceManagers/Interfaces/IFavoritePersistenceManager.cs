using System.Collections.Generic;
using KanbanBoard.Models;

namespace KanbanBoard.PersistenceManagers.Interfaces
{
    public interface IFavoritePersistenceManager : IPersistenceManager<Favorite>
    {
        IEnumerable<Favorite> LoadByUserId(int userId);

        Favorite Load(int ticketId, int userId);
        
        int Add(Favorite favorite);

        void Delete(int ticketId, int userId);
    }
}