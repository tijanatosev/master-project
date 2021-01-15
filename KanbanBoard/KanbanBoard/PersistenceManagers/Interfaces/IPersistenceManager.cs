using System.Data;

namespace KanbanBoard.PersistenceManagers.Interfaces
{
    public interface IPersistenceManager<T>
    {
        T LoadFromDataRow(DataRow row);
    }
}