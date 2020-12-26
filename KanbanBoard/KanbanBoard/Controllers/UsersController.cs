using System.Collections.Generic;
using System.Linq;
using KanbanBoard.Models;
using KanbanBoard.Services;
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
    }
}