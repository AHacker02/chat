using Autofac;
using BaseService;
using DataAccess.MongoDb;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Diagnostics.HealthChecks;
using Microsoft.OpenApi.Models;
using Repository;
using Service.Hubs;

namespace API
{
    public class Startup : AppStartupBase
    {
        public Startup(IConfiguration configuration, IWebHostEnvironment env) : base(env, configuration)
        {
        }


        public void ConfigureServices(IServiceCollection services)
        {
            //services.AddSignalR(options =>
            //{
            //    options.ClientTimeoutInterval=TimeSpan.FromSeconds(5);
            //});
            services.AddSignalR();
            services.AddHealthChecks()
                .AddMongoDb(mongodbConnectionString:Configuration["mongo:connectionString"],name:"mongo",failureStatus:HealthStatus.Unhealthy);
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
            app.UseHealthChecks("/healthcheck");

            base.ConfigureApplication(app, env);


            app.UseEndpoints(endpoints =>
            {
                endpoints.MapHub<ChatHub>("/chat");
            });

        }
    }
}
