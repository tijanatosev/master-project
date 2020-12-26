using System.Collections.Generic;
using KanbanBoard.Models;

namespace KanbanBoard.Services
{
    public class UserService : IUserService
    {
        private IUserPersistenceManager userPersistenceManager = new UserPersistenceManager();

        public IEnumerable<User> GetAll()
        {
            return userPersistenceManager.LoadAll();
        }

        public User GetById(int id)
        {
            if (!ValidateId(id))
            {
                return null;
            }

            return userPersistenceManager.Load(id);
        }

        public User GetByUsername(string username)
        {
            return userPersistenceManager.Load(username);
        }

        public bool Add(User user)
        {
            return userPersistenceManager.Add(user) > 0;
        }

        public void Delete(int id)
        {
            if (!ValidateId(id))
            {
                return;
            }

            userPersistenceManager.Delete(id);
        }

        private bool ValidateId(int id)
        {
            return id >= 0;
        }
    }
}