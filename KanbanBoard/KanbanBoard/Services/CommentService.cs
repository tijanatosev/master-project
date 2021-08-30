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
        private readonly ICommentPersistenceManager commentPersistenceManager;
        private readonly IValidationService validationService;

        public CommentService(ConnectionStringConfiguration connectionStringConfiguration)
        {
            commentPersistenceManager = new CommentPersistenceManager(connectionStringConfiguration);
            validationService = new ValidationService();
        }

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

        public int Update(int id, string text)
        {
            if (!validationService.ValidateId(id))
            {
                return 0;
            }

            return commentPersistenceManager.Update(id, text);
        }

        public void Delete(int commentId)
        {
            if (!validationService.ValidateId(commentId))
            {
                return;
            }
            
            commentPersistenceManager.Delete(commentId);
        }
    }
}