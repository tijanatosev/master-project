using System.Collections.Generic;
using KanbanBoard.Models;

namespace KanbanBoard.Services.Interfaces
{
    public interface ITicketService
    {
        IEnumerable<Ticket> GetAll();
        
        Ticket GetById(int id);

        int Add(Ticket user);

        void Delete(int id);

        IEnumerable<Ticket> GetByUserId(int userId);

        IEnumerable<Ticket> GetByTeamId(int teamId);
    }
}