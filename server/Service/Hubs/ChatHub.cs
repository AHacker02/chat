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
        private readonly IGroupRepository _groupRepository;

        public ChatHub(IUserRepository userRepository,IMessageRepository messageRepository,IGroupRepository groupRepository)
        {
            _userRepository = userRepository;
            _messageRepository = messageRepository;
            _groupRepository = groupRepository;
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
                    new[] {"ClientId", "Status"}).ConfigureAwait(false); //TODO: Update to redis on large scale

                var contacts = (await NotifyUserStatus(user).ConfigureAwait(false)).ToList();
                contacts.AddRange(await AddGroups(user).ConfigureAwait(false));
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

            var contacts = await NotifyUserStatus(user).ConfigureAwait(false);
            await RemoveFromGroups(user).ConfigureAwait(false);
            //Notify Users
            await base.OnDisconnectedAsync(exception);
        }

        /// <summary>
        /// Send Message to other Users
        /// </summary>
        /// <param name="userId"></param>
        /// <param name="clientId"></param>
        /// <param name="message"></param>
        /// <returns></returns>
        public async Task SendMessage(string userId, string clientId, string message)
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
            else if (await _groupRepository.IsGroup(userId))
            {
                await Clients.GroupExcept(userId, new[] {Context.ConnectionId}).SendAsync("Message", msg);
            }

            await _messageRepository.AddMessageAsync(msg).ConfigureAwait(false);
            await Clients.Caller.SendAsync("Message", msg).ConfigureAwait(false);
        }


        /// <summary>
        /// Add user to groups
        /// </summary>
        /// <param name="group"></param>
        /// <returns></returns>
        private async Task<IEnumerable<ContactsViewModel>> AddGroups(User user)
        {
            var groups = await _groupRepository.GetUserGroupsAsync(user.Id);
            var groupContact=new List<ContactsViewModel>();
            foreach (var group in groups)
            {
                var message = (await _messageRepository.GetMessagesToAsync(group.Id)).OrderByDescending(m=>m.SentAt).FirstOrDefault();
                groupContact.Add(new ContactsViewModel()
                {
                    Id = group.Id,
                    FirstName = group.Name,
                    LastName = String.Empty,
                    LastMessage = message?.MessageText,
                    LastMessageTime = message?.SentAt
                });
                await Groups.AddToGroupAsync(Context.ConnectionId, group.Id);
            }

            return groupContact;
        }

        /// <summary>
        /// Remove user from groups
        /// </summary>
        /// <param name="group"></param>
        /// <returns></returns>
        private async Task RemoveFromGroups(User user)
        {
            var groups = await _groupRepository.GetUserGroupsAsync(user.Id);

            foreach (var group in groups)
            {
                await Groups.RemoveFromGroupAsync(Context.ConnectionId, group.Id);
            }
        }

        /// <summary>
        /// Notify all online contacts of user status
        /// </summary>
        /// <param name="user"></param>
        /// <returns></returns>
        private async Task<IEnumerable<ContactsViewModel>> NotifyUserStatus(User user )
        {
            var lastMessage = (await _messageRepository.GetConversationsToUserAsync(user.Id)).ToList();
            var users = (await _userRepository.GetAllUserAsync()).ToList();

            var contacts = lastMessage.Join(users, c => c.Key, u => u.Id,
                (c, u) => new ContactsViewModel()
                {
                    Id = u.Id,
                    ClientId = u.ClientId,
                    FirstName = u.FirstName,
                    LastName = u.LastName,
                    Email = u.Email,
                    Status = u.Status,
                    LastMessage = c.OrderByDescending(x => x.SentAt).First().MessageText,
                    LastMessageTime = c.OrderByDescending(x => x.SentAt).First().SentAt,
                    PendingMessages = c.Count(x => !x.IsRead),
                    IsGroup = true
                });

            //Notify contacts
            await Clients.Clients(
                    contacts
                        .Where(x => x.ClientId != null)
                        .Select(x => x.ClientId).ToList()
                ).SendAsync("UserStatus", user)
                .ConfigureAwait(false);

            return contacts;
        }
    }
}
