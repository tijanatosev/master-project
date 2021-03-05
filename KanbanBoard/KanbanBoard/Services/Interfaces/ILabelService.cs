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
    }
}