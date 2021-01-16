using System.Collections.Generic;
using KanbanBoard.Models;

namespace KanbanBoard.Services.Interfaces
{
    public interface ITeamService
    {
        IEnumerable<Team> GetAll();

        Team GetById(int id);

        int Add(Team team);

        void Delete(int id);

        IEnumerable<Team> GetTeamsByUserId(int userId);

        bool AddUsersToTeam(int teamId, List<int> userIds);
    }
}