using System;

namespace KanbanBoard.Models
{
    public class Comment
    {
        public int Id { get; set; }
        public DateTime CommentedAt { get; set; }
        public string Text { get; set; }
        public int UserId { get; set; }
        public int TicketId { get; set; }
    }
}