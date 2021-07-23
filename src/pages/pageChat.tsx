import { useEffect, useState } from 'react';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import Fab from '@material-ui/core/Fab';
import Grid from '@material-ui/core/Grid';
import Hidden from '@material-ui/core/Hidden';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Paper from '@material-ui/core/Paper';
import SendIcon from '@material-ui/icons/Send';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import { useSelector } from 'react-redux';
import { withRouter } from 'react-router-dom';
import useChat from '../hooks/useChat';
import React from 'react';

const useStyles = makeStyles({
  borderRight500: {
    borderRight: '1px solid #e0e0e0',
  },
  chatSection: {
    height: '100vh',
    width: '100%',
  },
  headBG: {
    backgroundColor: '#e0e0e0',
  },
  messageArea: {
    height: '90%',
    overflowY: 'auto',
  },
  table: {
    minWidth: 650,
  },
  allUsersArea: {
    height: '40%',
    overflowY: 'auto',
  },
});
interface AdminState {
    payload: {id:string, admin:boolean, name:string, iat:number}
}

const PageChat = () => {
  const role = (state: AdminState) => state.payload;
  const isRole = useSelector(role);

  const [disabled, setDisabled] = useState<boolean>(Boolean);
  const [newMessage, setNewMessage] = useState<string>('');
  const classes = useStyles();
  const {
    messages,
    sendMessage: setSendMessage,
    ban: baned,
    mute: muted,
    disconnect,
    showAllUsers,
    usersOnline,
  } = useChat();

  useEffect(() => {
    const timeout = setTimeout(() => setDisabled(false), 15000);
    return () => clearTimeout(timeout);
  }, [disabled]);

  const sendMessage = () => {
    setSendMessage(newMessage);
    setTimeout(() => setDisabled(false), 15000);
    setDisabled(true);
    setNewMessage('');
  };

  return (
    <div>
      <Grid
        className={classes.chatSection}
        component={Paper}
        container
      >
        <Grid
          className={classes.borderRight500}
          item
          xs={3}
        >
          <Divider />
          <Grid item xs={12}>
            <Button
              variant="contained"
              size="small"
              color="secondary"
              onClick={() => disconnect()}
            >
              EXIT
            </Button>
          </Grid>
          <Divider />
          <List>
            {usersOnline
                          && usersOnline.map((isUsersOnline) => (
                            <React.Fragment key={isUsersOnline.name}>
                            <ListItem>
                              <ListItemText>{`${isUsersOnline.name} `}</ListItemText>
                              <Hidden only={['sm', 'xs']}>
                                <ListItemText
                                  secondary="online"
                                />
                              </Hidden>
                            </ListItem>
                            </React.Fragment>
                          ))}
          </List>
          {isRole ? (
            <>
              <Divider />
              <List className={classes.allUsersArea}>
                <Typography>All Users</Typography>
                {showAllUsers.map(({id,admin,mute,name,ban}) => (
                  <React.Fragment key={id}>
                  <ListItem>
                    <Typography>{admin ? '' : `${name}`}</Typography>
                    {admin ? (
                      <></>
                    ) : mute ? (
                      <Button
                        variant="contained"
                        size="small"
                        onClick={() => muted(id)}
                        style={{ margin: '5px' }}
                      >
                        UNMUTE
                      </Button>
                    ) : (
                      <Button
                        variant="contained"
                        size="small"
                        onClick={() => muted(id)}
                        style={{ margin: '5px' }}
                      >
                        MUTE
                      </Button>
                    )}
                    {admin ? (
                      <></>
                    ) : ban ? (
                      <Button
                        variant="contained"
                        size="small"
                        color="secondary"
                        onClick={() => baned(id)}
                      >
                        UNBAN
                      </Button>
                    ) : (
                      <Button
                        variant="contained"
                        size="small"
                        color="secondary"
                        onClick={() => baned(id)}
                      >
                        BAN
                      </Button>
                    )}
                  </ListItem>
                  </React.Fragment>
                ))}
              </List>
              <Divider />
            </>
          ) : (
            <></>
          )}
        </Grid>
        <Grid item xs={9}>
          <List className={classes.messageArea}>
            {messages
                            && messages.map((message, i:number) => (
                              // eslint-disable-next-line react/no-array-index-key
                              <Grid item key={i}>
                                <ListItemText
                                  style={{ color: `${message && message.color}` }}
                                >
                                  {`${message && message.user}:${message && message.message}`}
                               
                                </ListItemText>
                                <ListItemText>
                                {`${message && message.createAt}`.substr(11,5) }
                                </ListItemText>
                              </Grid>
                            ))}
          </List>
        </Grid>
        <Divider />
        <Grid container style={{ padding: '20px', marginTop: '15%' }}>
          <Grid item xs={11}>
            <TextField
              id="outlined-basic-email"
              label="Type Something"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              fullWidth
            />
          </Grid>
          <Grid item xs={1}>
            <Fab
              size="small"
              color="primary"
              aria-label="add"
              disabled={disabled}
              onClick={sendMessage}
            >
              <SendIcon />
            </Fab>
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
};

export default withRouter(PageChat);
