import { Box, Button, Card, Grid, Typography, TextField } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useState } from "react";

export const Start = ({ getToken }) => {
  const theme = useTheme();
  const smBreak = useMediaQuery(theme.breakpoints.down("md"));
  const lgBreak = useMediaQuery(theme.breakpoints.down("lg"));
  const xlBreak = useMediaQuery(theme.breakpoints.up("xl"));

  const [name, setName] = useState("");

  return (
    <Box
      width={smBreak ? "85%" : lgBreak ? "85%" : xlBreak ? "60%" : "70%"}
      alignItems={"center"}
      justifyContent={"center"}
    >
      <Card
        variant="elevation"
        sx={{
          borderRadius: 3,
        }}
      >
        <Box
          p={xlBreak ? "50px" : "25px"}
          display={"flex"}
          alignItems={"center"}
          justifyContent={"center"}
          sx={{
            background: `linear-gradient(160deg, #1c2e4a 0%, #080808 100%)`,
          }}
        >
          <Grid
            container
            alignItems={"center"}
            justifyContent={"center"}
            display={"flex"}
            spacing={2}
          >
            <Grid
              item
              xs={12}
              alignItems={"center"}
              justifyContent={"center"}
              display={"flex"}
              textAlign={"center"}
            >
              <Typography variant="h3" color={"#90CAF9"}>
                Welcome!
              </Typography>
            </Grid>
            <Grid
              item
              xs={12}
              alignItems={"center"}
              justifyContent={"center"}
              display={"flex"}
            >
              <Typography variant="inherit" color={"GrayText"}>
                Please fill in the details
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                placeholder="John"
                label="Name"
                id="name"
                size={xlBreak ? "medium" : "small"}
                variant="filled"
                InputProps={{
                  disableUnderline: true,
                  sx: { borderRadius: 3 },
                }}
                type="text"
                onChange={(e) => setName(e.target.value)}
                value={name}
              />
            </Grid>
            <Grid
              item
              xs={12}
              alignItems={"center"}
              justifyContent={"center"}
              display={"flex"}
            >
              <Button
                variant="contained"
                sx={{
                  borderRadius: 3,
                  paddingLeft: "25px",
                  paddingRight: "25px",
                  width: lgBreak ? "40%" : "30%",
                }}
                type="submit"
                onClick={() => getToken(name, null)}
              >
                Start
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Card>
    </Box>
  );
};
