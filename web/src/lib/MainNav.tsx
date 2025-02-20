import { useState } from "react";
import { AppBar, Toolbar, Typography, Button, IconButton, Drawer, List, ListItem, ListItemText, Box } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";

interface MainNavProps {
  items: Array<string>;
  sticky?: boolean;
}
const MainNav: React.FC<MainNavProps> = ({ sticky, items }) => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleNavItemClick = (item: string) => {
    console.log(`Navigating to ${item}`);
    setMobileOpen(false);
  };
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawer = (
    <List>
      {items.map((item, index) => (
        <ListItem component="button" key={index} onClick={() => handleNavItemClick(item)}>
          <ListItemText primary={item} />
        </ListItem>
      ))}
    </List>
  );

  return (
    <>
      <AppBar position={sticky ? "sticky" : "static"}>
        <Toolbar>
          {/* Mobile Menu Button */}
          <IconButton edge="start" color="inherit" aria-label="menu" sx={{ display: { md: "none" } }} onClick={handleDrawerToggle}>
            <MenuIcon />
          </IconButton>

          {/* Logo */}
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Video Engine
          </Typography>

          {/* Desktop Navigation */}
          <Box sx={{ display: { xs: "none", md: "flex" } }}>
            {items.map((item, index) => (
              <Button key={index} color="inherit" onClick={() => handleNavItemClick(item)}>
                {item}
              </Button>
            ))}
          </Box>
        </Toolbar>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer anchor="left" open={mobileOpen} onClose={handleDrawerToggle}>
        {drawer}
      </Drawer>
    </>
  );
};

export default MainNav;
