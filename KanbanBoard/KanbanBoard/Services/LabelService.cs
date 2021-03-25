using System.Collections.Generic;
using KanbanBoard.Models;
using KanbanBoard.PersistenceManagers;
using KanbanBoard.PersistenceManagers.Interfaces;
using KanbanBoard.Services.Interfaces;

namespace KanbanBoard.Services
{
    public class LabelService : ILabelService
    {
        private readonly ILabelPersistenceManager labelPersistenceManager = new LabelPersistenceManager();
        
        public IEnumerable<Label> GetAll()
        {
            return labelPersistenceManager.LoadAll();
        }

        public Label GetById(int id)
        {
            if (!ValidateId(id))
            {
                return null;
            }

            return labelPersistenceManager.Load(id);
        }

        public int Add(Label label)
        {
            return labelPersistenceManager.Add(label);
        }

        public void Delete(int id)
        {
            if (!ValidateId(id))
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
            if (!ValidateId(ticketId))
            {
                return new List<Label>();
            }

            return labelPersistenceManager.LoadByTicketId(ticketId);
        }

        public void DeleteByTicketId(int labelId, int ticketId)
        {
            if (!ValidateId(labelId) || !ValidateId(ticketId))
            {
                return;
            }
            
            labelPersistenceManager.DeleteByTicketId(labelId, ticketId);
        }

        public int AddByTicketId(Label label, int ticketId)
        {
            return labelPersistenceManager.AddByTicketId(label, ticketId);
        }

        private bool ValidateId(int id)
        {
            return id > 0;
        }
    }
}