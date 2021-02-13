namespace KanbanBoard.Models
{
    public class Notification
    {
        public int Id { get; set; }
        public bool OnChange { get; set; }
        public bool OnComment { get; set; }
        public bool OnCommentMine { get; set; }
        public bool OnStatusChange { get; set; }
        public bool OnStatusChangeMine { get; set; }
        public int UserId { get; set; }
    }
}