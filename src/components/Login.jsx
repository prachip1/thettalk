import React from "react";
import { GoogleLogin } from '@react-oauth/google';
import { useNavigate } from "react-router-dom";
import { FcGoogle } from 'react-icons/fc';
import bgVideo from '../assets/bg-video.mp4';
import jwt_decode from 'jwt-decode';

import {client} from '../client';

import logo from '../assets/logo.svg';


const Login=()=>{

    const navigate = useNavigate();

 const responseGoogle =(response)=>
 {
   try{
    localStorage.setItem('user', JSON.stringify(response.profileObj))

    var decodedHeader = jwt_decode(response.credential);
    console.log(decodedHeader);

    const {name, sub, picture} = decodedHeader
    const doc= {
        _id:sub,
        _type: 'user',
        userName: name,
        image: picture,
    }
console.log(doc)
   client.createIfNotExists(doc)
   .then(() =>{
    navigate('/', {replace: true})
   })
        

   }
   catch (e) {
    localStorage.clear();
    sessionStorage.clear(); //what you need to do incase the jwt is not valid
    console.log(e) //for your own debugging
  }
           
 }


    return(
        <div className="flex justify-start items-start flex-col h-screen">
         <div className="relative w-full h-full">
          <video 
            src={bgVideo}
            type="video/mp4"
            loop
            controls={false}
            muted
            autoPlay
            className="w-full h-full object-cover"
            />

            <div className="absolute flex flex-col justify-center items-center top-0 right-0 left-0 bottom-0 bg-blackOverlay">
            <div className="p-5">
            <img src={logo} alt="logo" className="w-20" /> 
            </div>
            <div className="shadow-2xl">
                <GoogleLogin
                  
                  render={(renderProps) => (
                    <button
                    onClick={renderProps.onClick}
                    disabled={renderProps.disabled}
                    className='bg-mainColor flex justify-center item-center'>
                        <FcGoogle className="mr-4" /> Sign In with Google
                    </button>
                  )}
                  onSuccess = {responseGoogle}
                  onFailure = {responseGoogle}
                  cookiePolicy = 'single_host_origin'

                />;
            </div>
            </div>
         </div>
          
        </div>
    )
}

export default Login;