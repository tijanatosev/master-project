using System.Collections.Generic;
using KanbanBoard.Helpers;
using KanbanBoard.Models;
using KanbanBoard.Services;
using KanbanBoard.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace KanbanBoard.Controllers
{
    [ApiController]
    [Route("api/boards")]
    public class BoardsController
    {
        private readonly IBoardService boardService;

        public BoardsController(ConnectionStringConfiguration connectionStringConfiguration)
        {
            boardService = new BoardService(connectionStringConfiguration);
        }

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
        public int Save(Board board)
        {
            return boardService.Add(board);
        }

        [HttpPut]
        [Route("{id}")]
        public IActionResult Update([FromRoute] int id, [FromBody] Board board)
        {
            if (!boardService.Update(id, board))
            {
                return new NoContentResult();
            }
            
            return new StatusCodeResult(200);
        }

        [HttpDelete]
        [Route("{id}")]
        public void Delete([FromRoute] int id)
        {
            boardService.Delete(id);
        }

        [HttpGet]
        [Route("user/{userId}")]
        public IEnumerable<Board> GetByUserId([FromRoute] int userId)
        {
            return boardService.GetByUserId(userId);
        }

        [HttpGet]
        [Route("team/{teamId}")]
        public IEnumerable<Board> GetByTeamId([FromRoute] int teamId)
        {
            return boardService.GetByTeamId(teamId);
        }
        
        [HttpGet]
        [Route("stats/{id}/columns")]
        public Dictionary<string, int> GetNumberOfTicketsPerColumn([FromRoute] int id)
        {
            return boardService.GetNumberOfTicketsPerColumn(id);
        }
        
        [HttpGet]
        [Route("stats/{id}/labels")]
        public Dictionary<string, int> GetNumberOfTicketsPerLabel([FromRoute] int id)
        {
            return boardService.GetNumberOfTicketsPerLabel(id);
        }
    }
}