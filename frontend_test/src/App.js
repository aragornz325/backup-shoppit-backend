import { useState, useEffect } from 'react';
import {getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, getIdToken} from "firebase/auth"
import axios from 'axios';
import {app} from './firebase'
import './App.css';
import SubscriptionForm from './components/SubscriptionForm';
const apiURL = "http://localhost:5001/shoppit-app-stg/us-central1/api";

function App() {
  const [data, setData] = useState({
    email: "",
    password: "",
  });

  useEffect(() => {
    console.log(app)
  }, [])
  const onChange = (e) => {
    setData((prev) => ({...prev, [e.target.name]: e.target.value}));
  }

  const createUser = async () => {
    try {
      const auth = await createUserWithEmailAndPassword(getAuth(), data.email, data.password);
      const token = await auth.user.getIdToken();
      console.log(token);
    } catch (error) {
      console.log(error); 
    }
  }
  const signIn = async () => {
    try {
      const user = await signInWithEmailAndPassword(getAuth(), data.email, data.password);
      let token = user._tokenResponse.idToken;
      console.log(token);
      const response = await axios.post(apiURL+"/verify-token", {
        idToken: token
      });
      console.log(response);
    } catch (error) {
      console.log(error); 
    }
  }

  return (
    <div className="App">
      <header className="App-header">
        <p>Crear Cuenta</p>
        <input type="text" placeholder="mail" name="email" onChange={onChange}></input>
        <br/>
        <input type="text" placeholder="contrasenia" name="password" onChange={onChange}></input>
        <br/>
        <button onClick={createUser}>Crear Cuenta</button>
        <br></br>
        <button onClick={signIn}>Iniciar Sesion</button>
      <SubscriptionForm/>
      </header>
    </div>
  );
}

export default App;
