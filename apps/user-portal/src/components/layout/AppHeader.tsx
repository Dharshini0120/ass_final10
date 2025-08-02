/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { useRouter } from "next/navigation";
import {
  AppBar,
  Toolbar,
  Button,
  Box,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import { Menu, X } from "lucide-react";

const AppHeader: React.FC = () => {
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleSignInClick = () => {
    router.push("/auth/signin");
  };

  const menuItems: any = [
    {
      name: "Home",
      path: "/home",
    },
    {
      name: "About",
      path: "/about",
    },
    {
      name: "Contact",
      path: "/contact",
    },
  ];

  const drawer = (
    <Box sx={{ width: 250, pt: 2 }}>
      <Box sx={{ display: "flex", justifyContent: "flex-end", px: 2, pb: 2 }}>
        <IconButton onClick={handleDrawerToggle}>
          <X size={24} />
        </IconButton>
      </Box>
      <List>
        {menuItems.map((item: any, index: number) => (
          <ListItem key={index} sx={{ py: 1.5 }}>
            <ListItemText
              primary={item.name}
              onClick={() => router.push(item.path)}
              sx={{
                "& .MuiTypography-root": {
                  fontWeight: item.name === "Home" ? 600 : 500,
                  color: item.name === "Home" ? "#3b82f6" : "#6b7280",
                },
              }}
            />
          </ListItem>
        ))}
        <ListItem sx={{ pt: 2 }}>
          <Button
            variant="contained"
            fullWidth
            onClick={handleSignInClick}
            sx={{
              backgroundColor: "#3b82f6",
              textTransform: "none",
              borderRadius: "8px",
              py: 1.5,
              "&:hover": {
                backgroundColor: "#2563eb",
              },
            }}
          >
            Sign In
          </Button>
        </ListItem>
      </List>
    </Box>
  );

  return (
    <>
      <AppBar
        position="sticky"
        sx={{
          backgroundColor: "white",
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
          padding: "10px 20px",
        }}
      >
        <Toolbar
          sx={{
            display: "flex",
            justifyContent: "space-around",
            gap: { xs: 25, lg: 40 },
            height: "64px", // or your desired height
            minHeight: "64px !important", // ensures MUI doesn't override
            padding: "0 20px", // keep only horizontal padding
          }}
        >
          <Box
            component="img"
            src="/medical-logo.png"
            alt="Company Logo"
            onError={(e) => {
              console.error("Failed to load medical-logo.png, trying fallback");
              e.currentTarget.src = "/Company-Logo.png";
            }}
            sx={{
              height: {
                xs: "20px",
                sm: "75px",
                md: "50px",
              },
              width: "auto",
              display: "block",
              objectFit: "contain",
            }}
          />

          {/* Desktop Menu */}
          <Box
            sx={{
              display: { xs: "none", md: "flex" },
              alignItems: "center",
              gap: "80px",
            }}
          >
            <Button
              sx={{
                color: "#3b82f6",
                textTransform: "none",
                fontWeight: 600,
                fontSize: "20px",
                textDecoration: "underline",
              }}
              onClick={() => router.push("/home")}
            >
              Home
            </Button>
            <Button
              sx={{
                color: "#000000",
                textTransform: "none",
                fontWeight: 300,
                fontSize: "20px",
              }}
              onClick={() => router.push("/about")}
            >
              About
            </Button>
            <Button
              sx={{
                color: "#000000",
                textTransform: "none",
                fontWeight: 300,
                fontSize: "20px",
              }}
              onClick={() => router.push("/contact")}
            >
              Contact
            </Button>

            <Button
              variant="contained"
              onClick={handleSignInClick}
              sx={{
                backgroundColor: "#3b82f6",
                textTransform: "none",
                borderRadius: "8px",
                px: 3,
                fontSize: "20px",
                "&:hover": {
                  backgroundColor: "#2563eb",
                },
              }}
            >
              Sign In
            </Button>
          </Box>

          {/* Mobile Menu Button */}
          <IconButton
            sx={{
              display: { xs: "block", md: "none" },
              color: "#1f2937",
              marginLeft: "auto",
              marginRight: "8px",
            }}
            onClick={handleDrawerToggle}
          >
            <Menu size={24} />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        anchor="right"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          display: { xs: "block", md: "none" },
          "& .MuiDrawer-paper": { boxSizing: "border-box", width: 250 },
        }}
      >
        {drawer}
      </Drawer>
    </>
  );
};

export default AppHeader;
