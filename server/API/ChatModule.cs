using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Autofac;
using DataAccess.Abstractions;
using DataAccess.MongoDb;
using Microsoft.Extensions.Configuration;
using Repository;
using Repository.Abstractions;
using Service;
using Service.Abstractions;

namespace API
{
    public class ChatModule:Module
    {
        private readonly IConfiguration _configuration;

        public ChatModule(IConfiguration configuration)
        {
            _configuration = configuration;
        }
        protected override void Load(ContainerBuilder builder)
        {
            builder.RegisterType<AuthService>().As<IAuthService>();
            builder.RegisterType<ChatService>().As<IChatService>();
        }
    }
}
