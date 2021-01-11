﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Service.Abstractions;

namespace API.Controllers
{
    [Route("api/")]
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
        /// Search user with Name or Email
        /// </summary>
        /// <param name="userSearch"></param>
        /// <param name="maxResults"></param>
        /// <param name="page"></param>
        /// <returns></returns>
        [HttpGet("user/search")]
        public async Task<IActionResult> SearchContact(string userSearch,int maxResults=5,int page=0)
        {
            var users = await _chatService.SearchContactAsync(userSearch, maxResults, page);
            return Ok(users);
        }

        /// <summary>
        /// Get all messages from a user
        /// </summary>
        /// <param name="userId"></param>
        /// <param name="maxResults"></param>
        /// <param name="page"></param>
        /// <returns></returns>
        [HttpGet("chat/messages")]
        public async Task<IActionResult> GetMessages(string userId,int maxResults=20,int page=0)
        {
            var toUserId= User.FindFirst(ClaimTypes.NameIdentifier).Value;
            var messages = await _chatService.GetMessagesAsync(toUserId,userId, maxResults, page);
            return Ok(messages);
        }
    }
}