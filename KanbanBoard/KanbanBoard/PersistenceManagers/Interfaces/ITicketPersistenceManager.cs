using System;
using System.Collections.Generic;
using KanbanBoard.Models;

namespace KanbanBoard.PersistenceManagers.Interfaces
{
    public interface ITicketPersistenceManager : IPersistenceManager<Ticket>
    {
        IEnumerable<Ticket> LoadAll();

        Ticket Load(int id);

        int Add(Ticket ticket);

        void Delete(int id);
        
        IEnumerable<Ticket> LoadByUserId(int userId);

        IEnumerable<Ticket> LoadByTeamId(int teamId);
        
        IEnumerable<Ticket> LoadByColumnId(int columnId);

        int UpdateColumn(int id, int columnId, string status);

        int UpdateRank(int id, int rank);
        
        int UpdateAssignedTo(int id, int userId);
        
        int UpdateStartDate(int id, DateTime startDate);
        
        int UpdateEndDate(int id, DateTime endDate);
        
        int UpdateStoryPoints(int id, int storyPoints);
    }
}