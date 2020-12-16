using System.Collections.Generic;

namespace KanbanBoard.Models
{
    public interface IUserPersistenceManager : IPersistenceManager<User>
    {
        IEnumerable<User> LoadAll();
    }
}