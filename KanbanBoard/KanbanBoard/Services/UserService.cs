using System.Collections.Generic;
using KanbanBoard.Models;

namespace KanbanBoard.Services
{
    public class UserService : IUserService
    {
        private IUserPersistenceManager userPersistenceManager = new UserPersistenceManager();

        public IEnumerable<User> GetUsers()
        {
            return userPersistenceManager.GetUsers();
        }
    }
}