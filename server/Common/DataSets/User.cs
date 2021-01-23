using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System;

namespace Common.DataSets
{
    public class User
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; }
        public string Email { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Photo { get; set; }
        public byte[] Password { get; set; }
        public byte[] PasswordSalt { get; set; }
        public DateTime CreatedAt { get; set; }
        public string ClientId { get; set; }
        public string Status { get; set; }


    }
}
