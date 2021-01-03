using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http.Formatting;
using System.Threading.Tasks;
using Common.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Service.Abstractions;

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
            => Ok(await _authService.SignUpAsync(userData));


        /// <summary>
        /// Check if Email already used
        /// </summary>
        /// <param name="email"></param>
        /// <returns></returns>
        [HttpGet("check-email")]
        public async Task<IActionResult> CheckEmail(string email)
            => Ok(await _authService.CheckEmailAsync(email));
    }
}
