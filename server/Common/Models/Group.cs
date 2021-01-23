using System.Collections.Generic;

namespace Common.Models
{
    public class Group
    {

        public string Name { get; set; }

        public IEnumerable<string> Users { get; set; }
    }
}
