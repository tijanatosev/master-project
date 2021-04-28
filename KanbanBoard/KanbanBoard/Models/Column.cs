namespace KanbanBoard.Models
{
    public class Column
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public int ColumnOrder { get; set; }
        public bool IsDone { get; set; }
        public int BoardId { get; set; }
    }
}