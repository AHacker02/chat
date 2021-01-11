using MongoDB.Driver;
using System.Threading.Tasks;

namespace DataAccess.Abstractions
{
    public interface IConnectionFactory
    {
        Task<IMongoDatabase> GetConnection();
    }
}
