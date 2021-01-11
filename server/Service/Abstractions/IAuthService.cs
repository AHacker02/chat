using System;
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
    }
}
