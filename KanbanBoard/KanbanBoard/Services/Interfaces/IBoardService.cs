using System.Collections.Generic;
using KanbanBoard.Models;

namespace KanbanBoard.Services
{
    public interface IBoardService
    {
        IEnumerable<Board> GetBoards();
    }
}