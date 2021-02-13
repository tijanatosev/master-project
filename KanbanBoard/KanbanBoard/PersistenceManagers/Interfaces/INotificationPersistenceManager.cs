using System.Collections.Generic;
using KanbanBoard.Models;

namespace KanbanBoard.PersistenceManagers.Interfaces
{
    public interface INotificationPersistenceManager : IPersistenceManager<Notification>
    {
        IEnumerable<Notification> LoadAll();

        Notification Load(int id);

        Notification LoadByUserId(int userId);

        int Add(Notification notification);

        int Update(Notification notification);
    }
}