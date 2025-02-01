import './App.css'
import {BrowserRouter,Routes,Route} from "react-router";
import Signup from './auth/signup';
import Login from './auth/login';
import Layout from './Layout/Layout';
import ChatRoom from './chat/ChatRoom/ChatRoom';

function App() {


  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Signup/>}/>
          <Route path='/login'element={<Login/>}/>
          <Route path='/chat' element = {<ChatRoom/>}/>
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
