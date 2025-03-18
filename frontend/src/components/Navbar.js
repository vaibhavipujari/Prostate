import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { auth } from "../config/firebaseConfig";
import { Menu as MenuIcon, AccountCircle, ExpandMore } from '@mui/icons-material';
import { IconButton, Menu, MenuItem } from '@mui/material';

const Navbar = ({ onLoginClick }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(!!auth.currentUser);
  const [user, setUser] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setIsUserLoggedIn(!!currentUser);
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = () => {
    auth.signOut();
    setAnchorEl(null);
  };

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Features", href: "/#features" },
    { name: "Services", href: "/#services" },
    { name: "Collaboration", href: "/#collaboration" },
    { name: "About", href: "/#about" },
  ];

  return (
    <nav className="bg-white bg-opacity-70 backdrop-blur-lg fixed w-full z-50">
      <div className="max-w-7xl mx-auto px-4 flex justify-between items-center h-16">

        <Link to="/" className="text-2xl font-bold text-green-600">
          ProCare
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8">
          <NavigationLinks navLinks={navLinks} />
          {isUserLoggedIn ? (
            <ProfileDropdown
              user={user}
              anchorEl={anchorEl}
              setAnchorEl={setAnchorEl}
              onLogout={handleLogout}
            />
          ) : (
            <GuestActions onLoginClick={onLoginClick} />
          )}
        </div>

        {/* Mobile View */}
        <div className="md:hidden flex items-center space-x-4">
          {!isUserLoggedIn && (
            <>
              <button
                onClick={onLoginClick}
                className="text-green-600 hover:text-green-700 rounded-full"
              >
                Sign In
              </button>
              <Link
                to="/signup"
              >
                <button
                className="text-green-600 hover:text-green-700 rounded-full"
              >
                Sign Up
              </button>
              </Link>
            </>
          )}
          <IconButton onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-gray-600">
            <MenuIcon />
          </IconButton>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white shadow-lg p-4 flex flex-col">
          <NavigationLinks navLinks={navLinks} />
          {isUserLoggedIn ? (
            <button
              onClick={handleLogout}
              className="block w-full text-left px-4 py-2 text-gray-600 hover:bg-gray-100 hover:text-red-600 rounded-lg"
            >
              Logout
            </button>
          ) : (
            <></>
          )}
        </div>
      )}
    </nav>
  );
};

const NavigationLinks = ({ navLinks }) => (
  <>
    {navLinks.map((link, index) => (
      <a
        key={index}
        href={link.href}
        className="text-gray-600 hover:text-green-600 transition"
      >
        {link.name}
      </a>
    ))}
  </>
);

const GuestActions = ({ onLoginClick }) => (
  <>
    <button
      onClick={onLoginClick}
      className="text-green-600 hover:text-green-700 transition rounded-full"
    >
      Sign In
    </button>
    <Link
      to="/signup"
    >
      <button
      className="text-green-600 hover:text-green-700 transition rounded-full"
    >
      Sign Up
    </button>
    </Link>
  </>
);

const ProfileDropdown = ({ user, anchorEl, setAnchorEl, onLogout }) => {
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    onLogout();
    setAnchorEl(null);
  };

  return (
    <div className="relative">
      <IconButton
        onClick={(event) => setAnchorEl(event.currentTarget)}
        color="inherit"
        className="text-green-600 flex items-center space-x-1"
      >
        <AccountCircle className="text-green-600" style={{ fontSize: '24px' }} />
        <span className="text-sm text-green-600">{user?.displayName || 'User'}</span>
        <ExpandMore className="text-green-600" />
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <MenuItem component={Link} to="/profile" onClick={handleMenuClose}>
          Profile
        </MenuItem>
        <MenuItem onClick={handleLogout}>Logout</MenuItem>
      </Menu>
    </div>
  );
};

export default Navbar;
