using System.Collections.Generic;
using KanbanBoard.Models;

namespace KanbanBoard.Services.Interfaces
{
    public interface ITeamService
    {
        IEnumerable<Team> GetAll();

        Team GetById(int id);

        bool Add(Team team);

        void Delete(int id);

        IEnumerable<Team> GetTeamsByUserId(int userId);
    }
}