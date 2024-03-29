﻿using System.Collections.Generic;
using KanbanBoard.Helpers;
using KanbanBoard.Models;
using KanbanBoard.PersistenceManagers;
using KanbanBoard.Services.Interfaces;

namespace KanbanBoard.Services
{
    public class TeamService : ITeamService
    {
        private readonly TeamPersistenceManager teamPersistenceManager;
        private readonly IValidationService validationService;

        public TeamService(ConnectionStringConfiguration connectionStringConfiguration)
        {
            teamPersistenceManager = new TeamPersistenceManager(connectionStringConfiguration);
            validationService = new ValidationService();
        }

        public IEnumerable<Team> GetAll()
        {
            return teamPersistenceManager.LoadAll();
        }

        public Team GetById(int id)
        {
            if (!validationService.ValidateId(id))
            {
                return null;
            }

            return teamPersistenceManager.Load(id);
        }

        public int Add(Team team)
        {
            if (!ValidateTeamName(team.Name))
            {
                return 0;
            }

            return teamPersistenceManager.Add(team);
        }

        public void Delete(int id)
        {
            if (!validationService.ValidateId(id))
            {
                return;
            }
            
            teamPersistenceManager.Delete(id);
        }

        public IEnumerable<Team> GetTeamsByUserId(int userId)
        {
            if (!validationService.ValidateId(userId))
            {
                return null;
            }

            return teamPersistenceManager.LoadByUserId(userId);
        }

        public bool AddUsersToTeam(int teamId, List<int> userIds)
        {
            if (!validationService.ValidateId(teamId) || teamPersistenceManager.Load(teamId) == null || userIds.Count == 0)
            {
                return false;
            }

            return teamPersistenceManager.AddUsersToTeam(teamId, userIds) > 0;
        }

        private bool ValidateTeamName(string name)
        {
            if (teamPersistenceManager.LoadByName(name) != null)
            {
                return false;
            }

            return true;
        }
    }
}