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
    }
}