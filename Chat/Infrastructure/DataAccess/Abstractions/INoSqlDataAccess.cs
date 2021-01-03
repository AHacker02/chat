using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;

namespace DataAccess.Abstractions
{
    public interface INoSqlDataAccess
    {
        Task Delete<T>(Expression<Func<T, bool>> expression, string collection = null) where T : class, new();
        Task DeleteAll<T>(string collection = null) where T : class, new();
        Task<T> Single<T>(Expression<Func<T, bool>> expression, string collection = null) where T : class, new();
        Task<IQueryable<T>> Find<T>(Expression<Func<T, bool>> expression, string collection = null) where T : class, new();
        Task<IQueryable<T>> All<T>(string collection = null) where T : class, new();
        Task<IQueryable<T>> All<T>(int page, int pageSize, string collection = null) where T : class, new();
        Task Add<T>(T item, string collection = null) where T : class, new();
        Task AddRangeAsync<T>(IEnumerable<T> items, string collection = null) where T : class, new();
        Task Update<T>(T item, string[] updateProps, string collection = null) where T : class, new();
    }

}
