using Google.Cloud.Vision.V1;

using Microsoft.AspNetCore.Mvc;
using TestAPI;
using System.Text;
using static Google.Rpc.Context.AttributeContext.Types;
using TestAPI.Join;
using Microsoft.AspNetCore.WebUtilities;
using TestAPI.FoundItem;
using TestAPI.DataAccess;
using TestAPI.Models;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();




app.MapPost("/getInformation", async (FoundImageRequest request) =>
{
    if (request.ImageBytesAsString == null || request.ImageBytesAsString.Length == 0)
    {
        return Results.BadRequest("Byte array cannot be null or empty.");
    }

    RoomRepository repo = new RoomRepository();
    var room = await repo.GetRoom(request.RoomName);
    if (room == Room.Empty)
    {
        return Results.BadRequest($"Unable to find the room {request.RoomName}");
    }
    User? user = null;
    try
    {
        user = room.Users.First(u => u.Token == request.UserToken.ToLower());
    } catch (Exception ex)
    {
        if (ex is InvalidOperationException aex)
        {
            return Results.BadRequest($"Unable to find user");
        }
        return Results.BadRequest($"Finding User Error {ex.Message}");        
    }
    if (user.FoundItems.Any(i => i.ToLower() == request.ImageName.ToLower()))
    {
        return Results.BadRequest($"User {user.Name} has already found {request.ImageName}");
    }

    // Convert byte array to string(s) (This example assumes UTF-8 encoding).
    try
    {
        var bytes = Convert.FromBase64String(request.ImageBytesAsString);
        var response = Requester.IdentifyLabelsByByte(bytes);
        var serialized = System.Text.Json.JsonSerializer.Serialize(response);

        //Success update database
        user.FoundItems.Add(request.ImageName);
        var message = string.Empty;
        if (room.Items.All(i => i.ToLower() == request.ImageName.ToLower()))
        {
            message = $"{user.Name} IS THE WINNER";
        }
        await repo.UpdateRoom(room);
        FoundImageResponse resultResponse = new FoundImageResponse()
        {
            RoomName = room.RoomName,
            Users = room.Users,
            Items = room.Items,
            Message = message
        };
        return Results.Ok(resultResponse);
    }
    catch (Exception ex)
    {
        return Results.BadRequest("ZJ:Err:" + ex.Message + "||" + ex.InnerException);
    }
});


app.MapPost("/join", async (JoinRequest request) =>
{
    RoomRepository repo = new RoomRepository();
    var room = await repo.GetRoom(request.RoomName);
    if (room == Room.Empty)
    {
        //Create Room
        room = new Room();
        room.RoomName = request.RoomName;
        User user = new User();
        user.Name = request.UserName;
        user.Token = request.UserToken;
        user.Points = 0;
        room.Users.Add(user);
        //Get List of Items
        room.Items.Add("Can");
        room.Items.Add("Mouse");
        room.Items.Add("Waste container");
        var result = await repo.CreateRoom(room);
        if (!string.IsNullOrEmpty(result))
        {
            return Results.Conflict(result);
        }
        return Results.Ok(room);
    }
    var existUser = room.Users.FirstOrDefault(u => u.Token.ToLower() == request.UserToken.ToLower());
    if (existUser != null)
    {
        return Results.Conflict("Existing user exists");
    }
    existUser = new User()
    {
        Name = request.UserName,
        Token = request.UserToken
    };
    room.Users.Add(existUser);
    await repo.UpdateRoom(room);
    return Results.Ok(room);
});


app.Run();

internal record WeatherForecast(DateTime Date, int TemperatureC, string? Summary)
{
    public int TemperatureF => 32 + (int)(TemperatureC / 0.5556);
}