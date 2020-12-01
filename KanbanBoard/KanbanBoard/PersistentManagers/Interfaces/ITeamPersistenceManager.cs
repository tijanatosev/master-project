using System.Collections.Generic;

namespace KanbanBoard.Models
{
    public interface ITeamPersistenceManager : IPersistenceManager<Team>
    {
        IEnumerable<Team> GetTeams();
    }
}