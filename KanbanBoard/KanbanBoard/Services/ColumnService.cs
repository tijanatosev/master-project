﻿using System.Collections.Generic;
using KanbanBoard.Helpers;
using KanbanBoard.Models;
using KanbanBoard.PersistenceManagers;
using KanbanBoard.PersistenceManagers.Interfaces;
using KanbanBoard.Services.Interfaces;

namespace KanbanBoard.Services
{
    public class ColumnService : IColumnService
    {
        private readonly IColumnPersistenceManager columnPersistenceManager;
        private readonly IValidationService validationService;

        public ColumnService(ConnectionStringConfiguration connectionStringConfiguration)
        {
            columnPersistenceManager = new ColumnPersistenceManager(connectionStringConfiguration);
            validationService = new ValidationService();
        }

        public IEnumerable<Column> GetAll()
        {
            return columnPersistenceManager.LoadAll();
        }

        public IEnumerable<Column> GetByBoardId(int boardId)
        {
            if (!validationService.ValidateId(boardId))
            {
                return new List<Column>();
            }

            return columnPersistenceManager.LoadByBoardId(boardId);
        }

        public Column GetById(int id)
        {
            if (!validationService.ValidateId(id))
            {
                return null;
            }

            return columnPersistenceManager.Load(id);
        }

        public int Add(Column column)
        {
            return columnPersistenceManager.Add(column);
        }

        public void Delete(int id)
        {
            if (!validationService.ValidateId(id))
            {
                return;
            }
            
            columnPersistenceManager.Delete(id);
        }

        public bool Update(int id, Column column)
        {
            if (!validationService.ValidateId(id) || columnPersistenceManager.Load(id) == null)
            {
                return false;
            }

            return columnPersistenceManager.Update(id, column) > 0;
        }

        public bool UpdateColumnOrder(int id, int columnOrder)
        {
            if (!validationService.ValidateId(id) || columnPersistenceManager.Load(id) == null)
            {
                return false;
            }

            return columnPersistenceManager.UpdateColumnOrder(id, columnOrder) > 0;
        }

        public void DeleteByBoardId(int boardId)
        {
            if (!validationService.ValidateId(boardId))
            {
                return;
            }
            
            columnPersistenceManager.DeleteByBoardId(boardId);
        }

        public bool UpdateIsDone(int id, int boardId)
        {
            if (!validationService.ValidateId(id) || !validationService.ValidateId(boardId) || columnPersistenceManager.Load(id) == null)
            {
                return false;
            }
            
            return columnPersistenceManager.UpdateIsDone(id, boardId) > 0;
        }

        public Column GetDoneColumnForBoard(int boardId)
        {
            return columnPersistenceManager.GetDoneColumnForBoard(boardId);
        }
    }
}