using Common.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Service.Abstractions;
using System.Threading.Tasks;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;

        public AuthController(IAuthService authService)
        {
            _authService = authService;
        }

        /// <summary>
        /// Login User
        /// </summary>
        /// <param name="email"></param>
        /// <param name="password"></param>
        /// <returns></returns>
        [HttpGet("login")]
        public async Task<IActionResult> Login(string email, string password)
        {
            var response = await _authService.LoginAsync(email, password);
            if (response.IsSuccess)
                return Ok(response);

            return Unauthorized(response);
        }


        /// <summary>
        /// Register new User
        /// </summary>
        /// <param name="userData"></param>
        /// <returns></returns>
        [HttpPost("register")]
        public async Task<IActionResult> SignUp(UserViewModel userData)
        {
            var response = await _authService.SignUpAsync(userData);

            if (response.IsSuccess)
            {
                return Created("", response);
            }

            return BadRequest(response);
        }


        /// <summary>
        /// Check if Email already used
        /// </summary>
        /// <param name="email"></param>
        /// <returns></returns>
        [HttpGet("check-email")]
        public async Task<IActionResult> CheckEmail(string email)
            => Ok(await _authService.CheckEmailAsync(email));

        /// <summary>
        /// Search user with Name or Email
        /// </summary>
        /// <param name="userSearch"></param>
        /// <param name="maxResults"></param>
        /// <param name="page"></param>
        /// <returns></returns>
        [Authorize]
        [HttpGet("search-user")]
        public async Task<IActionResult> SearchContact(string userSearch, int maxResults = 5, int page = 0)
        {
            var users = await _authService.SearchContactAsync(userSearch, maxResults, page);
            return Ok(users);
        }
    }
}
