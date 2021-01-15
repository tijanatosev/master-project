using System.Collections.Generic;
using KanbanBoard.Models;

namespace KanbanBoard.PersistenceManagers.Interfaces
{
    public interface IUserPersistenceManager : IPersistenceManager<User>
    {
        IEnumerable<User> LoadAll();
        
        User Load(int id);

        User Load(string username);

        int Add(User user);

        void Delete(int id);
    }
}