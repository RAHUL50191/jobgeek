import React, { useState } from 'react'
import PropTypes from 'prop-types'

export default function TextForm(props) {
    const [text,setText]=useState(TextForm.defaultProps.text);
    const [textlen,setTextlen]=useState(0);
    const handleOnChange= (event)=>{
        //setText("Entered \n")
        setText(event.target.value)
       // setTextlen(text.length);
    }
    const handleOnClick=(event)=>{
        let newtext=text.toUpperCase();
        setText(newtext);
    }

  return (
    <>
    <div className={`container my-3 bg-${props.mode} text-${props.tcolor} `}>
    
    <div className="mb-3">
    <label id="myBox" className="form-label">{props.text}</label>
    <textarea className="form-control" value={text} onChange={handleOnChange} id="myBox" rows="8"></textarea>
    <button className={`btn btn-${props.tcolor} my-3`} onClick={handleOnClick}>submit</button>
    <h2>Your text has {text.length} characters and {text.split(" ").length} words</h2>
    <h2>Your text has {text.length} characters and {text.split(" ").length} words</h2>
 
  </div>
</div>
    </>
  )
}
TextForm.propTypes={
    text:PropTypes.string
}
TextForm.defaultProps={
    text:"Enter Text"
    
}