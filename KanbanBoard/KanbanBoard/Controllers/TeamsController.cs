using System.Collections.Generic;
using KanbanBoard.Models;
using KanbanBoard.Services;
using Microsoft.AspNetCore.Mvc;

namespace KanbanBoard.Controllers
{
    [ApiController]
    [Route("api/teams")]
    public class TeamsController
    {
        private ITeamService teamService = new TeamService();

        [HttpGet]
        [Route("")]
        public IEnumerable<Team> GetTeams()
        {
            return teamService.GetTeams();
        }
    }
}