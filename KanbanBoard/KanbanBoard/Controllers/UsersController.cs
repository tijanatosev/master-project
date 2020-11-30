using System.Collections.Generic;
using KanbanBoard.Models;
using KanbanBoard.Services;
using Microsoft.AspNetCore.Mvc;

namespace KanbanBoard.Controllers
{
    [ApiController]
    [Route("api/users")]
    public class UsersController : Controller
    {
        private IUserService userService = new UserService();

        [HttpGet]
        [Route("")]
        public IEnumerable<User> GetUsers()
        {
            return userService.GetUsers();
        }
    }
}