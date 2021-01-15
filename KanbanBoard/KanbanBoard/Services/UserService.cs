using System;
using System.Collections.Generic;
using KanbanBoard.Helpers;
using KanbanBoard.Models;
using KanbanBoard.PersistenceManagers;
using KanbanBoard.PersistenceManagers.Interfaces;
using KanbanBoard.Services.Interfaces;

namespace KanbanBoard.Services
{
    public class UserService : IUserService
    {
        private readonly IUserPersistenceManager userPersistenceManager = new UserPersistenceManager();
        private readonly IHashingManager hashingManager = new HashingManager();

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

            User user = userPersistenceManager.Load(id);
            if (user != null)
            {
                user.Password = String.Empty;
            }
            
            return user;
        }

        public User GetByUsername(string username)
        {
            User user = userPersistenceManager.Load(username);
            if (user != null)
            {
                user.Password = String.Empty;
            }
            
            return user;
        }

        public bool Add(User user)
        {
            user.Password = hashingManager.HashPassword(user.Password);
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

        public User AuthenticateUser(User user)
        {
            User dbUser = userPersistenceManager.Load(user.Username);
            string hashedPassword = hashingManager.HashPassword(user.Password);
            if (!hashedPassword.Equals(dbUser.Password))
            {
                return null;
            }
            
            dbUser.Password = String.Empty;
            return dbUser;
        }

        private bool ValidateId(int id)
        {
            return id >= 0;
        }
    }
}