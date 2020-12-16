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
    }
}