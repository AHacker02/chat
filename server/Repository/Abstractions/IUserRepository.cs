using System;
using System.Linq;
using System.Threading.Tasks;
using Common.DataSets;

namespace Repository.Abstractions
{
    public interface IUserRepository
    {
        /// <summary>
        /// Add new user
        /// </summary>
        /// <param name="user"></param>
        /// <returns></returns>
        Task AddUserAsync(User user);

        /// <summary>
        /// Get user by email
        /// </summary>
        /// <param name="email"></param>
        /// <returns></returns>
        Task<User> GetUserByEmailAsync(string email);


        /// <summary>
        /// Get user by id
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        Task<User> GetUserByIdAsync(string id);


        /// <summary>
        /// Get all users
        /// </summary>
        /// <returns></returns>
        Task<IQueryable<User>> GetAllUserAsync();

        /// <summary>
        /// Check if email already in use
        /// </summary>
        /// <param name="email"></param>
        /// <returns></returns>
        Task<bool> UserExistsAsync(string email);


        /// <summary>
        /// Update user details
        /// </summary>
        /// <param name="user"></param>
        /// <param name="toUpdate"></param>
        /// <returns></returns>
        Task UpdateUserAsync(User user, string[] toUpdate);
    }
}
