using System.Collections.Generic;
using KanbanBoard.Helpers;
using KanbanBoard.Models;
using KanbanBoard.PersistenceManagers;
using KanbanBoard.PersistenceManagers.Interfaces;
using KanbanBoard.Services.Interfaces;

namespace KanbanBoard.Services
{
    public class NotificationService : INotificationService
    {
        private readonly INotificationPersistenceManager notificationPersistenceManager = new NotificationPersistenceManager();
        private readonly IValidationService validationService = new ValidationService();
        
        public IEnumerable<Notification> GetAll()
        {
            return notificationPersistenceManager.LoadAll();
        }

        public Notification GetById(int id)
        {
            if (!validationService.ValidateId(id))
            {
                return null;
            }

            return notificationPersistenceManager.Load(id);
        }

        public Notification GetByUserId(int userId)
        {
            if (!validationService.ValidateId(userId))
            {
                return null;
            }

            return notificationPersistenceManager.LoadByUserId(userId);
        }

        public int Add(Notification notification)
        {
            return notificationPersistenceManager.Add(notification);
        }

        public bool Update(int id, Notification notification)
        {
            if (!validationService.ValidateId(id) || notificationPersistenceManager.Load(id) == null)
            {
                return false;
            }

            return notificationPersistenceManager.Update(notification) > 0;
        }
    }
}