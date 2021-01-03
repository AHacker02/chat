using System;
using System.Collections.Generic;
using System.Text;
using Autofac;
using DataAccess.Abstractions;
using DataAccess.MongoDb;
using Microsoft.Extensions.Configuration;
using Repository.Abstractions;

namespace Repository
{
    public class RepositoryModule:Module
    {
        private readonly IConfiguration _configuration;

        public RepositoryModule(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        protected override void Load(ContainerBuilder builder)
        {
            builder.Register<IUserRepository>(c =>
            {
                var connection = c.Resolve<IConnectionFactory>();
                var collection = _configuration["mongo:collection:user"];
                var db=new MongoDbDataAccess(connection,collection);
                return new UserRepository(db);
            });

            builder.Register<IMessageRepository>(c =>
            {
                var connection = c.Resolve<IConnectionFactory>();
                var collection = _configuration["mongo:collection:chat"];
                var db = new MongoDbDataAccess(connection, collection);
                return new MessageRepository(db);
            });
        }
    }
}
