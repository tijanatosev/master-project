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
        public IEnumerable<Ticket> GetTeamsByUserId([FromRoute] int userId)
        {
            return ticketService.GetByUserId(userId);
        }
    }
}