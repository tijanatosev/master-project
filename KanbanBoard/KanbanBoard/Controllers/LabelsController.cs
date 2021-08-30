using System.Collections.Generic;
using KanbanBoard.Helpers;
using KanbanBoard.Models;
using KanbanBoard.Services;
using KanbanBoard.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace KanbanBoard.Controllers
{
    [ApiController]
    [Route("api/labels")]
    public class LabelsController
    {
        private readonly ILabelService labelService;

        public LabelsController(ConnectionStringConfiguration connectionStringConfiguration)
        {
            labelService = new LabelService(connectionStringConfiguration);
        }

        [HttpGet]
        [Route("")]
        public IEnumerable<Label> GetAll()
        {
            return labelService.GetAll();
        }

        [HttpGet]
        [Route("{id}")]
        public Label GetById([FromRoute] int id)
        {
            return labelService.GetById(id);
        }

        [HttpPost]
        [Route("")]
        public int Add([FromBody] Label label)
        {
            return labelService.Add(label);
        }

        [HttpPut]
        [Route("{id}")]
        public IActionResult Update([FromRoute] int id, [FromBody] Label label)
        {
            if (!labelService.Update(id, label))
            {
                return new NoContentResult();
            }
            
            return new StatusCodeResult(200);
        }

        [HttpDelete]
        [Route("{id}")]
        public void Delete([FromRoute] int id)
        {
            labelService.Delete(id);
        }

        [HttpDelete]
        [Route("")]
        public void Delete()
        {
            labelService.DeleteAll();
        }

        [HttpGet]
        [Route("tickets/{ticketId}")]
        public IEnumerable<Label> GetByTicketId([FromRoute] int ticketId)
        {
            return labelService.GetByTicketId(ticketId);
        }

        [HttpDelete]
        [Route("{id}/tickets/{ticketId}")]
        public void DeleteByTicketId([FromRoute] int id, [FromRoute] int ticketId)
        {
            labelService.DeleteByTicketId(id, ticketId);
        }

        [HttpPost]
        [Route("tickets/{ticketId}")]
        public int AddByTicketId([FromBody] Label label, [FromRoute] int ticketId)
        {
            return labelService.AddByTicketId(label, ticketId);
        }

        [HttpGet]
        [Route("boards/{boardId}")]
        public IEnumerable<Label> GetByBoardId([FromRoute] int boardId)
        {
            return labelService.GetByBoardId(boardId);
        }
    }
}