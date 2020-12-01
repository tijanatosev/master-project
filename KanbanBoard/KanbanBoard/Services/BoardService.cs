using System.Collections.Generic;
using KanbanBoard.Models;

namespace KanbanBoard.Services
{
    public class BoardService : IBoardService
    {
        private BoardPersistenceManager boardPersistenceManager = new BoardPersistenceManager();

        public IEnumerable<Board> GetBoards()
        {
            return boardPersistenceManager.GetBoards();
        }
    }
}