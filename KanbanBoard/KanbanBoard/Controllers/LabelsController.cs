using System.Collections.Generic;
using KanbanBoard.Models;
using KanbanBoard.Services;
using Microsoft.AspNetCore.Mvc;

namespace KanbanBoard.Controllers
{
    [ApiController]
    [Route("api/labels")]
    public class LabelsController
    {
        private readonly LabelService labelService = new LabelService();

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
    }
}