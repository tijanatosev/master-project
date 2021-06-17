using System.Collections.Generic;
using KanbanBoard.Models;

namespace KanbanBoard.PersistenceManagers.Interfaces
{
    public interface ICommentPersistenceManager : IPersistenceManager<Comment>
    {
        IEnumerable<Comment> LoadByTicketId(int ticketId);

        int Add(Comment comment, int ticketId);

        int Update(int id, string text);

        void Delete(int commentId);
    }
}