using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Common.DataSets;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Service.Abstractions;
using Service.Hubs;

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
        /// <param name="userId"></param>
        /// <param name="maxResults"></param>
        /// <param name="page"></param>
        /// <returns></returns>
        [HttpGet("messages")]
        public async Task<IActionResult> GetMessages(string userId,int maxResults=20,int page=0)
        {
            var toUserId= User.FindFirst(ClaimTypes.NameIdentifier).Value;
            var messages = await _chatService.GetMessagesAsync(toUserId,userId, maxResults, page);
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
            var response=await _chatService.AddUserToGroupAsync(groupId, userId);
            return Ok(response);
        }
    }
}
