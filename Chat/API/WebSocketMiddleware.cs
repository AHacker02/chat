﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;

namespace API
{
    /// <summary>
    /// Middleware to add authorization for signalR since websockets pass token as query param
    /// </summary>
    public class WebSocketMiddleware
    {
        private readonly RequestDelegate _next;

        public WebSocketMiddleware(RequestDelegate next)
        {
            _next = next;
        }

        public async Task Invoke(HttpContext httpContext)
        {
            var request = httpContext.Request;

            if (request.Query.TryGetValue("access_token", out var accessToken))
            {
                request.Headers.Add("Authorization",$"Bearer {accessToken}");
            }

            await _next(httpContext);
        }
    }
}
