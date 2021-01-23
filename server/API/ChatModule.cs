using Autofac;
using Microsoft.Extensions.Configuration;
using Service;
using Service.Abstractions;

namespace API
{
    public class ChatModule : Module
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
