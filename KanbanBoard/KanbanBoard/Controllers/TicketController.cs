﻿using System;
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
    }
}