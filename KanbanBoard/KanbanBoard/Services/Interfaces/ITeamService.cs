using System.Collections.Generic;
using KanbanBoard.Models;

namespace KanbanBoard.Services
{
    public interface ITeamService
    {
        IEnumerable<Team> GetTeams();
    }
}