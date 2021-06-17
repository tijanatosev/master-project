using System.Collections.Generic;
using KanbanBoard.Models;

namespace KanbanBoard.Services.Interfaces
{
    public interface ICommentService
    {
        IEnumerable<Comment> GetByTicketId(int ticketId);
        
        int Add(Comment comment, int ticketId);

        int Update(int id, string text);

        void Delete(int commentId);
    }
}