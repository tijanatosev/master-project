using System.Collections.Generic;
using KanbanBoard.Models;

namespace KanbanBoard.Services.Interfaces
{
    public interface INotificationService
    {
        IEnumerable<Notification> GetAll();

        Notification GetById(int id);

        Notification GetByUserId(int userId);

        int Add(Notification notification);

        bool Update(int id, Notification notification);
    }
}