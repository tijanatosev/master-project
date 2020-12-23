using System.Collections.Generic;
using KanbanBoard.Models;
using KanbanBoard.Services;
using Microsoft.AspNetCore.Mvc;

namespace KanbanBoard.Controllers
{
    [ApiController]
    [Route("api/boards")]
    public class BoardsController
    {
        private IBoardService boardService = new BoardService();

        [HttpGet]
        [Route("")]
        public IEnumerable<Board> GetAll()
        {
            return boardService.GetAll();
        }

        [HttpGet]
        [Route("{id}")]
        public Board GetById([FromRoute] int id)
        {
            return boardService.GetById(id);
        }
        
        [HttpPost]
        [Route("")]
        public IActionResult Save(Board board)
        {
            if (!boardService.Add(board))
            {
                return new NoContentResult();
            }
            
            return new StatusCodeResult(201);
        }

        [HttpDelete]
        [Route("{id}")]
        public void Delete([FromRoute] int id)
        {
            boardService.Delete(id);
        }
    }
}