using System.Collections.Generic;

namespace KanbanBoard.Models
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