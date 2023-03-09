import { useState } from 'react';
import './App.css';
import Navbar from "./components/Navbar";
import TextForm from './components/TextForm';

function App() {
  const [mode,setMode]=useState("dark");
  const [tcolor,setTcolor]=useState("light");
    const mode2=()=>{setMode("dark");setTcolor("light");document.body.style.backgroundColor="black"}
    const mode1=()=>{setMode("light");setTcolor("dark");document.body.style.backgroundColor="#A9A9A9"}
    const mode3=()=>{setMode("primary");setTcolor("white");document.body.style.backgroundColor="#E9967A"}
    const mode4=()=>{setMode("success");setTcolor("warning");document.body.style.backgroundColor="#483D8B"}
    const mode5=()=>{setMode("info");setTcolor("dark");document.body.style.backgroundColor="#9DDF60"}

  
  

  return (
    <div >
    
    <Navbar  mode={mode} tcolor={tcolor}/>
    <TextForm mode={mode} tcolor={tcolor}/>
    <div className={`container-fluid my-3 fixed-bottom bg-${mode}`}>
    <button type='button' className='btn-outline-light btn mx-3 my-2'  onClick={mode1}>Light</button>
    <button type='button' className='btn btn-outline-dark mx-3 my-2 '  onClick={mode2}>Dark</button>
    <button type='button' className='btn-outline-primary btn mx-3 my-2'  onClick={mode3}>Color1</button>
    <button type='button' className='btn-outline-success btn mx-3 my-2'  onClick={mode4}>Color2</button>
    <button type="button" className="btn btn-outline-info mx-3" onClick={mode5}>Color3</button>
    </div>
    
    </div>
  );
}

export default App;
