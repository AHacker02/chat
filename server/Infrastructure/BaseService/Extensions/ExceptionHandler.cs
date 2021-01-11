using Microsoft.AspNetCore.Http;

namespace BaseService.Extensions
{
    public static class ExceptionHandler
    {
        public static void AddApplicationError(this HttpResponse response, string message)
        {
            try
            {
                response.Headers.Add("Application-Error", message);
            }
            catch
            {
                response.Headers.Add("Application-Error", "Exception");
            }

            response.Headers.Add("Access-Control-Expose-Headers", "Application-Error");
            response.Headers.Add("Access-Control-Allow-Origin", "*");
        }
    }
}
