using Common.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Service.Abstractions;
using System.Security.Claims;
using System.Threading.Tasks;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class ChatController : ControllerBase
    {
        private readonly IChatService _chatService;

        public ChatController(IChatService chatService)
        {
            _chatService = chatService;
        }


        /// <summary>
        /// Get all messages from a user
        /// </summary>
        /// <param name="threadId"></param>
        /// <param name="maxResults"></param>
        /// <param name="page"></param>
        /// <returns></returns>
        [HttpGet("messages")]
        public async Task<IActionResult> GetMessages(string threadId, int maxResults = 20, int page = 0)
        {
            var messages = await _chatService.GetMessagesAsync(threadId, maxResults, page);
            return Ok(messages);
        }

        /// <summary>
        /// Create group
        /// </summary>
        /// <param name="group"></param>
        /// <returns></returns>
        [HttpPost("create-group")]
        public async Task<IActionResult> CreateGroup(Group group)
        {
            var response = await _chatService.CreateGroupAsync(group);
            return Ok(response);
        }


        /// <summary>
        /// Add new user to group
        /// </summary>
        /// <param name="groupId"></param>
        /// <param name="userId"></param>
        /// <returns></returns>
        [HttpPut("add-group-user")]
        public async Task<IActionResult> AddUserToGroup(string groupId, string[] userId)
        {
            var response = await _chatService.AddUserToGroupAsync(groupId, userId);
            return Ok(response);
        }
    }
}
