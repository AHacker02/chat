using System;
using System.Collections.Generic;
using System.Text;
using Newtonsoft.Json;

namespace Common.Models
{
    public class UserViewModel
    {
        public string Id { get; set; }
        public string Email { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Photo { get; set; }
        public string Password { get; set; }
        public string ClientId { get; set; }
        public string Status { get; set; }
    }
}
