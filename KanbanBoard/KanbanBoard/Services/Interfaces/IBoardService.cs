using System.Collections.Generic;
using KanbanBoard.Models;

namespace KanbanBoard.Services
{
    public interface IBoardService
    {
        IEnumerable<Board> GetAll();

        Board GetById(int id);

        bool Add(Board board);

        void Delete(int id);
    }
}