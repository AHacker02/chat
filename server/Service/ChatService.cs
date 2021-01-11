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
using Service.Abstractions;

namespace Service
{
    public class ChatService : IChatService
    {
        private readonly IUserRepository _userRepository;
        private readonly IMessageRepository _messageRepository;
        private readonly IMapper _map;

        public ChatService(IUserRepository userRepository,IMessageRepository messageRepository,IMapper map)
        {
            _userRepository = userRepository;
            _messageRepository = messageRepository;
            _map = map;
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
                {Data = _map.Map<IEnumerable<UserViewModel>>(users), IsSuccess = true};
        }


        public async Task<Response<IEnumerable<Message>>> GetMessagesAsync(string toUserId, string fromUserId,
            int maxResults,
            int page)
            => new Response<IEnumerable<Message>>()
                {
                    Data = await _messageRepository.GetMessagesBetweenAsync(toUserId, fromUserId, maxResults, page),
                    IsSuccess = true
                };



    }
}
