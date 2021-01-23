using Common.DataSets;
using Common.Models;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Repository.Abstractions
{
    public interface IMessageRepository
    {
        /// <summary>
        /// Get all messages of a thread
        /// </summary>
        /// <param name="from"></param>
        /// <param name="to"></param>
        /// <param name="maxResults"></param>
        /// <param name="page"></param>
        /// <returns></returns>
        Task<IEnumerable<Message>> GetThreadMessagesAsync(string threadId, int maxResults, int page);

        /// <summary>
        /// Get all user message threads with last message
        /// </summary>
        /// <param name="userId"></param>
        /// <returns></returns>
        Task<IQueryable<ContactsViewModel>> GetAllUserThreadsAsync(string userId);

        /// <summary>
        /// Add new message
        /// </summary>
        /// <param name="message"></param>
        /// <returns></returns>
        Task AddMessageAsync(Message message);

        /// <summary>
        /// Create new message thread
        /// </summary>
        /// <param name="thread"></param>
        /// <returns></returns>
        Task AddMessageThreadAsync(MessageThread thread);

        /// <summary>
        /// Find message thread by id
        /// </summary>
        /// <param name="threadId"></param>
        /// <returns></returns>
        Task<MessageThread> GetMessageThreadAsync(string threadId);

        /// <summary>
        /// Add users to group
        /// </summary>
        /// <param name="threadId"></param>
        /// <param name="userIds"></param>
        /// <returns></returns>
        Task AddUsersToGroupAsync(string threadId, string[] userIds);
    }
}
