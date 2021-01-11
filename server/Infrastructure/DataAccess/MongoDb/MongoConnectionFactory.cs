using MongoDB.Driver;
using System;
using System.Threading.Tasks;
using MongoDB.Bson;
using IConnectionFactory = DataAccess.Abstractions.IConnectionFactory;

namespace DataAccess.MongoDb
{
    public class MongoConnectionFactory : IConnectionFactory
    {
        private static string _databaseName;
        private readonly IMongoClient _client;
        private static IMongoDatabase _database;

        public MongoConnectionFactory(string databaseName, IMongoClient client)
        {
            _client = client;
            _databaseName = databaseName;
        }

        public async Task<IMongoDatabase> GetConnection()
        {
            _database = _database ?? (_database = _client.GetDatabase(_databaseName));
            var isConnected = _database.RunCommandAsync((Command<BsonDocument>)"{ping:1}").Wait(5000);
            //var isConnected = true;
            if (isConnected)
            {
                return _database;
            }
            else
            {
                throw new Exception("Unable to connect to database");
            }
        }

    }
}
