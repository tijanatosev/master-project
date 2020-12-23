using System.Collections.Generic;
using KanbanBoard.Models;

namespace KanbanBoard.Services
{
    public class TeamService : ITeamService
    {
        private readonly TeamPersistenceManager teamPersistenceManager = new TeamPersistenceManager();

        public IEnumerable<Team> GetAll()
        {
            return teamPersistenceManager.LoadAll();
        }

        public Team GetById(int id)
        {
            if (!ValidateId(id))
            {
                return null;
            }

            return teamPersistenceManager.Load(id);
        }

        public bool Add(Team team)
        {
            if (!ValidateTeamName(team.Name))
            {
                return false;
            }

            return teamPersistenceManager.Add(team) > 0;
        }

        public void Delete(int id)
        {
            if (!ValidateId(id))
            {
                return;
            }
            
            teamPersistenceManager.Delete(id);
        }

        private bool ValidateTeamName(string name)
        {
            if (teamPersistenceManager.LoadByName(name) != null)
            {
                return false;
            }

            return true;
        }

        private bool ValidateId(int id)
        {
            return id >= 0;
        }
    }
}