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
        /// Search user by email or name
        /// </summary>
        /// <param name="userSearch"></param>
        /// <param name="maxResults"></param>
        /// <param name="page"></param>
        /// <returns></returns>
        Task<Response<IEnumerable<UserViewModel>>> SearchContactAsync(string userSearch, int maxResults, int page);


        /// <summary>
        /// Get all messages between two users
        /// </summary>
        /// <param name="toUserId"></param>
        /// <param name="fromUserId"></param>
        /// <param name="maxResults"></param>
        /// <param name="page"></param>
        /// <returns></returns>
        Task<Response<IEnumerable<Message>>> GetMessagesAsync(string toUserId,string fromUserId, int maxResults, int page);
    }
}
