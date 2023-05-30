
import React, { useState } from 'react';
import axios from 'axios';
import { TextField, Button, Alert } from '@mui/material';
import EditLocationAltIcon from '@mui/icons-material/EditLocationAlt';

import CancelIcon from '@mui/icons-material/Cancel';

import './Login.css';

const Login = ({setShowLogin,myStorage,setCurrentUser}) => {

  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const [username, setUsername] = useState('');
 
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const User = {
      username,
      password,
    };

    try {
      const response = await axios.post('/api/users/login', User);
      myStorage.setItem("user",response.data.username)
      setCurrentUser(response.data.username)
      setShowLogin(false)
      setError(false);
      
    } catch (error) {
      setError(true);
      setErrorMessage(error.response.data.message);
    }
  };

  return (
    <div className="LoginContainer">
      <div className="logo">
        <EditLocationAltIcon style={{ color: 'white' }} />
        TRAVEL LOG
      </div>

      <form onSubmit={handleSubmit}>
        <TextField
          label="Username"
          type="text"
          autoComplete="off"
          variant="standard"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        
        <TextField
          label="Password"
          type="password"
          autoComplete="off"
          variant="standard"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <Button type="submit" variant="contained" sx={{ backgroundColor: 'black', color: 'white' }}>
        Login
        </Button>

    
        {error && <Alert severity="error">{errorMessage}</Alert>}
      </form>

      <CancelIcon className='LoginCancel' onClick={()=>setShowLogin(false)} />
    </div>
  );
};

export default Login;
