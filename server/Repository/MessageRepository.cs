using Common.DataSets;
using Common.Models;
using DataAccess.Abstractions;
using Repository.Abstractions;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using MongoDB.Driver;

namespace Repository
{
    public class MessageRepository : IMessageRepository
    {
        private readonly INoSqlDataAccess _message;
        private readonly INoSqlDataAccess _thread;
        private readonly IUserRepository _userRepository;

        public MessageRepository(INoSqlDataAccess message, INoSqlDataAccess thread, IUserRepository userRepository)
        {
            _message = message;
            _thread = thread;
            _userRepository = userRepository;
        }

        public async Task<IEnumerable<Message>> GetThreadMessagesAsync(string threadId, int maxResults, int page)
            => (await _message
                .Find<Message>(m => m.ThreadId == threadId))
                .OrderByDescending(x => x.SentAt)
                .Skip(page * maxResults)
                .Take(maxResults)
                .ToList();

        public async Task<IQueryable<ContactsViewModel>> GetAllUserThreadsAsync(string userId)
        {
            var threads = new List<ContactsViewModel>();

            foreach (var thread in await _thread.Find<MessageThread>(x => x.Participants.Contains(userId)))
            {
                var lastMessage = (await _message.Collection<Message>()).Find(x => x.ThreadId == thread.Id)
                    .SortByDescending(x => x.SentAt).FirstOrDefault();
                if (thread.IsGroup)
                {
                    threads.Add(new ContactsViewModel
                    {
                        Id = thread.Id,
                        FirstName = thread.Name,
                        LastName = String.Empty,
                        LastMessage = lastMessage?.MessageText,
                        LastMessageTime = lastMessage?.SentAt
                    });
                }
                else
                {
                    var user = await _userRepository.GetUserByIdAsync(thread.Participants.FirstOrDefault(x => x != userId));
                    threads.Add(new ContactsViewModel()
                    {
                        Id = thread.Id,
                        FirstName = user.FirstName,
                        LastName = user.LastName,
                        Status = user.Status,
                        Email = user.Email,
                        LastMessage = lastMessage?.MessageText,
                        LastMessageTime = lastMessage?.SentAt
                    });
                }


            }


            return threads.AsQueryable();
        }

        public async Task AddMessageAsync(Message message)
            => await _message.Add(message);

        public async Task AddMessageThreadAsync(MessageThread thread)
            => await _thread.Add(thread);

        public async Task<MessageThread> GetMessageThreadAsync(string threadId)
            => await _thread.Single<MessageThread>(x => x.Id == threadId);

        public async Task AddUsersToGroupAsync(string threadId, string[] userIds)
        {
            var thread = await _thread.Single<MessageThread>(x => x.Id == threadId);
            var participant = thread.Participants.ToList();
            participant.AddRange(userIds);
            thread.Participants = participant;
            await _thread.Update(thread, new[] { "Participants" });
        }

    }
}
