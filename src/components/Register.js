import React, { useState } from 'react';
import axios from 'axios';
import { TextField, Button, Alert } from '@mui/material';
import EditLocationAltIcon from '@mui/icons-material/EditLocationAlt';

import CancelIcon from '@mui/icons-material/Cancel';

import './Register.css';

const Register = ({setShowRegister}) => {
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newUser = {
      username,
      email,
      password,
    };

    try {
      const response = await axios.post('/api/users/register', newUser);
      setSuccess(true);
      setError(false);
      console.log(response);
    } catch (error) {
      setError(true);
      setErrorMessage(error.response.data.message);
    }
  };

  return (
    <div className="registerContainer">
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
          label="Email"
          type="email"
          autoComplete="off"
          variant="standard"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
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
          Register
        </Button>

        {success && <Alert severity="success">Successfully registered. Please login.</Alert>}
        {error && <Alert severity="error">{errorMessage}</Alert>}
      </form>

      <CancelIcon className='registerCancel' onClick={()=>setShowRegister(false)} />
    </div>
  );
};

export default Register;
