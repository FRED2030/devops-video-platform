import { useEffect, useState } from 'react';

function App() {

  const [videos, setVideos] = useState([]);
  const [token, setToken] = useState('');

  // Fetch videos
  useEffect(() => {

    fetch('http://localhost:3002/videos')
      .then(res => res.json())
      .then(data => setVideos(data))
      .catch(err => console.error(err));

  }, []);

  // Login function
  const login = async () => {

    try {

      const response = await fetch(
        'http://localhost:3001/login',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            username: 'admin',
            password: 'password'
          })
        }
      );

      const data = await response.json();

      setToken(data.token);

    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div style={{ padding: '20px' }}>

      <h1>DevOps Video Platform</h1>

      <button onClick={login}>
        Login
      </button>

      {token && (
        <>
          <h3>JWT Token</h3>
          <p>{token}</p>
        </>
      )}

      <h2>Videos</h2>

      {videos.map(video => (
        <div
          key={video.id}
          style={{
            border: '1px solid gray',
            padding: '10px',
            marginBottom: '10px'
          }}
        >
          <h3>{video.title}</h3>
          <p>{video.duration}</p>
        </div>
      ))}

    </div>
  );
}

export default App;
