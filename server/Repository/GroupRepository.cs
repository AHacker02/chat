using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Common.DataSets;
using Common.Models;
using DataAccess.Abstractions;
using Repository.Abstractions;

namespace Repository
{
    public class GroupRepository:IGroupRepository
    {
        private readonly INoSqlDataAccess _database;

        public GroupRepository(INoSqlDataAccess database)
        {
            _database = database;
        }

        public async Task CreateGroupAsync(Group group)
            => await _database.Add(group);

        public async Task AddUserToGroupAsync(string groupId, string[] userId)
        {
            var group = (await _database.Single<Group>(g => g.Id == groupId));
            var users = group.Users.ToList();
            users.AddRange(userId);
            group.Users = users;
            await _database.Update(group, new[] {"Users"});
        }

        public async Task<IEnumerable<Group>> GetUserGroupsAsync(string userId)
            => await _database.Find<Group>(g => g.Users.Contains(userId));

        public async Task<bool> IsGroup(string id)
            => await _database.Single<Group>(x => x.Id == id) != null;
    }
}
