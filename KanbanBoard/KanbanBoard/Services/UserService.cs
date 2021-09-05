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
        private readonly IUserPersistenceManager userPersistenceManager;
        private readonly IHashingManager hashingManager;
        private readonly IValidationService validationService;

        public UserService(ConnectionStringConfiguration connectionStringConfiguration)
        {
            userPersistenceManager = new UserPersistenceManager(connectionStringConfiguration);
            validationService = new ValidationService();
            hashingManager = new HashingManager(userPersistenceManager);
        }

        public IEnumerable<User> GetAll()
        {
            return userPersistenceManager.LoadAll();
        }

        public User GetById(int id)
        {
            if (!validationService.ValidateId(id))
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
            (string password, string salt) = hashingManager.HashPassword(user.Password, 0);
            user.Password = password;
            return userPersistenceManager.Add(user, salt);
        }

        public void Delete(int id)
        {
            if (!validationService.ValidateId(id) || userPersistenceManager.Load(id) == null)
            {
                return;
            }

            userPersistenceManager.Delete(id);
        }

        public User AuthenticateUser(User user)
        {
            User dbUser = userPersistenceManager.Load(user.Username);
            (string password, string salt) = hashingManager.HashPassword(user.Password, dbUser.Id);
            if (!password.Equals(dbUser.Password))
            {
                return null;
            }
            
            dbUser.Password = String.Empty;
            return dbUser;
        }

        public bool Update(int id, User user)
        {
            if (!validationService.ValidateId(id) || userPersistenceManager.Load(id) == null)
            {
                return false;
            }

            return userPersistenceManager.Update(user) > 0;
        }

        public bool UpdatePassword(int id, User user)
        {
            if (!validationService.ValidateId(id) || userPersistenceManager.Load(id) == null)
            {
                return false;
            }

            (string password, string salt) = hashingManager.HashPassword(user.Password, user.Id);
            return userPersistenceManager.UpdatePassword(id, password) > 0;
        }

        public bool CheckPassword(int id, string password)
        {
            User user = userPersistenceManager.Load(id);
            if (!validationService.ValidateId(id) || user == null)
            {
                return false;
            }

            (string hashedPassword, string salt) = hashingManager.HashPassword(password, user.Id);
            return user.Password == hashedPassword;
        }

        public IEnumerable<User> GetUsersByTeamId(int teamId)
        {
            if (!validationService.ValidateId(teamId))
            {
                return new List<User>();
            }
            
            return userPersistenceManager.LoadByTeamId(teamId);
        }

        public bool UpdateImage(int id, string image)
        {
            if (!validationService.ValidateId(id))
            {
                return false;
            }

            return userPersistenceManager.UpdateImage(id, image) > 0;
        }
    }
}