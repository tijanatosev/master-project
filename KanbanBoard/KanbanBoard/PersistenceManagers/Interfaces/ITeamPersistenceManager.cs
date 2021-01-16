using System.Collections.Generic;
using KanbanBoard.Models;

namespace KanbanBoard.PersistenceManagers.Interfaces
{
    public interface ITeamPersistenceManager : IPersistenceManager<Team>
    {
        IEnumerable<Team> LoadAll();

        Team Load(int id);

        Team LoadByName(string name);

        int Add(Team team);

        void Delete(int id);

        IEnumerable<Team> LoadByUserId(int userId);

        int AddUsersToTeam(int teamId, List<int> userIds);
    }
}