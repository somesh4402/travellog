import * as React from 'react';
import './/App.css'
import EditLocationAltIcon from '@mui/icons-material/EditLocationAlt';
import { useState, useEffect } from 'react';  
import axios from 'axios'
import Map, { Marker } from 'react-map-gl';
import Room from '@mui/icons-material/Room';
import StarIcon from '@mui/icons-material/Star';
import { format } from 'timeago.js'
import { Popup } from 'react-map-gl';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { Card, CardMedia, CardContent, TextField } from '@mui/material';
import Register from './components/Register';
import Login from './components/Login';


function App() {

  const myStorage = window.localStorage;

  const [currentUser , setCurrentUser] = useState(myStorage.getItem("user"))

  const [pins, setPins] = useState([])

  const [currentPlaceId, setCurrentPlaceId] = useState(null);

  const [newPlace, setNewPlace] = useState(null);

  const [showRegister, setShowRegister] = useState(false);
  const [showLogin, setShowLogin] = useState(false);

  

  const [img, setImg] = useState(null);    
  const [title, setTitle] = useState(null);
  const [desc, setDesc] = useState(null);
  const [rating, setRating] = useState(0);


  const [viewport, setViewport] = useState({

    width: "100vw",
    height: "100vh",
    longitude: 73.856255,
    latitude: 18.516726,
    zoom: 4

  });



  useEffect(() => {


    const getPins = async () => {

      try {

        const res = await axios.get("/api/pins")
        setPins(res.data)

      } catch (error) {
        console.log(error)
      }


    }

    getPins()
  }, [])






  const handleMarkerClick = (id, lat, long) => {
    setCurrentPlaceId(id);
    setViewport({ ...viewport, latitude: lat, longitude: long })
  };


  const handleAddClick = (e) => {
    const long = e.lngLat.lng;
    const lat = e.lngLat.lat;
    setNewPlace({
      lat,
      long
    });
  };


  const handleSubmit = async (e) => {

    e.preventDefault();
    const newPin = {
      username: currentUser,
      img,
      title,
      desc,
      rating,
      lat: newPlace.lat,
      long: newPlace.long,
    }

    try {
      const res = await axios.post("/api/pins", newPin)
      setPins([...pins, res.data]);
      setNewPlace(null)
    } catch (error) {
      console.log(error)
    }

  }


const handleLogout =()=>{
  myStorage.removeItem("user");
  setCurrentUser(null)
}




  return (



    <div className='App mapbox ' style={{ width: "100%", height: "100vh" }}  >



      <Map
        {...viewport}
        mapboxAccessToken='pk.eyJ1Ijoic29tZXNod2FybW9yZSIsImEiOiJjbGhrOWcwM3kwYjBjM2VvcGNzaDE1eGR5In0.U4ZuAfm-52JunS_-mGDJtw'
        onMove={nextViewport => setViewport(nextViewport.evt)}
        mapStyle="mapbox://styles/mapbox/dark-v10"
        onDblClick={handleAddClick}

      >

        {/* travel log name and logo  */}
        <div className='logo-Name' >
  
          <EditLocationAltIcon style={{ color: 'white' }} />   </div>

        {/* ---------------- */}


        {/* fetching data from backend  from pin  where data can show on map  */}
        {pins.map((p) => {
          return (
            <>

              <Marker longitude={p.long}
                latitude={p.lat}
                anchor="bottom"
              >

                <Button onClick={() => handleMarkerClick(p._id, p.lat, p.long)}>
                  <Room style={{ color: p.username === currentUser ? "red" : 'black', cursor: 'pointer' }} />
                </Button>

              </Marker>                     
              
                                
              {p._id === currentPlaceId && (

                <Popup
                  key={p._id}
                  latitude={p.lat}
                  longitude={p.long}
                  closeButton={true}
                  closeOnClick={false}
                  onClose={() => setCurrentPlaceId(null)}
                  anchor="left"
                  className="popup"


                >

                  <Card style={{ width: "300px", height: "100%", background: "rgba(52,51,50,255)", color: "rgb(174, 178, 183)", margin: 0, padding: 0 }} sx={{ maxWidth: 345 }}>
                    <CardMedia
                      sx={{ height: 200 }}
                      image={p.img}
                      title={p.title}
                    />
                    <CardContent>
                      <Typography gutterBottom variant="h5" component="div" className='place'>
                        {p.title}
                      </Typography>
                      <Typography variant="body2" className='desc'>
                        -- {p.desc}
                      </Typography>
                      <br />
                      <div className='stars'>

                        {Array(p.rating).fill(<StarIcon className='star' />)}

                      </div>
                      <br />
                      <span className='username'>-- created by <b>{p.username}</b> </span><br />
                      <span className='date'>{format(p.createdAt)}</span>
                    </CardContent>
                  </Card>


                </Popup>
              )
              }

            </>
          )
        })}


        {/* this popup is for adding by double click */}
        {newPlace && (

          <Popup

            latitude={newPlace.lat}
            longitude={newPlace.long}
            closeButton={true}
            closeOnClick={false}
            onClose={() => setNewPlace(null)}
            anchor="left"
            className='popup1'
            tip={0}

          >
            <div>

              <form onSubmit={handleSubmit}>

                <TextField onChange={(e) => setImg(e.target.value)} id="img" label="Image link " variant="standard" /> <br /><br />
                <TextField onChange={(e) => setTitle(e.target.value)} id="title" label=" title " variant="standard" /><br /><br />
                <TextField onChange={(e) => setDesc(e.target.value)} id="desc" label=" desc " variant="standard" /><br /><br />
                <select onChange={(e) => setRating(e.target.value)} >
                  <option value="1" >1 star</option>
                  <option value="2" >2 star</option>
                  <option value="3" >3 star</option>
                  <option value="4" >4 star</option>
                  <option value="5" >5 star</option>
                </select><br /><br />
                <Button type='submit' variant="contained" color='error'>add new log</Button>
              </form>

            </div>

          </Popup>
        )}



        {/* login logout and register buttons  */}

        {currentUser ? (<Button variant="contained" color="error" className='button logout' onClick={handleLogout}>  Logout </Button>) : (

          <div className='buttons'>
            <Button variant="contained" color="secondary" className='button login' onClick={()=>setShowLogin(true)} > Login</Button>
            <Button variant='contained' className='button register' onClick={()=>setShowRegister(true)} >Register</Button>
          </div>

        )}

        {showRegister && <Register  setShowRegister={setShowRegister} /> }
        {showLogin && <Login setShowLogin={setShowLogin}  myStorage={myStorage}  setCurrentUser={setCurrentUser}   /> }

        

      </Map>


    </div>




  );
}

export default App;
