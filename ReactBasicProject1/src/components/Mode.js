import React,{useState} from 'react'
import PropTypes from 'prop-types'
import App from '../App';
import Navbar from './Navbar';

export default function Mode(props) {
  const [theme,setTheme]=useState({
    color:"white",
    backgroundColor: 'black'
  });
  const handleOnClick=(event)=>{
       
       //document.getElementById('myID').style.backgroundColor = 'green';
       if (props.mode=="dark") {
        setTheme({
          color:"white",
          backgroundColor: 'black'
        })
      
       }      
       else {
        setTheme({
          color:'black',
          backgroundColor:"white"
        })
        
       }
       
       
  }
  return (
    <div className='container'>
      <a style={theme}>this is buisness</a>
    <button className='btn btn-primary my-3' onClick={handleOnClick}>click me theme</button>
    </div>
  )
}
