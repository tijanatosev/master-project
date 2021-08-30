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
        private readonly IBoardPersistenceManager boardPersistenceManager;
        private readonly IValidationService validationService;

        public BoardService(ConnectionStringConfiguration connectionStringConfiguration)
        {
            boardPersistenceManager = new BoardPersistenceManager(connectionStringConfiguration);
            validationService = new ValidationService();
        }


        public IEnumerable<Board> GetAll()
        {
            return boardPersistenceManager.LoadAll();
        }

        public Board GetById(int id)
        {
            if (!validationService.ValidateId(id))
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
            if (!validationService.ValidateId(id) || boardPersistenceManager.Load(id) == null)
            {
                return false;
            }

            return boardPersistenceManager.Update(id, board) > 0;
        }

        public void Delete(int id)
        {
            if (!validationService.ValidateId(id))
            {
                return;
            }
            
            boardPersistenceManager.Delete(id);
        }

        public IEnumerable<Board> GetByUserId(int userId)
        {
            if (!validationService.ValidateId(userId))
            {
                return new List<Board>();
            }
            
            return boardPersistenceManager.LoadByUserId(userId);
        }

        public IEnumerable<Board> GetByTeamId(int teamId)
        {
            if (!validationService.ValidateId(teamId))
            {
                return new List<Board>();
            }

            return boardPersistenceManager.LoadByTeamId(teamId);
        }

        public Dictionary<string, int> GetNumberOfTicketsPerColumn(int id)
        {
            if (!validationService.ValidateId(id))
            {
                return new Dictionary<string, int>();
            }
            return boardPersistenceManager.GetNumberOfTicketsPerColumn(id);
        }
        
        public Dictionary<string, int> GetNumberOfTicketsPerLabel(int id)
        {
            if (!validationService.ValidateId(id))
            {
                return new Dictionary<string, int>();
            }
            return boardPersistenceManager.GetNumberOfTicketsPerLabel(id);
        }
    }
}