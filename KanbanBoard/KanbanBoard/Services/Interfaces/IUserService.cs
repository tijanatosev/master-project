using System.Collections.Generic;
using KanbanBoard.Models;

namespace KanbanBoard.Services
{
    public interface IUserService
    {
        IEnumerable<User> GetAll();
    }
}