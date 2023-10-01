/* eslint-disable react/prop-types */
import { VideoConference, useChat } from "@livekit/components-react";
import { Button, MenuItem, TextField, Box } from "@mui/material";
import { useRef } from "react";
import html2canvas from "html2canvas";
import axios from "axios";
import { useState, useEffect } from "react";

// const URL = "https://secondary-dot-hackrtcdumpling.uc.r.appspot.com";

// const URL = "http://localhost:3000";

const URL = "https://hackrtcdumpling.uc.r.appspot.com";

const Video = ({ userData }) => {
  const [items, setItems] = useState([]);
  const [currItem, setCurrItem] = useState("");
  const { send } = useChat();
  const canvasRef = useRef(null);

  useEffect(() => {
    if (items.length > 0) setCurrItem(items[0]);
  }, [items, setCurrItem]);

  const handleSubmit = async () => {
    const elementToCapture = document.getElementById("video");

    html2canvas(elementToCapture).then(async (canvas) => {
      const screenshot = canvas.toDataURL("image/png");

      // const data = await axios.post(`${URL}/getinformation`, {
      //   ImageBytesAsString: screenshot,
      // });

      const data = await axios.post(`${URL}/vision`, {
        imgStr: screenshot,
        roomName: userData.roomName,
        itemName: currItem,
        userToken: userData.userToken,
      });

      console.log(data.data);

      if (data.data.message) {
        // Toast User
      }

      await send("Updating Score");
      await Promise.all(
        data.data.room.users.map(async (user) => {
          await send(`${user.userName}: ${user.score}`);
        })
      );

      if (data.data.isWinner) {
        await send(`${userData.userName} has won the game!!`);
      }
    });
  };

  const handleSendList = async () => {
    const data = await axios.post(`${URL}/join`, userData);
    setItems(data.data.room.items);
    await send(
      `Find the following list of items: ${data.data.room.items.join(", ")}`
    );
  };

  return (
    <Box
      sx={{
        background: `linear-gradient(-45deg, #152238 0%, #080808 100%)`,
        height: "100vh",
      }}
    >
      <canvas
        ref={canvasRef}
        style={{ width: "100%", height: "100%", display: "none" }}
      />
      <VideoConference id="video" />
      <Box
        display={"flex"}
        alignItems={"center"}
        justifyContent={"center"}
        minWidth={"100%"}
        pb={"20px"}
      >
        <Button onClick={() => handleSendList()} variant="contained">
          Send List
        </Button>
        {items.length > 0 ? (
          <>
            <TextField
              select
              onChange={(e) => setCurrItem(e.target.value)}
              value={currItem}
              fullWidth
              size="small"
              sx={{
                maxWidth: "300px",
                marginLeft: "20px",
                marginRight: "20px",
              }}
            >
              {items.map((item) => (
                <MenuItem key={item} value={item}>
                  {item}
                </MenuItem>
              ))}
            </TextField>
            <Button onClick={() => handleSubmit()} variant="contained">
              Submit
            </Button>
          </>
        ) : (
          <div></div>
        )}
      </Box>
    </Box>
  );
};

export default Video;
