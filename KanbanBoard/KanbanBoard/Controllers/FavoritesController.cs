using System.Collections.Generic;
using KanbanBoard.Models;
using KanbanBoard.Services;
using KanbanBoard.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace KanbanBoard.Controllers
{
    [ApiController]
    [Route("api/favorites")]
    public class FavoritesController
    {
        private readonly IFavoriteService favoriteService = new FavoriteService();

        [HttpGet]
        [Route("{userId}")]
        public IEnumerable<Favorite> GetByUserId([FromRoute] int userId)
        {
            return favoriteService.GetByUserId(userId);
        }

        [HttpGet]
        [Route("{ticketId}/user/{userId}")]
        public bool IsFavorite([FromRoute] int ticketId, [FromRoute] int userId)
        {
            return favoriteService.IsFavorite(ticketId, userId);
        }

        [HttpPost]
        [Route("")]
        public int Add([FromBody] Favorite favorite)
        {
            return favoriteService.Add(favorite);
        }

        [HttpDelete]
        [Route("")]
        public void Delete([FromBody] Favorite favorite)
        {
            favoriteService.Delete(favorite);
        }
    }
}