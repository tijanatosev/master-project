namespace KanbanBoard.Models
{
    public class Board
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Admin { get; set; }
        public int? TeamId { get; set; }
    }
}