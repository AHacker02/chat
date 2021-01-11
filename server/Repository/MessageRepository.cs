using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Common.DataSets;
using DataAccess.Abstractions;
using Repository.Abstractions;

namespace Repository
{
    public class MessageRepository:IMessageRepository
    {
        private readonly INoSqlDataAccess _database;

        public MessageRepository(INoSqlDataAccess database)
        {
            _database = database;
        }

        public async Task<IEnumerable<Message>> GetMessagesBetweenAsync(string to, string from,int maxResults,int page)
            => (await _database
                .Find<Message>(m => (m.ToUserId == to && m.FromUserId == from) || (m.ToUserId==from && m.FromUserId==to)))
                .Skip(page*maxResults)
                .Take(maxResults)
                .ToList();

        public async Task<IQueryable<Message>> GetMessagesToAsync(string to)
            => await _database.Find<Message>(m => m.ToUserId == to);

        public async Task<IQueryable<Message>> GetMessagesFromAsync(string to)
            => await _database.Find<Message>(m => m.FromUserId == to);

        public async Task AddMessageAsync(Message message)
            => await _database.Add(message);
    }
}
