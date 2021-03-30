using System.Collections.Generic;
using KanbanBoard.Models;
using KanbanBoard.Services;
using KanbanBoard.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace KanbanBoard.Controllers
{
    [Route("api/tickets")]
    public class TicketController : Controller
    {
        private ITicketService ticketService = new TicketService();
        
        [HttpGet]
        [Route("")]
        public IEnumerable<Ticket> GetAll()
        {
            return ticketService.GetAll();
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
        [Route("column/{columnId}")]
        public IEnumerable<Ticket> GetTicketsByColumnId([FromRoute] int columnId)
        {
            return ticketService.GetByColumnId(columnId);
        }

        [HttpPut]
        [Route("{ticketId}/column")]
        public IActionResult UpdateColumn([FromRoute] int ticketId, [FromBody] int columnId)
        {
            if (!ticketService.UpdateColumn(ticketId, columnId))
            {
                return new NoContentResult();
            }
            
            return new StatusCodeResult(200);
        }
    }
}