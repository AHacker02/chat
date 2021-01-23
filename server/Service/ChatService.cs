using System;
using AutoMapper;
using Common.DataSets;
using Common.Models;
using Microsoft.AspNetCore.SignalR;
using MongoDB.Bson;
using Repository.Abstractions;
using Service.Abstractions;
using Service.Hubs;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;

namespace Service
{
    public class ChatService : IChatService
    {
        private readonly IUserRepository _userRepository;
        private readonly IMessageRepository _messageRepository;
        private readonly IMapper _map;

        private readonly IHubContext<ChatHub> _hubContext;
        private readonly IHttpContextAccessor _context;

        public ChatService(IUserRepository userRepository, IMessageRepository messageRepository, IMapper map, IHubContext<ChatHub> hubContext, IHttpContextAccessor context )
        {
            _userRepository = userRepository;
            _messageRepository = messageRepository;
            _map = map;
            _hubContext = hubContext;
            _context = context;
        }

        public async Task<Response<IEnumerable<Message>>> GetMessagesAsync(string threadId,
            int maxResults,
            int page)
            => new Response<IEnumerable<Message>>()
            {
                Data = await _messageRepository.GetThreadMessagesAsync(threadId, maxResults, page),
                IsSuccess = true
            };

        public async Task<Response<MessageThread>> CreateGroupAsync(Group @group)
        {
            var isGroup = group.Users.Count() > 2;
            var thread = new MessageThread()
            {
                Id = ObjectId.GenerateNewId().ToString(),
                Name = group.Name,
                Participants = group.Users,
                IsGroup = isGroup
            };
            await _messageRepository.AddMessageThreadAsync(thread);
            var creator =
                await _userRepository.GetUserByIdAsync(_context.HttpContext.User.FindFirst(ClaimTypes.NameIdentifier)
                    .Value);
            foreach (var userId in group.Users)
            {
                User user =userId==creator.Id?creator: await _userRepository.GetUserByIdAsync(userId);
                if (user.ClientId != null)
                {
                    await _hubContext.Groups.AddToGroupAsync(user.ClientId, thread.Id);
                    if (isGroup)
                    {
                        await _hubContext.Clients.Client(user.ClientId).SendAsync("Chats", new[]
                        {
                            new ContactsViewModel
                            {
                                Id = thread.Id,
                                FirstName = thread.Name,
                                LastName = String.Empty
                            }
                        });
                    }
                    else if(user.Id!=creator.Id)
                    {
                        await _hubContext.Clients.Client(user.ClientId).SendAsync("Chats", new[]
                        {
                            new ContactsViewModel
                            {
                                Id = thread.Id,
                                FirstName = creator.FirstName,
                                LastName = creator.LastName,
                                Status = creator.Status,
                            }
                        });
                    }
                }

            }

            return new Response<MessageThread>() { IsSuccess = true, Data=thread,Message = "Group created" };
        }

        public async Task<Response> AddUserToGroupAsync(string threadId, string[] userIds)
        {
            await _messageRepository.AddUsersToGroupAsync(threadId, userIds);
            var thread = await _messageRepository.GetMessageThreadAsync(threadId);
            if (thread != null)
            {

                foreach (var id in userIds)
                {
                    var user = await _userRepository.GetUserByIdAsync(id);
                    if (user.ClientId != null)
                    {
                        await _hubContext.Groups.AddToGroupAsync(user.ClientId, threadId);
                        await _hubContext.Clients.Client(user.ClientId).SendAsync("Chats", new[]
                        {
                            new ContactsViewModel
                            {
                                Id = thread.Id,
                                FirstName = thread.Name,
                                LastName = String.Empty
                            }
                        });
                    }
                }

                return new Response() {IsSuccess = true, Message = "Users added to group"};
            }
            else
            {
                return new Response(){IsSuccess = false,Message = "Thread does not exist"};
            }
        }

        public async Task AddUserToWelcomeGroup(string userId)
        {
            var thread = new MessageThread() {Id= "600c4a056e285d14b1a714a0",Name = "Welcome",IsGroup = true,Participants = new List<string>()};
            if (await _messageRepository.GetMessageThreadAsync(thread.Id) == null)
            {
                var message = new Message()
                {
                    Id = ObjectId.GenerateNewId().ToString(),
                    SentAt = DateTime.UtcNow,
                    ThreadId = thread.Id,
                    MessageText = @"Hi,
This is a imessage-clone built using SignalR, React and Redux.
If you like it feel free to click on the star in github and drop me a message.

Thanks and Regards,
Arghya Ghosh",
                };
                await _messageRepository.AddMessageThreadAsync(thread);
                await _messageRepository.AddMessageAsync(message);
            }

            await _messageRepository.AddUsersToGroupAsync(thread.Id, new[] {userId});

        }
    }
}
