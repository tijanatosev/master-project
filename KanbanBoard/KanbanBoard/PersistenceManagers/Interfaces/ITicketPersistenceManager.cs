using System;
using System.Collections.Generic;
using KanbanBoard.Models;

namespace KanbanBoard.PersistenceManagers.Interfaces
{
    public interface ITicketPersistenceManager : IPersistenceManager<Ticket>
    {
        IEnumerable<Ticket> LoadAll(string whereQuery);

        Ticket Load(int id);

        int Add(Ticket ticket);

        void Delete(int id);
        
        IEnumerable<Ticket> LoadByUserId(int userId);

        IEnumerable<Ticket> LoadByTeamId(int teamId);

        IEnumerable<Ticket> LoadByBoardId(int boardId);
        
        IEnumerable<Ticket> LoadByColumnId(int columnId, string whereQuery);

        int UpdateColumn(int id, Column column, bool removeFromDone);

        int UpdateRank(int id, int rank);
        
        int UpdateAssignedTo(int id, int userId);
        
        int UpdateStartDate(int id, DateTime startDate);
        
        int UpdateEndDate(int id, DateTime endDate);
        
        int UpdateStoryPoints(int id, int storyPoints);
        
        int UpdateTitle(int id, string title);
        
        int UpdateDescription(int id, string description);

        IEnumerable<Ticket> LoadFavoritesByUserId(int userId);

        int UpdatePriority(int id, int priority);
        
        int GetRankForColumn(int columnId, int boardId);

        IEnumerable<Ticket> GetDependency(int id);

        int AddDependency(int id, int dependencyId);

        void DeleteDependency(int id, int dependencyId);

        IEnumerable<int> GetCircularDependencies(int dependencyId);
    }
}