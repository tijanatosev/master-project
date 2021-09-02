using System;

namespace KanbanBoard.Models
{
    public class Ticket
    {
        public int Id { get; set; }
        public string Title { get; set; } 
        public string Description { get; set; } 
        public string Creator { get; set; } 
        public int StoryPoints { get; set; } 
        public string Status { get; set; } 
        public DateTime DateCreated { get; set; } 
        public int AssignedTo { get; set; }
        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public int Rank { get; set; }
        public int Priority { get; set; }
        public int ColumnId { get; set; } 
        public DateTime? CompletedAt { get; set; }
    }
}