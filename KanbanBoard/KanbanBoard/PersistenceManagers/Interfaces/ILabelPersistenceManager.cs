using System.Collections.Generic;
using KanbanBoard.Models;

namespace KanbanBoard.PersistenceManagers.Interfaces
{
    public interface ILabelPersistenceManager : IPersistenceManager<Label>
    {
        IEnumerable<Label> LoadAll();

        Label Load(int id);

        int Add(Label label);

        int Update(int id, Label label);

        void Delete(int id);

        void DeleteAll();
        
        IEnumerable<Label> LoadByTicketId(int ticketId);
        
        void DeleteByTicketId(int labelId, int ticketId);

        int AddByTicketId(Label label, int ticketId);
        
        IEnumerable<Label> LoadByBoardId(int boardId);
    }
}