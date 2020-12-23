using System.Collections.Generic;

namespace KanbanBoard.Models
{
    public interface IBoardPersistenceManager : IPersistenceManager<Board>
    {
        IEnumerable<Board> LoadAll();

        Board Load(int id);

        int Add(Board board);

        void Delete(int id);
    }
}