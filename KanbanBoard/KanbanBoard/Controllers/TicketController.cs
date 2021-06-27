using System.Collections.Generic;
using KanbanBoard.Models;
using KanbanBoard.Services;
using KanbanBoard.Services.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace KanbanBoard.Controllers
{
    [Route("api/tickets")]
    public class TicketController : Controller
    {
        private ITicketService ticketService;
        private IHttpContextAccessor httpContextAccessor;

        public TicketController(IHttpContextAccessor httpContextAccessor)
        {
            ticketService = new TicketService();
            this.httpContextAccessor = httpContextAccessor;
        }
        
        [HttpGet]
        [Route("")]
        public IEnumerable<Ticket> GetAll()
        {
            IQueryCollection queryCollection = httpContextAccessor.HttpContext.Request.Query;
            return ticketService.GetAll(queryCollection);
        }

        [HttpGet]
        [Route("{id}")]
        public Ticket GetById([FromRoute] int id)
        {
            return ticketService.GetById(id);
        }
        
        [HttpPost]
        [Route("")]
        public int Save([FromBody] Ticket ticket)
        {
            return ticketService.Add(ticket);
        }

        [HttpDelete]
        [Route("{id}")]
        public void Delete([FromRoute] int id)
        {
            ticketService.Delete(id);
        }
        
        [HttpGet]
        [Route("assigned/{userId}")]
        public IEnumerable<Ticket> GetTicketsByUserId([FromRoute] int userId)
        {
            return ticketService.GetByUserId(userId);
        }

        [HttpGet]
        [Route("team/{teamId}")]
        public IEnumerable<Ticket> GetTicketsByTeamId([FromRoute] int teamId)
        {
            return ticketService.GetByTeamId(teamId);
        }

        [HttpGet]
        [Route("board/{boardId}")]
        public IEnumerable<Ticket> GetTicketsByBoardId([FromRoute] int boardId)
        {
            return ticketService.GetByBoardId(boardId);
        }

        [HttpGet]
        [Route("column/{columnId}")]
        public IEnumerable<Ticket> GetTicketsByColumnId([FromRoute] int columnId)
        {
            IQueryCollection queryCollection = httpContextAccessor.HttpContext.Request.Query;
            return ticketService.GetByColumnId(columnId, queryCollection);
        }

        [HttpPut]
        [Route("{id}/column")]
        public IActionResult UpdateColumn([FromRoute] int id, [FromBody] int columnId)
        {
            if (!ticketService.UpdateColumn(id, columnId))
            {
                return new NoContentResult();
            }
            
            return new StatusCodeResult(200);
        }

        [HttpPut]
        [Route("{id}/rank")]
        public IActionResult UpdateRank([FromRoute] int id, [FromBody] int rank)
        {
            if (!ticketService.UpdateRank(id, rank))
            {
                return new NoContentResult();
            }
            
            return new StatusCodeResult(200);
        }

        [HttpPut]
        [Route("{id}/assignedTo")]
        public IActionResult UpdateAssignedTo([FromRoute] int id, [FromBody] int userId)
        {
            if (!ticketService.UpdateAssignedTo(id, userId))
            {
                return new NoContentResult();
            }
            
            return new StatusCodeResult(200);
        }
        
        [HttpPut]
        [Route("{id}/startDate")]
        public IActionResult UpdateStartDate([FromRoute] int id, [FromBody] string startDate)
        {
            if (!ticketService.UpdateStartDate(id, startDate))
            {
                return new NoContentResult();
            }

            return new StatusCodeResult(200);
        }
        
        [HttpPut]
        [Route("{id}/endDate")]
        public IActionResult UpdateEndDate([FromRoute] int id, [FromBody] string endDate)
        {
            if (!ticketService.UpdateEndDate(id, endDate))
            {
                return new NoContentResult();
            }
            
            return new StatusCodeResult(200);
        }

        [HttpPut]
        [Route("{id}/storyPoints")]
        public IActionResult UpdateStoryPoints([FromRoute] int id, [FromBody] int storyPoints)
        {
            if (!ticketService.UpdateStoryPoints(id, storyPoints))
            {
                return new NoContentResult();
            }
            
            return new StatusCodeResult(200);
        }
        
        [HttpPut]
        [Route("{id}/title")]
        public IActionResult UpdateTitle([FromRoute] int id, [FromBody] Ticket ticket)
        {
            if (!ticketService.UpdateTitle(id, ticket.Title))
            {
                return new NoContentResult();
            }
            
            return new StatusCodeResult(200);
        }

        [HttpPut]
        [Route("{id}/description")]
        public IActionResult UpdateDescription([FromRoute] int id, [FromBody] Ticket ticket)
        {
            if (!ticketService.UpdateDescription(id, ticket.Description))
            {
                return new NoContentResult();
            }
            
            return new StatusCodeResult(200);
        }

        [HttpGet]
        [Route("favorites/{userId}")]
        public IEnumerable<Ticket> GetFavoritesByUserId([FromRoute] int userId)
        {
            return ticketService.GetFavoritesByUserId(userId);
        }

        [HttpPut]
        [Route("{id}/priority")]
        public IActionResult UpdatePriority([FromRoute] int id, [FromBody] int priority)
        {
            if (!ticketService.UpdatePriority(id, priority))
            {
                return new NoContentResult();
            }
            
            return new StatusCodeResult(200);
        }
        
        [HttpGet]
        [Route("{columnId}/rank/{boardId}")]
        public int GetRankForColumn([FromRoute] int columnId, [FromRoute] int boardId)
        {
            return ticketService.GetRankForColumn(columnId, boardId);
        }
    }
}