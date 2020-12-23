using System.Collections.Generic;
using KanbanBoard.Models;

namespace KanbanBoard.Services
{
    public class BoardService : IBoardService
    {
        private BoardPersistenceManager boardPersistenceManager = new BoardPersistenceManager();

        public IEnumerable<Board> GetAll()
        {
            return boardPersistenceManager.LoadAll();
        }

        public Board GetById(int id)
        {
            if (!ValidateId(id))
            {
                return null;
            }

            return boardPersistenceManager.Load(id);
        }

        public bool Add(Board board)
        {
            return boardPersistenceManager.Add(board) > 0;
        }

        public void Delete(int id)
        {
            if (!ValidateId(id))
            {
                return;
            }
            
            boardPersistenceManager.Delete(id);
        }

        private bool ValidateId(int id)
        {
            return id >= 0;
        }
    }
}