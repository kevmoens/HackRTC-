import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";

export const Header = () => {
  return (
    <Box
      sx={{
        flexGrow: 1,
      }}
    >
      <AppBar
        position="static"
        sx={{
          background: "linear-gradient(330deg, #7f5a83 0%, #0d324d 74%)",
        }}
      >
        <Toolbar variant="dense">
          <Typography
            variant="h4"
            component="div"
            sx={{ flexGrow: 1, textAlign: "center" }}
          >
            Hunt
          </Typography>
        </Toolbar>
      </AppBar>
    </Box>
  );
};
