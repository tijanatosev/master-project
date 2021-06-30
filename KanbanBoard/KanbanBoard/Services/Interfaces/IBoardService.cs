using System.Collections.Generic;
using KanbanBoard.Models;

namespace KanbanBoard.Services.Interfaces
{
    public interface IBoardService
    {
        IEnumerable<Board> GetAll();

        Board GetById(int id);

        int Add(Board board);

        bool Update(int id, Board board);

        void Delete(int id);
        
        IEnumerable<Board> GetByUserId(int userId);
        
        IEnumerable<Board> GetByTeamId(int teamId);

        Dictionary<string, int> GetNumberOfTicketsPerColumn(int id);
        
        Dictionary<string, int> GetNumberOfTicketsPerLabel(int id);
    }
}