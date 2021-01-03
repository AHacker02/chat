using AutoMapper;
using Common.DataSets;
using Common.Models;

namespace API
{
    public class ChatProfile:Profile
    {
        public ChatProfile()
        {
            CreateMap<User, UserViewModel>()
                .ForMember(x=>x.Password,opt=>opt.Ignore())
                .ReverseMap()
                .ForMember(m=>m.Password,opt=>opt.Ignore());

            CreateMap<ContactsViewModel, User>()
                .ReverseMap();
        }
    }
}
