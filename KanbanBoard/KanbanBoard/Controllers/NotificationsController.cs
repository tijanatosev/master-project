using System.Collections.Generic;
using KanbanBoard.Models;
using KanbanBoard.Services;
using KanbanBoard.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace KanbanBoard.Controllers
{
    [ApiController]
    [Route("api/notifications")]
    public class NotificationsController
    {
        private readonly INotificationService notificationService = new NotificationService();

        [HttpGet]
        [Route("")]
        public IEnumerable<Notification> GetAll()
        {
            return notificationService.GetAll();
        }

        [HttpGet]
        [Route("{id}")]
        public Notification GetById([FromRoute] int id)
        {
            return notificationService.GetById(id);
        }

        [HttpGet]
        [Route("user/{userId}")]
        public Notification GetByUserId([FromRoute] int userId)
        {
            return notificationService.GetByUserId(userId);
        }

        [HttpPost]
        [Route("")]
        public int Save([FromBody] Notification notification)
        {
            return notificationService.Add(notification);
        }

        [HttpPut]
        [Route("{id}")]
        public IActionResult Update([FromRoute] int id, [FromBody] Notification notification)
        {
            if (!notificationService.Update(id, notification))
            {
                return new NoContentResult();
            }
            
            return new StatusCodeResult(200);
        }
    }
}