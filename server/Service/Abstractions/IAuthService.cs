using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Common.Models;

namespace Service.Abstractions
{
    public interface IAuthService
    {
        /// <summary>
        /// Get Auth token and user details
        /// </summary>
        /// <param name="email"></param>
        /// <param name="password"></param>
        /// <returns></returns>
        Task<Response<UserAuthToken>> LoginAsync(string email, string password);

        /// <summary>
        /// Register new user
        /// </summary>
        /// <param name="userData"></param>
        /// <returns></returns>
        Task<Response> SignUpAsync(UserViewModel userData);

        /// <summary>
        /// Check if Email already in use
        /// </summary>
        /// <param name="email"></param>
        /// <returns></returns>
        Task<Response> CheckEmailAsync(string email);

        /// <summary>
        /// Search user by email or name
        /// </summary>
        /// <param name="userSearch"></param>
        /// <param name="maxResults"></param>
        /// <param name="page"></param>
        /// <returns></returns>
        Task<Response<IEnumerable<UserViewModel>>> SearchContactAsync(string userSearch, int maxResults, int page);
    }
}
