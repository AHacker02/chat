using System;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace Common.DataSets
{
    public class Message
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; }
        public string FromUserId { get; set; }
        public string ToUserId { get; set; }
        public string MessageText { get; set; }
        public DateTime SentAt { get; set; }
        public bool IsRead { get; set; }
    }
}
