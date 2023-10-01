using Amazon.DynamoDBv2;
using Amazon.DynamoDBv2.DocumentModel;
using Amazon.DynamoDBv2.Model;
using Amazon.Runtime.Documents;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TestAPI.Models;

namespace TestAPI.DataAccess
{
    /// <summary>
    /// This is using a repository pattern where we will use a dynamodb call to add a room as a new record
    /// </summary>

    public class RoomRepository
    {
        private string _accessKey = "AKIAY5IWSCZDKERL5PPM";
        private string _secretKey = "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";
        private string _table = "HackRTC";
        public RoomRepository()
        {
            AmazonDynamoDBClient client = new AmazonDynamoDBClient(_accessKey, _secretKey, Amazon.RegionEndpoint.USEast2);
        }
        public async Task<string> CreateRoom(Room room)
        {
            using var db = GetClient();
            var table = Table.LoadTable(db, _table);
            var json = JsonConvert.SerializeObject(room, Formatting.Indented);
            var item = Amazon.DynamoDBv2.DocumentModel.Document.FromJson(json);

            var request = new PutItemRequest
            {
                TableName = _table,
                Item = item.ToAttributeMap()
            };
            var response = await db.PutItemAsync(request);
            // Check if the response has any errors
            if (response.HttpStatusCode != System.Net.HttpStatusCode.OK)
            {
                return response.HttpStatusCode.ToString();
            }

            // Check if the response has any additional information
            if (response.ResponseMetadata != null)
            {
                return "";
            }

            // Print a confirmation message
            //Item added successfully!
            return string.Empty;
        }

        public async Task<Room> GetRoom(string roomName)
        {
            var db = GetClient();
            var table = Table.LoadTable(db, _table);

            GetItemOperationConfig config = new GetItemOperationConfig()
            {
                AttributesToGet = new List<string>() { "RoomName", "Users", "Items" }
            };

            var response = await table.GetItemAsync(roomName, config);
            if (response == null)
            {
                return Room.Empty;
            }
            string json = response.ToJson();
            if (json == null)
            {
                return Room.Empty;
            }
            var room = JsonConvert.DeserializeObject<Room>(json);
            if (room == null)
            {
                return Room.Empty;
            }
            return room;
        }
        public async Task<string> UpdateRoom(Room room)
        {
            await DeleteRoom(room);
            await CreateRoom(room);
            return string.Empty;
        }
        public async Task<string> DeleteRoom(Room room)
        {
            var db = GetClient();


            var request = new DeleteItemRequest
            {
                TableName = _table,
                Key = new Dictionary<string, AttributeValue>()
            {
                { "RoomName", new AttributeValue {
                      S = room.RoomName
                  } }
            },

                // Return the entire item as it appeared before the update.
                ReturnValues = "ALL_OLD",
                ExpressionAttributeNames = new Dictionary<string, string>()
            {
                {"#R", "RoomName"}
            },
                ExpressionAttributeValues = new Dictionary<string, AttributeValue>()
            {
                {":roomName",new AttributeValue {
                     S = room.RoomName
                 }}
            },
                ConditionExpression = "#R = :roomName"
            };

            var response = await db.DeleteItemAsync(request);
            //await CreateRoom(room);
            return string.Empty;
        }

        public static string RoomToJson(Room room)
        {

            return JsonConvert.SerializeObject(room, Formatting.Indented);
        }


        private AmazonDynamoDBClient GetClient()
        {
            return new AmazonDynamoDBClient(_accessKey, _secretKey, Amazon.RegionEndpoint.USEast2);
        }
    }
}
