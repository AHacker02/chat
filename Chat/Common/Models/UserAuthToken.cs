using System;
using System.Collections.Generic;
using System.Text;

namespace Common.Models
{
    public class UserAuthToken
    {
        public string Token { get; set; }
        public UserViewModel User { get; set; }

    }
}
