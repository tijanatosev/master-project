namespace KanbanBoard.Models
{
    public class Favorite
    {
        public int Id { get; set; }
        public int TicketId { get; set; }
        public int UserId { get; set; }
    }
}