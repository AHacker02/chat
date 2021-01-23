using Common.DataSets;
using Common.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Service.Abstractions
{
    public interface IChatService
    {
        /// <summary>
        /// Get all messages between two users
        /// </summary>
        /// <param name="threadId"></param>
        /// <param name="maxResults"></param>
        /// <param name="page"></param>
        /// <returns></returns>
        Task<Response<IEnumerable<Message>>> GetMessagesAsync(string threadId, int maxResults, int page);

        /// <summary>
        /// Create group
        /// </summary>
        /// <param name="group"></param>
        /// <returns></returns>
        Task<Response<MessageThread>> CreateGroupAsync(Group @group);

        /// <summary>
        /// Add users to group
        /// </summary>
        /// <param name="threadId"></param>
        /// <param name="userIds"></param>
        /// <returns></returns>
        Task<Response> AddUserToGroupAsync(string threadId, string[] userIds);

        Task AddUserToWelcomeGroup(string userId);
    }
}
