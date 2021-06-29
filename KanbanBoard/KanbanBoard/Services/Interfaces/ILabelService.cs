using System.Collections.Generic;
using KanbanBoard.Models;

namespace KanbanBoard.Services.Interfaces
{
    public interface ILabelService
    {
        IEnumerable<Label> GetAll();

        Label GetById(int id);

        int Add(Label label);

        void Delete(int id);

        void DeleteAll();

        IEnumerable<Label> GetByTicketId(int ticketId);

        void DeleteByTicketId(int labelId, int ticketId);

        int AddByTicketId(Label label, int ticketId);

        IEnumerable<Label> GetByBoardId(int boardId);
    }
}