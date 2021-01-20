using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Common;
using Common.DataSets;
using Common.Models;
using Microsoft.Extensions.Configuration;
using Repository.Abstractions;
using Service.Abstractions;

namespace Service
{
    public class AuthService:IAuthService
    {
        private readonly IUserRepository _userRepository;
        private readonly IConfiguration _configuration;
        private readonly IMapper _map;

        public AuthService(IUserRepository userRepository, IConfiguration configuration,IMapper map)
        {
            _userRepository = userRepository;
            _configuration = configuration;
            _map = map;
        }
        public async Task<Response<UserAuthToken>> LoginAsync(string email, string password)
        {
            var response=new Response<UserAuthToken>();

            //Get User if exists
            var user = await _userRepository.GetUserByEmailAsync(email);

            if (user == null)
            {
                response.Message = "Email does not exist. Please register if you are new";
            }
            else
            {
                //Check password
                response.IsSuccess = VerifyPasswordHash(password, user.Password, user.PasswordSalt);

                if (response.IsSuccess)
                {
                    //Return user details and auth token
                    response.Data = new UserAuthToken
                    {
                        Token = user.GenerateJwtToken(_configuration.GetSection("Token").Value),
                        User = _map.Map<UserViewModel>(user)
                    };
                }
                else
                {
                    response.Message = "Email or Password is incorrect";
                }
            }
            return response;
        }

        public async Task<Response> SignUpAsync(UserViewModel userData)
        {
            var response=new Response();

            //Check if email already used
            if (await _userRepository.UserExistsAsync(userData.Email))
            {
                response.Message = "Email already in use. Please login or use another email";
                return response;
            }

            //Encrypt Password
            var user = _map.Map<User>(userData);
            CreatePasswordHash(userData.Password, out byte[] passwordHash, out byte[] passwordSalt);
            user.Password = passwordHash;
            user.PasswordSalt = passwordSalt;
            user.CreatedAt=DateTime.UtcNow;

            //Add user
            await _userRepository.AddUserAsync(user);
            response.IsSuccess = true;
            return response;
        }

        public async Task<Response> CheckEmailAsync(string email)
        {
            
            var response = new Response {IsSuccess = true};
            var userExists = await _userRepository.UserExistsAsync(email);
            response.Message = userExists ? "Email already in use. Please login or use another email" : "Email does not exist. Please register if you are new";
            return response;
        }

        public async Task<Response<IEnumerable<UserViewModel>>> SearchContactAsync(string userSearch, int maxResults, int page)
        {
            var term = userSearch.Split().ToList();
            var users = (await _userRepository.GetAllUserAsync())
                .Where(u =>
                    u.Email.Contains(term[0])
                    || u.FirstName.Contains(term[0])
                    || u.LastName.Contains(term[0])
                    || (term.LastOrDefault() != null && u.LastName.Contains(term.LastOrDefault()))
                )
                .Skip(page * maxResults)
                .Take(maxResults);

            return new Response<IEnumerable<UserViewModel>>()
                { Data = _map.Map<IEnumerable<UserViewModel>>(users), IsSuccess = true };
        }


        private static bool VerifyPasswordHash(string password, byte[] passwordHash, byte[] passwordSalt)
        {
            using (var hmac = new System.Security.Cryptography.HMACSHA512(passwordSalt))
            {
                var computedHash = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(password));
                for (int i = 0; i < computedHash.Length; i++)
                {
                    if (computedHash[i] != passwordHash[i])
                        return false;
                }
            }

            return true;
        }
        private static void CreatePasswordHash(string password, out byte[] passwordHash, out byte[] passwordSalt)
        {
            using (var hmac = new System.Security.Cryptography.HMACSHA512())
            {
                passwordSalt = hmac.Key;
                passwordHash = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(password));
            }
        }
    }
}
