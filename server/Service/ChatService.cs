using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;
using Common.DataSets;
using Common.Models;
using Repository.Abstractions;
using Service.Abstractions;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.SignalR;
using Service.Abstractions;
using Service.Hubs;

namespace Service
{
    public class ChatService : IChatService
    {
        private readonly IUserRepository _userRepository;
        private readonly IMessageRepository _messageRepository;
        private readonly IMapper _map;

        private readonly IHubContext<ChatHub> _hubContext;
        private readonly IGroupRepository _groupRepository;

        public ChatService(IUserRepository userRepository, IMessageRepository messageRepository, IMapper map, IHubContext<ChatHub> hubContext, IGroupRepository groupRepository)
        {
            _userRepository = userRepository;
            _messageRepository = messageRepository;
            _map = map;
            _hubContext = hubContext;
            _groupRepository = groupRepository;
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


        public async Task<Response<IEnumerable<Message>>> GetMessagesAsync(string toUserId, string fromUserId,
            int maxResults,
            int page)
            => new Response<IEnumerable<Message>>()
            {
                Data = await _groupRepository.IsGroup(fromUserId).ConfigureAwait(false)?
                    await _messageRepository.GetMessagesToAsync(fromUserId).ConfigureAwait(false):
                    await _messageRepository.GetMessagesBetweenAsync(toUserId, fromUserId, maxResults, page),
                IsSuccess = true
            };

        public async Task<Response> CreateGroupAsync(Group @group)
        {
            await _groupRepository.CreateGroupAsync(group);
            foreach (var userId in group.Users)
            {
                var user = await _userRepository.GetUserByIdAsync(userId);
                if (user.ClientId != null)
                {
                    await _hubContext.Groups.AddToGroupAsync(user.ClientId, group.Id);
                }

            }

            return new Response(){IsSuccess = true,Message = "Group created"};
        }

        public async Task<Response> AddUserToGroupAsync(string groupId, string[] userId)
        {
            await _groupRepository.AddUserToGroupAsync(groupId, userId);

            foreach (var id in userId)
            {
                var user = await _userRepository.GetUserByIdAsync(id);
                if (user.ClientId != null)
                {
                    await _hubContext.Groups.AddToGroupAsync(user.ClientId, groupId);
                }
            }

            return new Response() { IsSuccess = true, Message = "Users added to group" };
        }
    }
}
