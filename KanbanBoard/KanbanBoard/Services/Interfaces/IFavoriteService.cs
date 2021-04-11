using System.Collections.Generic;
using KanbanBoard.Models;

namespace KanbanBoard.Services.Interfaces
{
    public interface IFavoriteService
    {
        IEnumerable<Favorite> GetByUserId(int userId);

        bool IsFavorite(int ticketId, int userId);

        int Add(Favorite favorite);

        void Delete(int ticketId, int userId);
    }
}