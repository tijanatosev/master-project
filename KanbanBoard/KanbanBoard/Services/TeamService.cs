using System.Collections.Generic;
using KanbanBoard.Models;

namespace KanbanBoard.Services
{
    public class TeamService : ITeamService
    {
        private TeamPersistenceManager teamPersistenceManager = new TeamPersistenceManager();

        public IEnumerable<Team> GetAll()
        {
            return teamPersistenceManager.LoadAll();
        }

        public Team GetById(int id)
        {
            if (id < 0)
                return null;
            return teamPersistenceManager.Load(id);
        }

        public bool Add(Team team)
        {
            if (ValidateTeamName(team.Name))
            {
                teamPersistenceManager.Add(team);
                return true;
            }

            return false;
        }

        private bool ValidateTeamName(string name)
        {
            if (teamPersistenceManager.LoadByName(name) == null)
                return true;
            return false;
        }
    }
}