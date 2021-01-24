using System.Collections.Generic;
using KanbanBoard.Models;

namespace KanbanBoard.Services.Interfaces
{
    public interface IBoardService
    {
        IEnumerable<Board> GetAll();

        Board GetById(int id);

        bool Add(Board board);

        void Delete(int id);
        
        IEnumerable<Board> GetByUserId(int userId);
        
        IEnumerable<Board> GetByTeamId(int teamId);
    }
}