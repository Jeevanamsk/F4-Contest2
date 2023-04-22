
import './App.css';
import React, { useState, useEffect } from 'react';

function Login() {
  const [usernameState, setUsernameState] = useState('');
  const [passwordState, setPasswordState] = useState('');

  const handleUsernameChange = (event) => setUsernameState(event.target.value);
  const handlePasswordChange = (event) => setPasswordState(event.target.value);

  const handleSubmit = (event) => {
    event.preventDefault();

    fetch("https://dummyjson.com/users", {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: usernameState,
        password: passwordState,
      })
    })
    .then(res => {
      if (res.status === 200) {
        return res.json();
      } else {
        throw new Error(res.statusText);
      }
    })
    .then(data => {
      localStorage.setItem('token', data.token);
      localStorage.setItem('id', data.id);
      window.location.href = '/profile';
    })
    .catch(error => {
      alert(error.message);
    });
  };

  return (
    <center>
      <h1 >Login</h1>
    <form onSubmit={handleSubmit}>
      <label>
        Username:
        <input type="text" value={usernameState} onChange={handleUsernameChange} />
      </label>
      <br />
      <label>
        Password:
        <input type="password" value={passwordState} onChange={handlePasswordChange} />
      </label>
      <br />
      <button type="submit">Log In</button>
    </form>
    </center>
  );
}

function Profile() {
  const [userState, setUserState] = useState(null);

  useEffect(() => {
    const id = localStorage.getItem('id');

    fetch(`https://dummyjson.com/users/${id}`)
      .then(res => {
        if (res.status === 200) {
          return res.json();
        } else {
          throw new Error(res.statusText);
        }
      })
      .then(data => {
        setUserState(data);
      })
      .catch(error => {
        alert(error.message);
      });
  }, []);

  if (!userState) {
    return <div>Loading...</div>;
  }

  return (
    <center>
      <h1>Profile Page</h1>
      <div>
        <h2>Welcome, {userState.username}!</h2>
        <p>Email: {userState.email}</p>
        <p>Phone: {userState.phone}</p>
      </div>
    </center>
  );
}

function App() {
  const token = localStorage.getItem('token');

  if (token) {
    return <Profile />;
  } else {
    return <Login />;
  }
}

export default App;
