import { Route,Routes } from 'react-router-dom';
import Login from './Components/logIn/Login.jsx';
import Main from './Components/Home/Main.jsx';
import './App.css';
import Signup from './Components/logIn/Signup.jsx';

function App() {
  return (
    <div>
      <Routes>
        <Route path='/*' element={<Main/>}/>
        <Route path='/login' element = {<Login/>}/>
        <Route path='/signup' element={<Signup/>}/>
      </Routes>
    </div>
  );
}

export default App;
