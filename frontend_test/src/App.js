import { useState, useEffect } from 'react';
import {getAuth, createUserWithEmailAndPassword} from "firebase/auth"
import './App.css';
import { app } from './firebase';


function App() {
  const [data, setData] = useState({
    email: "",
    password: "",
  });

  useEffect(() => {
    console.log(app);
    console.log(process.env.stg_client_email)
  }, [])

  const onChange = (e) => {
    setData((prev) => ({...prev, [e.target.name]: e.target.value}));
  }

  const createUser = async () => {
    try {
      const auth = getAuth();
      console.log(auth);
      const user = await createUserWithEmailAndPassword(getAuth(), data.email, data.password);
      console.log(user);
    } catch (error) {
      
    }
  }

  return (
    <div className="App">
      <header className="App-header">
        <p>Iniciar sesion</p>
        <input type="text" placeholder="mail" name="email" onChange={onChange}></input>
        <br/>
        <input type="text" placeholder="contrasenia" name="password" onChange={onChange}></input>
        <br/>
        <button onClick={createUser}>Enviar</button>
      </header>
    </div>
  );
}

export default App;
