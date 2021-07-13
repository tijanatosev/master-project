using System.Collections.Generic;
using KanbanBoard.Helpers;
using KanbanBoard.Models;
using KanbanBoard.PersistenceManagers;
using KanbanBoard.PersistenceManagers.Interfaces;
using KanbanBoard.Services.Interfaces;

namespace KanbanBoard.Services
{
    public class LabelService : ILabelService
    {
        private readonly ILabelPersistenceManager labelPersistenceManager = new LabelPersistenceManager();
        private readonly IValidationService validationService = new ValidationService();
        
        public IEnumerable<Label> GetAll()
        {
            return labelPersistenceManager.LoadAll();
        }

        public Label GetById(int id)
        {
            if (!validationService.ValidateId(id))
            {
                return null;
            }

            return labelPersistenceManager.Load(id);
        }

        public int Add(Label label)
        {
            return labelPersistenceManager.Add(label);
        }

        public bool Update(int id, Label label)
        {
            if (!validationService.ValidateId(id))
            {
                return false;
            }

            return labelPersistenceManager.Update(id, label) > 0;
        }

        public void Delete(int id)
        {
            if (!validationService.ValidateId(id))
            {
                return;
            }
            
            labelPersistenceManager.Delete(id);
        }

        public void DeleteAll()
        {
            labelPersistenceManager.DeleteAll();
        }

        public IEnumerable<Label> GetByTicketId(int ticketId)
        {
            if (!validationService.ValidateId(ticketId))
            {
                return new List<Label>();
            }

            return labelPersistenceManager.LoadByTicketId(ticketId);
        }

        public void DeleteByTicketId(int labelId, int ticketId)
        {
            if (!validationService.ValidateId(labelId) || !validationService.ValidateId(ticketId))
            {
                return;
            }
            
            labelPersistenceManager.DeleteByTicketId(labelId, ticketId);
        }

        public int AddByTicketId(Label label, int ticketId)
        {
            return labelPersistenceManager.AddByTicketId(label, ticketId);
        }

        public IEnumerable<Label> GetByBoardId(int boardId)
        {
            if (!validationService.ValidateId(boardId))
            {
                return new List<Label>();
            }

            return labelPersistenceManager.LoadByBoardId(boardId);
        }
    }
}