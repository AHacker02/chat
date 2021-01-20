using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using Common.DataSets;
using Common.Models;

namespace Service.Abstractions
{
    public interface IChatService
    {
        /// <summary>
        /// Get all messages between two users
        /// </summary>
        /// <param name="toUserId"></param>
        /// <param name="fromUserId"></param>
        /// <param name="maxResults"></param>
        /// <param name="page"></param>
        /// <returns></returns>
        Task<Response<IEnumerable<Message>>> GetMessagesAsync(string toUserId,string fromUserId, int maxResults, int page);

        /// <summary>
        /// Create group
        /// </summary>
        /// <param name="group"></param>
        /// <returns></returns>
        Task<Response> CreateGroupAsync(Group @group);

        /// <summary>
        /// Add users to group
        /// </summary>
        /// <param name="groupId"></param>
        /// <param name="userId"></param>
        /// <returns></returns>
        Task<Response> AddUserToGroupAsync(string groupId, string[] userId);
    }
}
