using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DumplingChaseDataStore
{
    public class User
    {
        public string Name { get; set; }
        public int Points { get; set; }
        public string Token { get; set; }
        public List<string> FoundItems { get; set; } = new();
    }
}
