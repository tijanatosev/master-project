using System;
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
        
        IEnumerable<Ticket> GetByColumnId(int columnId);

        bool UpdateColumn(int id, int columnId);
        
        bool UpdateRank(int id, int rank);
        
        bool UpdateAssignedTo(int id, int userId);
        
        bool UpdateStartDate(int id, string startDate);
        
        bool UpdateEndDate(int id, string endDate);
        
        bool UpdateStoryPoints(int id, int storyPoints);
        
        bool UpdateTitle(int id, string title);
        
        bool UpdateDescription(int id, string description);
        
        IEnumerable<Ticket> GetFavoritesByUserId(int userId);

        bool UpdatePriority(int id, int priority);
    }
}