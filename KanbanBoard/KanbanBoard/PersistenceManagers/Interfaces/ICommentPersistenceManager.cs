using System.Collections.Generic;
using KanbanBoard.Models;

namespace KanbanBoard.PersistenceManagers.Interfaces
{
    public interface ICommentPersistenceManager : IPersistenceManager<Comment>
    {
        IEnumerable<Comment> LoadByTicketId(int ticketId);

        int Add(Comment comment, int ticketId);

        void Delete(int commentId, int ticketId);
    }
}