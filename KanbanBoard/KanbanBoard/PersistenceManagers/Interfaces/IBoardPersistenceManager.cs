using System.Collections.Generic;
using KanbanBoard.Models;

namespace KanbanBoard.PersistenceManagers.Interfaces
{
    public interface IBoardPersistenceManager : IPersistenceManager<Board>
    {
        IEnumerable<Board> LoadAll();

        Board Load(int id);

        int Add(Board board);

        int Update(int id, Board board);

        void Delete(int id);
        
        IEnumerable<Board> LoadByUserId(int userId);
        
        IEnumerable<Board> LoadByTeamId(int teamId);
        
        Dictionary<string, int> GetNumberOfTicketsPerColumn(int id);
        
        Dictionary<string, int> GetNumberOfTicketsPerLabel(int id);
    }
}