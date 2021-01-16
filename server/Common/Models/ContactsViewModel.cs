using System;
using System.Collections.Generic;
using System.Text;

namespace Common.Models
{
    public class ContactsViewModel:UserViewModel
    {
        public string LastMessage { get; set; }
        public DateTime? LastMessageTime { get; set; }
        public int PendingMessages { get; set; }
        public bool IsGroup { get; set; }
    }
}
