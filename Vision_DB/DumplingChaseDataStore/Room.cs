namespace DumplingChaseDataStore
{
    public class Room
    {
        public string RoomName { get; set; }
        public List<User> Users { get; set; } = new();
        public List<string> Items { get; set; } = new();

        private static Room _emptyRoom = new Room();
        public static Room Empty
        {
            get
            {
                return _emptyRoom;
            }
        }
    }
}