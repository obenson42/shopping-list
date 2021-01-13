import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';
import { useAppContext } from "./contextLib";
import Register from './Register';
import './Login.css';

const useStyles = makeStyles((theme) => ({
  root: {
    '& .MuiTextField-root': {
      margin: theme.spacing(1),
      width: '100%',
    },
  },
  error: {
    fontWeight: "bold",
    color: "red",
    width: "100%",
    textAlign: "center",
  },
}));

function LoginFailMessage() {
  const classes = useStyles();

  return(
    <div className={classes.error}>Unknown username or password</div>
  );
}

export default function Login() {
  const classes = useStyles();
  const { userHasAuthenticated } = useAppContext();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showRegister, setShowRegister] = useState(false);
  const [loginFailed, setLoginFailed] = useState(false);

  function validateForm() {
    return username.length > 0 && password.length > 0;
  }

  async function handleSubmit(event) {
    event.preventDefault();
    global.apiClient.login(username, password).then((data) => {
        global.apiClient.accessToken = data['api_key'];
        global.apiClient.username = username;
        userHasAuthenticated(true);
    })
    .catch(error => {
      if (error.response) {
        //console.log(error.response.data);
        //console.log(error.response.status);
        //console.log(error.response.headers);
      }
      setLoginFailed(true);
    })
  }

  const onClickRegister = () => setShowRegister(true)

  return (
    <>
      { showRegister ? <Register /> : 
      <div className="Login">
          {loginFailed ? <LoginFailMessage />: ""}
        <form className={classes.root} onSubmit={handleSubmit}>
          <TextField
            autoFocus
            required
            type="text"
            label="Username"
            variant="outlined"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <TextField
            required
            type="password"
            variant="outlined"
            label="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button className="login" type="submit" disabled={!validateForm()} variant="contained">
            Login
          </Button>
          <div className="linkToRegister">
            <hr />
            <p>New user? <Button onClick={onClickRegister}>Register</Button></p>
          </div>
        </form>
      </div>
      }
    </>
  );
}