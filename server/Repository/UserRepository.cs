using System;
using System.Linq;
using System.Threading.Tasks;
using Common.DataSets;
using DataAccess.Abstractions;
using Repository.Abstractions;

namespace Repository
{
    public class UserRepository:IUserRepository
    {
        private readonly INoSqlDataAccess _database;

        public UserRepository(INoSqlDataAccess database)
        {
            _database = database;
        }

        public async Task<bool> UserExistsAsync(string email)
        => (await _database.All<User>()).Any(x => x.Email.Equals(email));


        public async Task<User> GetUserByEmailAsync(string email)
            => await _database.Single<User>(u => u.Email.Equals(email));

        public async Task<User> GetUserByIdAsync(string id)
            => await _database.Single<User>(u => u.Id==id);

        public async Task<IQueryable<User>> GetAllUserAsync()
            => await _database.All<User>();

        public async Task AddUserAsync(User user)
            => await _database.Add(user);

        public async Task UpdateUserAsync(User user, string[] toUpdate)
            => await _database.Update(user, toUpdate);



    }
}