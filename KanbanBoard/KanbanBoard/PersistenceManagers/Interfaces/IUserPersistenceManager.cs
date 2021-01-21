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

        int Update(User user);

        int UpdatePassword(int id, string password);

        void Delete(int id);

        IEnumerable<User> LoadByTeamId(int teamId);
    }
}