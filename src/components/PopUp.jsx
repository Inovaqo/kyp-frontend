'use client'
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { RxCross2 } from "react-icons/rx";

export default function PopUp({ props}) {
  const [showPopup, setShowPopup] = useState(false);
  useEffect(() => {
    setShowPopup(props.show)
    setTimeout(()=>{
      setShowPopup(false)
    },props.timeout)
  }, [props, props.show, props.timeout]);
  return <>
    {showPopup &&(<div className="pop-up bg-ffffff search-drop-shadow-class" >
      <div className="flex items-center">
        <Image width={35} height={35} src={props.type === 'error'?'/fail.gif':props.type === 'warning'?'/alert.gif':'/success.gif'} alt="popupIcon"/>
        <p style={props.type === 'error'?{color:'#A12928'}:props.type === 'warning'?{color:'#FE9900'}:{color:'#04AA6D'}} className="text-14 text-weight-400 ml-12 popup-p">{props.message}</p>
      </div>
      <Image className="cursor-pointer ml-12" width={10} height={10} src="/crossIcon.png" alt="closeIcon" onClick={()=>{setShowPopup(false)}}/>
    </div>)}
  </>
}


export const SharedPopUp = ({ props}) => {
  const [showPopup, setShowPopup] = useState(false);
  useEffect(() => {
    setShowPopup(props.show)
    setTimeout(()=>{
      setShowPopup(false)
    },props.timeout)
  }, [props, props.show, props.timeout]);
  return <>
    {showPopup &&(
        <div className='popup-main' >
        <div  style={{display:'flex', alignItems:'center'}}>
          <img height={30}  width={30} alt='shared' src='/shared.png' />
         <div style={{marginLeft:"20px"}}>
         <h6 className='text-3593B8'>Share Rating</h6>
          <p className='text-14'> Link Copied to the Clipboard </p>
         </div>
        </div>
        <RxCross2 size={20} />
        </div>
    )}
  </>
}