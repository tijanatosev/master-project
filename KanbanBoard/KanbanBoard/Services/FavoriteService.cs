using System.Collections.Generic;
using KanbanBoard.Helpers;
using KanbanBoard.Models;
using KanbanBoard.PersistenceManagers;
using KanbanBoard.PersistenceManagers.Interfaces;
using KanbanBoard.Services.Interfaces;

namespace KanbanBoard.Services
{
    public class FavoriteService : IFavoriteService
    {
        private readonly IFavoritePersistenceManager favoritePersistenceManager = new FavoritePersistenceManager();
        private readonly IValidationService validationService = new ValidationService();
        
        public IEnumerable<Favorite> GetByUserId(int userId)
        {
            if (!validationService.ValidateId(userId))
            {
                return new List<Favorite>();
            }

            return favoritePersistenceManager.LoadByUserId(userId);
        }

        public bool IsFavorite(int ticketId, int userId)
        {
            if (!validationService.ValidateId(ticketId) || !validationService.ValidateId(userId))
            {
                return false;
            }

            return favoritePersistenceManager.Load(ticketId, userId) != null;
        }

        public int Add(Favorite favorite)
        {
            if (!validationService.ValidateId(favorite.TicketId) || !validationService.ValidateId(favorite.UserId))
            {
                return 0;
            }
            
            return favoritePersistenceManager.Add(favorite);
        }

        public void Delete(Favorite favorite)
        {
            favoritePersistenceManager.Delete(favorite);
        }
    }
}