using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Autofac;
using BaseService;
using DataAccess.MongoDb;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.HttpsPolicy;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Microsoft.OpenApi.Models;
using Repository;
using Service.Hubs;

namespace API
{
    public class Startup:AppStartupBase
    {
        public Startup(IConfiguration configuration,IWebHostEnvironment env) : base(env,configuration)
        {
        }


        public void ConfigureServices(IServiceCollection services)
        {
            //services.AddSignalR(options =>
            //{
            //    options.ClientTimeoutInterval=TimeSpan.FromSeconds(5);
            //});
            services.AddSignalR();
            base.ConfigureApplicationServices(services, new OpenApiInfo
            {
                Version = "v1",
                Title = "Chat API",
                Description = "Chat API"
            });
        }

        public void ConfigureContainer(ContainerBuilder builder)
        {
            builder.RegisterModule(new MongoDbModule(Configuration));
            builder.RegisterModule(new RepositoryModule(Configuration));
            builder.RegisterModule(new ChatModule(Configuration));
        }

        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            app.Use(async (context, next) =>
            {
                var request = context.Request;

                if (request.Query.TryGetValue("access_token", out var accessToken))
                {
                    request.Headers.Add("Authorization", $"Bearer {accessToken}");
                }

                await next.Invoke();
            });
            
            base.ConfigureApplication(app, env);
            

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapHub<ChatHub>("/chat");
            });
            
        }
    }
}
