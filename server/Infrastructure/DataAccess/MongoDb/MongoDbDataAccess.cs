using DataAccess.Abstractions;
using MongoDB.Bson;
using MongoDB.Driver;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;

namespace DataAccess.MongoDb
{
    public class MongoDbDataAccess : INoSqlDataAccess
    {
        private readonly string _collection;
        private readonly IConnectionFactory _connection;
        public MongoDbDataAccess(IConnectionFactory connection, string collection)
        {
            _connection = connection;
            _collection = collection;
        }
        public async Task Delete<T>(Expression<Func<T, bool>> expression, string collection = null) where T : class, new()
        {
            collection = collection ?? _collection;
            var _db = await _connection.GetConnection();
            await _db.GetCollection<T>(collection).DeleteManyAsync(expression);
        }

        public async Task DeleteAll<T>(string collection = null) where T : class, new()
        {
            collection = collection ?? _collection;
            var _db = await _connection.GetConnection();
            await _db.GetCollection<T>(collection).DeleteManyAsync(x => true);
        }

        public async Task<T> Single<T>(Expression<Func<T, bool>> expression, string collection = null) where T : class, new()
        {
            collection = collection ?? _collection;
            return (await All<T>(collection)).FirstOrDefault(expression);
        }
        public async Task<IQueryable<T>> Find<T>(Expression<Func<T, bool>> expression, string collection = null) where T : class, new()
        {
            collection = collection ?? _collection;
            return (await All<T>(collection)).Where(expression);
        }

        public async Task<IQueryable<T>> All<T>(string collection = null) where T : class, new()
        {
            collection = collection ?? _collection;
            var _db = await _connection.GetConnection();
            return _db.GetCollection<T>(collection).AsQueryable();
        }

        public async Task<IMongoCollection<T>> Collection<T>(string collection = null) where T : class, new()
        {
            collection = collection ?? _collection;
            var _db = await _connection.GetConnection();
            return _db.GetCollection<T>(collection);
        }

        public async Task<IQueryable<T>> All<T>(int page, int pageSize, string collection = null) where T : class, new()
        {
            collection = collection ?? _collection;
            return (await All<T>(collection)).Skip((page - 1) * pageSize).Take(pageSize);
        }

        public async Task Add<T>(T item, string collection = null) where T : class, new()
        {
            collection = collection ?? _collection;
            var _db = await _connection.GetConnection();
            await _db.GetCollection<T>(collection).InsertOneAsync(item);
        }

        public async Task AddRangeAsync<T>(IEnumerable<T> items, string collection = null) where T : class, new()
        {
            collection = collection ?? _collection;
            var _db = await _connection.GetConnection();
            await _db.GetCollection<T>(collection).InsertManyAsync(items);
        }

        public async Task Update<T>(T item, string[] updateProps, string collection = null) where T : class, new()
        {
            collection = collection ?? _collection;
            var _db = await _connection.GetConnection();
            var properties = item.GetType().GetProperties().ToDictionary(k => k.Name, v => v);
            var filter = new BsonDocument("_id", new BsonObjectId(ObjectId.Parse(properties["Id"].GetValue(item).ToString())));
            var updateDefinition = updateProps
                .Select(prop => Builders<T>.Update.Set(prop, properties[prop].GetValue(item))).ToList();

            await _db.GetCollection<T>(collection).UpdateOneAsync(filter, Builders<T>.Update.Combine(updateDefinition));
        }
    }
}
