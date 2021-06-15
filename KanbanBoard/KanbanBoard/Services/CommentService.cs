using System.Collections.Generic;
using KanbanBoard.Helpers;
using KanbanBoard.Models;
using KanbanBoard.PersistenceManagers;
using KanbanBoard.PersistenceManagers.Interfaces;
using KanbanBoard.Services.Interfaces;

namespace KanbanBoard.Services
{
    public class CommentService : ICommentService
    {
        private readonly ICommentPersistenceManager commentPersistenceManager = new CommentPersistenceManager();
        private readonly IValidationService validationService = new ValidationService();
        
        public IEnumerable<Comment> GetByTicketId(int ticketId)
        {
            if (!validationService.ValidateId(ticketId))
            {
                return new List<Comment>();
            }

            return commentPersistenceManager.LoadByTicketId(ticketId);
        }

        public int Add(Comment comment, int ticketId)
        {
            if (!validationService.ValidateId(ticketId))
            {
                return 0;
            }

            return commentPersistenceManager.Add(comment, ticketId);
        }

        public void Delete(int commentId, int ticketId)
        {
            if (!validationService.ValidateId(ticketId) || !validationService.ValidateId(commentId))
            {
                return;
            }
            
            commentPersistenceManager.Delete(commentId, ticketId);
        }
    }
}