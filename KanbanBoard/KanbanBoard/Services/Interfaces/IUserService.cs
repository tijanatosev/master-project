﻿using System.Collections.Generic;
using KanbanBoard.Models;

namespace KanbanBoard.Services
{
    public interface IUserService
    {
        IEnumerable<User> GetAll();
        
        User GetById(int id);

        User GetByUsername(string username);

        bool Add(User user);

        void Delete(int id);
    }
}