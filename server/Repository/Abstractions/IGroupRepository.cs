using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using Common.DataSets;
using Common.Models;

namespace Repository.Abstractions
{
    public interface IGroupRepository
    {
        /// <summary>
        /// Create new group
        /// </summary>
        /// <param name="group"></param>
        /// <returns></returns>
        Task CreateGroupAsync(Group group);

        /// <summary>
        /// Add user to group
        /// </summary>
        /// <param name="groupId"></param>
        /// <param name="userId"></param>
        /// <returns></returns>
        Task AddUserToGroupAsync(string groupId, string[] userId);

        /// <summary>
        /// Get list of groups user is in
        /// </summary>
        /// <param name="userId"></param>
        /// <returns></returns>
        Task<IEnumerable<Group>> GetUserGroupsAsync(string userId);

        /// <summary>
        /// Check if group
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        Task<bool> IsGroup(string id);


    }
}
