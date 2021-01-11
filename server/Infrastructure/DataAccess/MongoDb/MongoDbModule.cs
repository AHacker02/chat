using Autofac;
using DataAccess.Abstractions;
using Microsoft.Extensions.Configuration;
using MongoDB.Driver;

namespace DataAccess.MongoDb
{
    public class MongoDbModule : Module
    {
        private readonly IConfiguration _configuration;

        public MongoDbModule(IConfiguration configuration)
        {
            _configuration = configuration;
        }
        protected override void Load(ContainerBuilder builder)
        {
            builder.Register<IMongoClient>(c => new MongoClient(_configuration.GetSection("mongo").GetSection("connectionString").Value));
            builder.Register<IConnectionFactory>(c =>
            {
                var client = c.Resolve<IMongoClient>();
                return new MongoConnectionFactory(_configuration.GetSection("mongo").GetSection("database").Value, client);
            });
            builder.Register<INoSqlDataAccess>(c =>
            {
                var connection = c.Resolve<IConnectionFactory>();
                return new MongoDbDataAccess(connection, _configuration.GetSection("mongo").GetSection("collection").Value);
            });

        }
    }
}
