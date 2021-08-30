using System.Collections.Generic;
using KanbanBoard.Models;

namespace KanbanBoard.PersistenceManagers.Interfaces
{
    public interface IColumnPersistenceManager : IPersistenceManager<Column>
    {
        IEnumerable<Column> LoadAll();
        
        Column Load(int id);
        
        IEnumerable<Column> LoadByBoardId(int boardId);
        
        int Add(Column column);
        
        void Delete(int id);

        int Update(int id, Column column);
        
        int UpdateColumnOrder(int id, int columnOrder);

        void DeleteByBoardId(int boardId);

        int UpdateIsDone(int id, int boardId);

        Column GetDoneColumnForBoard(int boardId);
    }
}