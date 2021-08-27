import React, { useState, useRef, useMemo } from "react";
import { Container } from "@material-ui/core";
import { Link, NavLink } from "react-router-dom";
import { logo } from "../../assets/img/index";
import { userLogout } from "../../actions/userActions";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import Grow from "@material-ui/core/Grow";
import Paper from "@material-ui/core/Paper";
import Popper from "@material-ui/core/Popper";
import MenuItem from "@material-ui/core/MenuItem";
import MenuList from "@material-ui/core/MenuList";
import NotificationsIcon from "@material-ui/icons/Notifications";
import Badge from "@material-ui/core/Badge";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Button from "@material-ui/core/Button";
import ModeCommentIcon from "@material-ui/icons/ModeComment";
import Menu from "@material-ui/core/Menu";
import { withStyles } from "@material-ui/core/styles";

const Header = () => {
  document.getElementById("onscroll").onscroll = function () {
    var element = document.getElementById("navbar_scroll_fixed");
    var scroll = window.scrollY;
    if (element) {
      if (scroll <= 100) {
        element.classList.remove("fixed-top");
      } else {
        element.classList.add("fixed-top");
      }
    }

    element = document.getElementById("onscroll");
    scroll = window.scrollY;
    if (element) {
      if (scroll <= 100) {
        element.classList.remove("gototop");
      } else {
        element.classList.add("gototop");
      }
    }
  };

  const { userAuditorInfo, notificationAuditorCount, chatInfo } = useSelector(
    (state) => ({
      userAuditorInfo: state.userAuditorInfo,
      notificationAuditorCount: state.notificationAuditorCount,
      chatInfo: state.chatInfo,
    })
  );

  const [dialog, setDialog] = useState(false);
  const handleLogoutClick = () => {
    setDialog(true);
  };
  const history = useHistory();
  const [open, setOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const anchorRef = useRef(null);
  const { push } = useHistory();
  const dispatch = useDispatch();
  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };
  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }

    setOpen(false);
  };

  function handleListKeyDown(event) {
    if (event.key === "Tab") {
      event.preventDefault();
      setOpen(false);
    }
  }

  const handleCloseAction = (action) => {
    if (action) {
      dispatch(userLogout(push));
    }
    setDialog(action);
  };

  const notificationClick = () => {
    push("/user/notification");
  };

  const [anchorEl, setAnchorEl] = useState(null);
  const [totalChat, setChatCount] = useState(0);
  const handleClickChat = (event) => {
    setAnchorEl(event.currentTarget);
    setChatOpen(true);
  };

  const handleCloseChat = () => {
    setChatOpen(false);
    setAnchorEl(null);
  };

  const StyledMenu = withStyles({
    paper: {
      border: "1px solid #d3d4d5",
    },
  })((props) => (
    <Menu
      elevation={0}
      className="chat-menu"
      getContentAnchorEl={null}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "right",
      }}
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      {...props}
    />
  ));

  const StyledMenuItem = withStyles((theme) => ({
    root: {
      "&:focus": {
        backgroundColor: theme.palette.primary.main,
        "& .MuiListItemIcon-root, & .MuiListItemText-primary": {
          color: theme.palette.common.white,
        },
      },
    },
  }))(MenuItem);

  useMemo(() => {
    setTimeout(() => {
      if (chatInfo.length > 0) {
        var count = 0;
        chatInfo.forEach((chat) => (count += chat.count));
        setChatCount(count);
      } else {
        setChatCount(0);
      }
    }, 2000);
  }, [chatInfo]);

  const chatClick = (item) => {
    history.push("/audit-request/chat/" + item.slug + "/" + item.id);
  };

  return (
    <header className="App-header dashboard-header" id="navbar_scroll_fixed">
      <Container>
        <div className="header-row">
          <Link to="/" className="App-brand">
            <img src={logo} className="App-logo" alt="logo" />
          </Link>
          <div className="headerright after-login" id="header-rightbar-navitem">
            <div className="notification">
              <Badge
                badgeContent={totalChat}
                color="primary"
                onClick={handleClickChat}
              >
                <ModeCommentIcon />
              </Badge>
              {chatInfo.length > 0 && (
                <div className="chat-notification">
                  <StyledMenu
                    id="customized-menu"
                    anchorEl={anchorEl}
                    keepMounted
                    open={chatOpen}
                    onClose={handleCloseChat}
                  >
                    {chatInfo.length > 0 &&
                      chatInfo.map((item, key) => (
                        <StyledMenuItem
                          key={key}
                          onClick={() => chatClick(item)}
                        >
                          {item.id}
                          <span className="chatCount">
                            <Badge badgeContent={item.count} color="error">
                              <ModeCommentIcon />
                            </Badge>
                          </span>
                        </StyledMenuItem>
                      ))}
                  </StyledMenu>
                </div>
              )}
            </div>

            <div className="notification">
              <Badge
                badgeContent={notificationAuditorCount}
                color="error"
                onClick={notificationClick}
              >
                <NotificationsIcon />
              </Badge>
            </div>

            <div
              ref={anchorRef}
              aria-controls={open ? "menu-list-grow" : undefined}
              aria-haspopup="true"
              onClick={handleToggle}
              className="profile black-text"
            >
              <small>Welcome</small>
              {userAuditorInfo.first_name} &nbsp;{userAuditorInfo.last_name}
              <i
                className={
                  open ? "fas fa-chevron-down" : "fas fa-chevron-right"
                }
              ></i>
            </div>

            <div className="top-space">
              <Popper
                open={open}
                anchorEl={anchorRef.current}
                role={undefined}
                transition
                disablePortal
              >
                {({ TransitionProps, placement }) => (
                  <Grow
                    {...TransitionProps}
                    style={{
                      transformOrigin:
                        placement === "bottom" ? "center top" : "center bottom",
                    }}
                  >
                    <Paper>
                      <ClickAwayListener onClickAway={handleClose}>
                        <MenuList
                          autoFocusItem={open}
                          id="menu-list-grow"
                          onKeyDown={handleListKeyDown}
                        >
                          <MenuItem onClick={handleClose}>
                            <NavLink
                              className="App-link"
                              exact
                              to="/user/profile"
                            >
                              <i className="fas fa-user"></i>&nbsp;Profile
                            </NavLink>
                          </MenuItem>
                          <MenuItem onClick={handleClose}>
                            <NavLink
                              className="App-link"
                              exact
                              to="/user/change-password"
                            >
                              <i className="fas fa-key"></i>&nbsp;Change
                              Password
                            </NavLink>
                          </MenuItem>
                          <MenuItem
                            onClick={handleLogoutClick}
                            className="user_logout"
                          >
                            <i className="fas fa-sign-out-alt"></i>&nbsp; Logout
                          </MenuItem>
                        </MenuList>
                      </ClickAwayListener>
                    </Paper>
                  </Grow>
                )}
              </Popper>
            </div>
          </div>
        </div>
      </Container>
      <div>
        <Dialog
          open={dialog}
          fullWidth={true}
          maxWidth={"sm"}
          onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">Account Logout</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Are you sure, you want to logout account?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => handleCloseAction(true)}
              color="primary"
              autoFocus
              variant="contained"
              className="login-btn green-bg"
            >
              Yes
            </Button>
            <Button
              onClick={() => handleCloseAction(false)}
              variant="contained"
            >
              Cancel
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </header>
  );
};
export default Header;
