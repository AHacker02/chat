namespace Common.Models
{
    public class Response
    {
        public bool IsSuccess { get; set; }
        public string Message { get; set; }
    }
    public class Response<T> : Response where T : class
    {
        public T Data { get; set; }
    }
}
