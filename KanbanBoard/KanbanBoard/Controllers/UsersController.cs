﻿using System.Collections.Generic;
using KanbanBoard.Models;
using KanbanBoard.Services;
using KanbanBoard.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace KanbanBoard.Controllers
{
    [Route("api/users")]
    public class UsersController : Controller
    {
        private IUserService userService = new UserService();

        [HttpGet]
        [Route("")]
        public IEnumerable<User> GetAll()
        {
            return userService.GetAll();
        }

        [HttpGet]
        [Route("{id}")]
        public User GetById([FromRoute] int id)
        {
            return userService.GetById(id);
        }

        [HttpGet]
        [Route("username/{username}")]
        public User GetByUsername([FromRoute] string username)
        {
            return userService.GetByUsername(username);
        }

        [HttpPost]
        [Route("")]
        public IActionResult Save([FromBody] User user)
        {
            if (!userService.Add(user))
            {
                return new NoContentResult();
            }
            
            return new StatusCodeResult(201);
        }

        [HttpDelete]
        [Route("{id}")]
        public void Delete([FromRoute] int id)
        {
            userService.Delete(id);
        }

        [HttpPost]
        [Route("authenticate/{username}")]
        public User Authenticate([FromRoute] string username, [FromBody] User user)
        {
            if (userService.GetByUsername(username) == null)
            {
                return null;
            }

            return userService.AuthenticateUser(user);
        }
    }
}