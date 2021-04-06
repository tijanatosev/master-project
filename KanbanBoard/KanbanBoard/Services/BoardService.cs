using System.Collections.Generic;
using KanbanBoard.Helpers;
using KanbanBoard.Models;
using KanbanBoard.PersistenceManagers;
using KanbanBoard.PersistenceManagers.Interfaces;
using KanbanBoard.Services.Interfaces;

namespace KanbanBoard.Services
{
    public class BoardService : IBoardService
    {
        private readonly IBoardPersistenceManager boardPersistenceManager = new BoardPersistenceManager();
        private readonly IValidationService validationService = new ValidationService();

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

        public int Add(Board board)
        {
            return boardPersistenceManager.Add(board);
        }

        public bool Update(int id, Board board)
        {
            if (!ValidateId(id) || boardPersistenceManager.Load(id) == null)
            {
                return false;
            }

            return boardPersistenceManager.Update(id, board) > 0;
        }

        public void Delete(int id)
        {
            if (!ValidateId(id))
            {
                return;
            }
            
            boardPersistenceManager.Delete(id);
        }

        public IEnumerable<Board> GetByUserId(int userId)
        {
            if (!ValidateId(userId))
            {
                return new List<Board>();
            }
            
            return boardPersistenceManager.LoadByUserId(userId);
        }

        public IEnumerable<Board> GetByTeamId(int teamId)
        {
            if (!ValidateId(teamId))
            {
                return new List<Board>();
            }

            return boardPersistenceManager.LoadByTeamId(teamId);
        }

        private bool ValidateId(int id)
        {
            return id > 0;
        }
    }
}