using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Common.DataSets;

namespace Repository.Abstractions
{
    public interface IMessageRepository
    {
        /// <summary>
        /// Get messages between two users
        /// </summary>
        /// <param name="from"></param>
        /// <param name="to"></param>
        /// <param name="maxResults"></param>
        /// <param name="page"></param>
        /// <returns></returns>
        Task<IEnumerable<Message>> GetMessagesBetweenAsync(string to, string from, int maxResults, int page);


        /// <summary>
        /// Get all messages sent to a user
        /// </summary>
        /// <param name="to"></param>
        /// <returns></returns>
        Task<IQueryable<Message>> GetMessagesToAsync(string to);

        /// <summary>
        /// Get all messages sent from a user
        /// </summary>
        /// <param name="to"></param>
        /// <returns></returns>
        Task<IQueryable<Message>> GetMessagesFromAsync(string to);


        /// <summary>
        /// Add new message
        /// </summary>
        /// <param name="message"></param>
        /// <returns></returns>
        Task AddMessageAsync(Message message);

        /// <summary>
        /// Get all conversations to user
        /// </summary>
        /// <param name="userId"></param>
        /// <returns></returns>
        Task<IQueryable<IGrouping<string, Message>>> GetConversationsToUserAsync(string userId);
    }
}
