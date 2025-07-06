import React from 'react';
import { AppBar, Toolbar, Typography, Button, IconButton, Box, InputBase, Menu, MenuItem } from '@mui/material';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import AccountCircle from '@mui/icons-material/AccountCircle';

const PRIMARY_COLOR = '#e87722';

const NavBar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [search, setSearch] = React.useState('');
  const isLoggedIn = Boolean(localStorage.getItem('jwt'));
  const username = localStorage.getItem('username');

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleLogout = () => {
    localStorage.removeItem('jwt');
    localStorage.removeItem('userRole');
    localStorage.removeItem('username');
    setAnchorEl(null);
    navigate('/login');
  };
  const handleOrders = () => {
    if (!isLoggedIn) {
      navigate('/login', { state: { from: '/orders' } });
    } else {
      navigate('/orders');
    }
  };
  const handleLogin = () => {
    navigate('/login');
  };
  const handleRegister = () => {
    navigate('/register');
  };
  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/products?search=${encodeURIComponent(search)}`);
  };

  return (
    <AppBar position="static" sx={{ background: '#fff', color: '#222', boxShadow: 1 }}>
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        {/* Logo and nav links */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography
            variant="h6"
            component={Link}
            to="/"
            sx={{ color: PRIMARY_COLOR, textDecoration: 'none', fontWeight: 'bold', fontSize: 24 }}
          >
            CHUYEN TACTICAL
          </Typography>
          <Button component={Link} to="/" sx={{ color: '#222', fontWeight: 500 }}>Home</Button>
          <Button component={Link} to="/products" sx={{ color: '#222', fontWeight: 500 }}>Products</Button>
          <Button onClick={handleOrders} sx={{ color: '#222', fontWeight: 500 }}>Orders</Button>
        </Box>
        {/* Search bar */}
        <Box component="form" onSubmit={handleSearch} sx={{ display: 'flex', alignItems: 'center', bgcolor: '#f5f5f5', borderRadius: 1, px: 1, mr: 2 }}>
          <InputBase
            placeholder="Search…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            sx={{ ml: 1, flex: 1 }}
          />
          <IconButton type="submit" sx={{ p: '6px', color: PRIMARY_COLOR }}>
            <SearchIcon />
          </IconButton>
        </Box>
        {/* Auth buttons or user menu */}
        <Box>
          {isLoggedIn ? (
            <>
              <IconButton onClick={handleMenu} color="inherit">
                <AccountCircle />
              </IconButton>
              <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
                <MenuItem disabled>{username || 'User'}</MenuItem>
                <MenuItem onClick={handleLogout}>Logout</MenuItem>
              </Menu>
            </>
          ) : (
            <>
              <Button onClick={handleLogin} sx={{ color: PRIMARY_COLOR, fontWeight: 600 }}>Login</Button>
              <Button onClick={handleRegister} sx={{ color: PRIMARY_COLOR, fontWeight: 600 }}>Register</Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default NavBar;
