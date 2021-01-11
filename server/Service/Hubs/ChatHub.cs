using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Threading.Tasks;
using Common.DataSets;
using Common.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using MongoDB.Bson;
using Repository.Abstractions;

namespace Service.Hubs
{
    [Authorize]
    public class ChatHub:Hub
    {
        private readonly IUserRepository _userRepository;
        private readonly IMessageRepository _messageRepository;

        public ChatHub(IUserRepository userRepository,IMessageRepository messageRepository)
        {
            _userRepository = userRepository;
            _messageRepository = messageRepository;
        }

        /// <summary>
        /// Send Message to other Users
        /// </summary>
        /// <param name="userId"></param>
        /// <param name="clientId"></param>
        /// <param name="message"></param>
        /// <returns></returns>
        public async Task SendMessage(string userId,string clientId,string message)
        {
            var msg = new Message()
            {
                Id = ObjectId.GenerateNewId().ToString(),
                FromUserId = Context.UserIdentifier,
                ToUserId = userId,
                MessageText = message,
                SentAt = DateTime.UtcNow
            };
            if (clientId != null)
            {
                await Clients.Client(clientId).SendAsync("Message", msg)
                    .ConfigureAwait(false);
            }

            await _messageRepository.AddMessageAsync(msg).ConfigureAwait(false);
            await Clients.Caller.SendAsync("Message", msg).ConfigureAwait(false);
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
                user.ClientId = Context.ConnectionId;
                user.Status = "Online";
                await _userRepository.UpdateUserAsync(user,
                    new[] {"ClientId", "Status"}); //TODO: Update to redis on large scale

                
                var contactMessageGroup = (await _messageRepository.GetMessagesToAsync(userId)).GroupBy(g => g.FromUserId).ToList();
                contactMessageGroup.AddRange((await _messageRepository.GetMessagesFromAsync(userId)).GroupBy(g => g.ToUserId).ToList());
                var users = await _userRepository.GetAllUserAsync();

                var contacts = contactMessageGroup.Join(users, c => c.Key, u => u.Id,
                    (c, u) => new ContactsViewModel()
                    {
                        Id = u.Id,
                        ClientId = u.ClientId,
                        FirstName = u.FirstName,
                        LastName = u.LastName,
                        Email = u.Email,
                        Status = u.Status,
                        LastMessage = c.OrderByDescending(x => x.SentAt).FirstOrDefault()?.MessageText,
                        LastMessageTime = c.OrderByDescending(x => x.SentAt).DefaultIfEmpty(new Message()).First().SentAt,
                        PendingMessages = c.Count(x => !x.IsRead)
                    });

                //Notify contacts
                await Clients.Clients(
                        contacts
                            .Where(x => x.ClientId != null)
                            .Select(x => x.ClientId).ToList()
                    ).SendAsync("UserStatus", user)
                    .ConfigureAwait(false);

                //Send old chats to user
                await Clients.Caller.SendAsync("Chats", contacts).ConfigureAwait(false);
            
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
            user.ClientId = null;
            user.Status = DateTime.UtcNow.ToString(CultureInfo.InvariantCulture);
            await _userRepository.UpdateUserAsync(user, new[] { "ClientId", "Status" });  //TODO: Update to redis on large scale

            var messages = await _messageRepository.GetMessagesFromAsync(userId);
            var users = await _userRepository.GetAllUserAsync();

            var clientIds = (from m in messages
                join u in users
                    on m.ToUserId equals u.Id
                where u.ClientId != null
                select u.ClientId).ToList();

            //Notify Users
            await Clients.Clients(clientIds).SendAsync("UserStatus", user).ConfigureAwait(false);
            await base.OnDisconnectedAsync(exception);
        }
    }
}
