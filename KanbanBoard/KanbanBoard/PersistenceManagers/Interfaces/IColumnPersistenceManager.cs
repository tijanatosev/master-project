using System.Collections.Generic;
using KanbanBoard.Models;

namespace KanbanBoard.PersistenceManagers.Interfaces
{
    public interface IColumnPersistenceManager : IPersistenceManager<Column>
    {
        Column Load(int id);
        
        IEnumerable<Column> LoadByBoardId(int boardId);
        
        int Add(Column column);
        
        void Delete(int id);
        
        int UpdateColumnOrder(int id, int columnOrder);
    }
}