using System.Collections.Generic;
using KanbanBoard.Models;

namespace KanbanBoard.Services.Interfaces
{
    public interface IColumnService
    {
        IEnumerable<Column> GetAll();
        
        IEnumerable<Column> GetByBoardId(int boardId);

        Column GetById(int id);

        int Add(Column column);

        void Delete(int id);

        bool UpdateColumnOrder(int id, int columnOrder);

        void DeleteByBoardId(int boardId);

        bool UpdateIsDone(int id, int boardId);

        Column GetDoneColumnForBoard(int boardId);
    }
}