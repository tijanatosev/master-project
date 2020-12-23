using System.Collections.Generic;

namespace KanbanBoard.Models
{
    public interface ITeamPersistenceManager : IPersistenceManager<Team>
    {
        IEnumerable<Team> LoadAll();

        Team Load(int id);

        Team LoadByName(string name);

        int Add(Team team);

        void Delete(int id);
    }
}