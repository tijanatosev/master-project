using System.Collections.Generic;

namespace KanbanBoard.Models
{
    public interface IBoardPersistenceManager : IPersistenceManager<Board>
    {
        IEnumerable<Board> GetBoards();
    }
}