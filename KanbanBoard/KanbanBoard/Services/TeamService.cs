using System.Collections.Generic;
using KanbanBoard.Models;

namespace KanbanBoard.Services
{
    public class TeamService : ITeamService
    {
        private TeamPersistenceManager teamPersistenceManager = new TeamPersistenceManager();

        public IEnumerable<Team> GetTeams()
        {
            return teamPersistenceManager.GetTeams();
        }
    }
}