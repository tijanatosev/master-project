using System.Collections.Generic;
using KanbanBoard.Models;
using KanbanBoard.Services;
using KanbanBoard.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace KanbanBoard.Controllers
{
    [ApiController]
    [Route("api/columns")]
    public class ColumnsController
    {
        private readonly IColumnService columnService = new ColumnService();

        [HttpGet]
        [Route("boards/{boardId}")]
        public IEnumerable<Column> GetByBoardId([FromRoute] int boardId)
        {
            return columnService.GetByBoardId(boardId);
        }

        [HttpGet]
        [Route("{id}")]
        public Column GetById([FromRoute] int id)
        {
            return columnService.GetById(id);
        }

        [HttpPost]
        [Route("")]
        public int Add([FromBody] Column column)
        {
            return columnService.Add(column);
        }

        [HttpDelete]
        [Route("{id}")]
        public void Delete([FromRoute] int id)
        {
            columnService.Delete(id);
        }

        [HttpPut]
        [Route("{id}/order")]
        public IActionResult UpdateColumnOrder([FromRoute] int id, [FromBody] int columnOrder)
        {
            if (!columnService.UpdateColumnOrder(id, columnOrder))
            {
                return new NoContentResult();
            }
            
            return new StatusCodeResult(200);
        }

        [HttpDelete]
        [Route("boards/{boardId}")]
        public void DeleteByBoardId([FromRoute] int boardId)
        {
            columnService.DeleteByBoardId(boardId);
        }
        
        [HttpPut]
        [Route("{id}/isDone")]
        public IActionResult UpdateIsDone([FromRoute] int id, [FromBody] int boardId)
        {
            if (!columnService.UpdateIsDone(id, boardId))
            {
                return new NoContentResult();
            }
            
            return new StatusCodeResult(200);
        }
    }
}