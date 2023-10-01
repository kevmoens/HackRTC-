using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TestAPI.Models
{
    public class User
    {
        public string Name { get; set; }
        public int Points { get; set; }
        public string Token { get; set; }
        public List<string> FoundItems { get; set; } = new();
    }
}
