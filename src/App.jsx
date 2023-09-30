import "@livekit/components-styles";
import { LiveKitRoom, VideoConference } from "@livekit/components-react";
import axios from "axios";
import { useState } from "react";
import { Header } from "./components/AppBar";
import { Start } from "./components/Start";
import { Grid, Box } from "@mui/material";
import { Join } from "./components/Join";

const serverUrl = import.meta.env.VITE_LIVEKIT_SERVER_URL;
const URL = "https://hackrtcdumpling.uc.r.appspot.com";

// const URL = "http://localhost:3000";

const App = () => {
  const [token, setToken] = useState(null);
  const [room, setRoom] = useState(null);

  const getToken = async (username, roomName) => {
    const data = await axios.get(
      `${URL}/token?username=${username}&room=${roomName}`
    );
    console.log(data.data);
    setToken(data.data.token);
    setRoom(data.data.roomName);
  };

  return (
    <>
      <Header />
      {token == null ? (
        <Grid
          container
          height={"100vh"}
          sx={{
            background: `linear-gradient(-45deg, #152238 0%, #080808 100%)`,
          }}
        >
          <Grid item xs={12} md={6}>
            <Box
              height={"100%"}
              // sx={{ background: "#080808" }}
              alignItems={"center"}
              justifyContent={"center"}
              display={"flex"}
            >
              <Start getToken={getToken} />
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box
              height={"100%"}
              alignItems={"center"}
              justifyContent={"center"}
              display={"flex"}
            >
              <Join getToken={getToken} />
            </Box>
          </Grid>
        </Grid>
      ) : (
        <>
          <p>{room}</p>
          <Grid
            container
            height={"100vh"}
            sx={{
              background: `linear-gradient(-45deg, #152238 0%, #080808 100%)`,
            }}
          >
            <Grid item xs={12} md={8}>
              <Box height={"100%"} display={"flex"}>
                <LiveKitRoom
                  video={true}
                  audio={true}
                  token={token}
                  connectOptions={{ autoSubscribe: true }}
                  serverUrl={serverUrl}
                  data-lk-theme="default"
                  style={{ height: "80vh" }}
                  onDisconnected={() => setToken(null)}
                >
                  <VideoConference />
                </LiveKitRoom>
              </Box>
            </Grid>
          </Grid>
        </>
      )}
    </>
  );
};

export default App;
