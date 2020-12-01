using System.Data;

namespace KanbanBoard.Models
{
    public interface IPersistenceManager<T>
    {
        T LoadFromDataRow(DataRow row);
    }
}