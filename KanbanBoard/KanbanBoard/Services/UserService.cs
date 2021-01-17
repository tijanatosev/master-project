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

        public int Add(User user)
        {
            user.Password = hashingManager.HashPassword(user.Password);
            return userPersistenceManager.Add(user);
        }

        public void Delete(int id)
        {
            if (!ValidateId(id) || userPersistenceManager.Load(id) == null)
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

        public bool Update(int id, User user)
        {
            if (!ValidateId(id) || userPersistenceManager.Load(id) == null)
            {
                return false;
            }

            return userPersistenceManager.Update(user) > 0;
        }

        public bool UpdatePassword(int id, User user)
        {
            if (!ValidateId(id) || userPersistenceManager.Load(id) == null)
            {
                return false;
            }

            string hashedPassword = hashingManager.HashPassword(user.Password);
            return userPersistenceManager.UpdatePassword(id, hashedPassword) > 0;
        }

        public bool CheckPassword(int id, string password)
        {
            User user = userPersistenceManager.Load(id);
            if (!ValidateId(id) || user == null)
            {
                return false;
            }

            string hashedPassword = hashingManager.HashPassword(password);
            return user.Password == hashedPassword;
        }

        private bool ValidateId(int id)
        {
            return id >= 0;
        }
    }
}