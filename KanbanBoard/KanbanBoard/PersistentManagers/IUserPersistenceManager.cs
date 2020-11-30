using System.Collections.Generic;

namespace KanbanBoard.Models
{
    public interface IUserPersistenceManager
    {
        IEnumerable<User> GetUsers();
    }
}