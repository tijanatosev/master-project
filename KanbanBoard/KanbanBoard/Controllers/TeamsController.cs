using System.Collections.Generic;
using KanbanBoard.Models;
using KanbanBoard.Services;
using KanbanBoard.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace KanbanBoard.Controllers
{
    [ApiController]
    [Route("api/teams")]
    public class TeamsController
    {
        private readonly ITeamService teamService = new TeamService();

        [HttpGet]
        [Route("")]
        public IEnumerable<Team> GetAll()
        {
            return teamService.GetAll();
        }

        [HttpGet]
        [Route("{id}")]
        public Team GetById([FromRoute] int id)
        {
            return teamService.GetById(id);
        }

        [HttpPost]
        [Route("")]
        public int Save(Team team)
        {
            return teamService.Add(team);
        }

        [HttpDelete]
        [Route("{id}")]
        public void Delete([FromRoute] int id)
        {
            teamService.Delete(id);
        }

        [HttpGet]
        [Route("users/{userId}")]
        public IEnumerable<Team> GetTeamsByUsedId([FromRoute] int userId)
        {
            return teamService.GetTeamsByUserId(userId);
        }

        [HttpPost]
        [Route("users/{teamId}")]
        public IActionResult AddUsersToTeam([FromRoute] int teamId, [FromBody] List<int> userIds)
        {
            if (!teamService.AddUsersToTeam(teamId, userIds))
            {
                return new NoContentResult();
            }
            
            return new StatusCodeResult(201);
        }
    }
}