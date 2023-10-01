using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TestAPI.FoundItem
{
    public class FoundImageRequest
    {
        public string RoomName { get; set; }
        public string UserToken { get; set; }
        public string ImageBytesAsString { get; set; }
        public string ImageName { get; set; }
    }
}
