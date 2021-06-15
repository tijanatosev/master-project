using System.Collections.Generic;
using KanbanBoard.Models;

namespace KanbanBoard.Services.Interfaces
{
    public interface ICommentService
    {
        IEnumerable<Comment> GetByTicketId(int ticketId);
        
        int Add(Comment comment, int ticketId);

        void Delete(int commentId, int ticketId);
    }
}