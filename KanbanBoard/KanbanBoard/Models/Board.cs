namespace KanbanBoard.Models
{
    public class Board
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Admin { get; set; }
        public int? TeamId { get; set; }
        public bool IsPomodoro { get; set; }
        public int WorkTime { get; set; }
        public int BreakTime { get; set; }
        public int Iterations { get; set; }
        public int LongerBreak { get; set; }
    }
}