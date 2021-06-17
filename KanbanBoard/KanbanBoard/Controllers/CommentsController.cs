using System.Collections.Generic;
using KanbanBoard.Models;
using KanbanBoard.Services;
using KanbanBoard.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace KanbanBoard.Controllers
{
    [ApiController]
    [Route("api/comments")]
    public class CommentsController
    {
        private readonly ICommentService commentService = new CommentService();

        [HttpGet]
        [Route("ticket/{ticketId}")]
        public IEnumerable<Comment> GetCommentById([FromRoute] int ticketId)
        {
            return commentService.GetByTicketId(ticketId);
        }

        [HttpPost]
        [Route("ticket/{ticketId}")]
        public int Add([FromBody] Comment comment, [FromRoute] int ticketId)
        {
            return commentService.Add(comment, ticketId);
        }
        
        [HttpPut]
        [Route("{id}")]
        public int Update([FromRoute] int id, [FromBody] string text)
        {
            return commentService.Update(id, text);
        }

        [HttpDelete]
        [Route("{id}")]
        public void Delete([FromRoute] int id)
        {
            commentService.Delete(id);
        }
    }
}