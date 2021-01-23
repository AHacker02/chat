using Common.DataSets;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using MongoDB.Bson;
using Repository.Abstractions;
using System;
using System.Globalization;
using System.Linq;
using System.Threading.Tasks;
using Common.Models;

namespace Service.Hubs
{
    [Authorize]
    public class ChatHub : Hub
    {
        private readonly IUserRepository _userRepository;
        private readonly IMessageRepository _messageRepository;

        public ChatHub(IUserRepository userRepository, IMessageRepository messageRepository)
        {
            _userRepository = userRepository;
            _messageRepository = messageRepository;
        }

        /// <summary>
        /// Actions to run when User connected to chat
        /// </summary>
        /// <returns></returns>
        public override async Task OnConnectedAsync()
        {

            var userId = Context.UserIdentifier;

            //Update user online status
            var user = await _userRepository.GetUserByIdAsync(userId);
            user.Status = "Online";
            user.ClientId = Context.ConnectionId;
            await _userRepository.UpdateUserAsync(user,
                new[] { "ClientId","Status" }).ConfigureAwait(false); //TODO: Update to redis on large scale

            var userThreads = await _messageRepository.GetAllUserThreadsAsync(userId);
            await Clients.Groups(userThreads.Select(x => x.Id).ToList())
                .SendAsync("UserStatus", user);

            foreach (var thread in userThreads)
            {
                await Groups.AddToGroupAsync(Context.ConnectionId, thread.Id);

            }

            //Send old chats to user
            await Clients.Caller.SendAsync("Chats", userThreads).ConfigureAwait(false);

            await base.OnConnectedAsync();
        }

        /// <summary>
        /// Clean up actions after user logged out
        /// </summary>
        /// <param name="exception"></param>
        /// <returns></returns>
        public override async Task OnDisconnectedAsync(Exception exception)
        {
            var userId = Context.UserIdentifier;

            //Update user online status
            var user = await _userRepository.GetUserByIdAsync(userId);
            user.Status = DateTime.UtcNow.ToString(CultureInfo.InvariantCulture);
            user.ClientId = null;
            await _userRepository.UpdateUserAsync(user, new[] {"ClientId", "Status" });  //TODO: Update to redis on large scale

            var userThreads = await _messageRepository.GetAllUserThreadsAsync(userId);
            await Clients.Groups(userThreads.Select(x => x.Id).ToList())
                .SendAsync("UserStatus", user);

            foreach (var thread in userThreads)
            {
                await Groups.RemoveFromGroupAsync(Context.ConnectionId, thread.Id);

            }
            //Notify Users
            await base.OnDisconnectedAsync(exception);
        }

        /// <summary>
        /// Send Message to other Users
        /// </summary>
        /// <param name="toUser"></param>
        /// <param name="message"></param>
        /// <returns></returns>
        public async Task SendMessage(string to, string message)
        {
            var thread = await _messageRepository.GetMessageThreadAsync(to);
            var sentAt = DateTime.UtcNow;
            var msg = new Message()
            {
                Id = ObjectId.GenerateNewId().ToString(),
                SentBy = Context.UserIdentifier,
                ThreadId = thread.Id,
                MessageText = message,
                SentAt = sentAt
            };
            await _messageRepository.AddMessageAsync(msg).ConfigureAwait(false);
            await Clients.Group(thread.Id).SendAsync("Message", msg).ConfigureAwait(false);
            
        }
    }
}
