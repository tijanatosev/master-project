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
        public IEnumerable<Team> GetAll()
        {
            return teamService.GetAll();
        }

        [HttpGet]
        [Route("{id}")]
        public Team GetById([FromRoute]int id)
        {
            return teamService.GetById(id);
        }

        [HttpPost]
        [Route("")]
        public IActionResult Save(Team team)
        {
            if (teamService.Add(team))
                return new StatusCodeResult(201);
            return new NoContentResult();
        }
    }
}