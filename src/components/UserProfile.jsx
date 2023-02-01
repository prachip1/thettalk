import React,{useState,useEffect} from "react";
import {AiOutlineLogout} from 'react-icons/ai';
import { useParams, useNavigate } from "react-router-dom";


import { userCreatedPinsQuery, userQuery, userSavedPinsQuery} from '../utils/data'
import { client } from "../client";
import MasonryLayout from './MasonryLayout';
import Spinner from "./Spinner";

const randomImg = 'https://source.unsplash.com/1600x900/?nature,technology,anime'

const activeBtnStyles = 'bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold p-2 rounded-full w-40 mt-3 outline-none';
const notActiveBtnStyles ='mr-4 text-white font-bold p-2 mt-3 rounded-full w-40 outline-none';

const UserProfile =()=>{
    const [user, setUser] = useState(null);
    const [pins, setPins] = useState(null);
    const [text, setText] = useState('Created'); //created or saved

    const [activeBtn, setActiveBtn] = useState('created');
    const navigate = useNavigate();
    const { userId } = useParams();
 
 

    useEffect(() => {
        const query = userQuery(userId);
        client.fetch(query)
         .then ((data)=>{
            setUser(data[0]);
         })
      
    
    }, [userId]);

   useEffect(() => {

    if(text === 'Created') {
    const createdPins = userCreatedPinsQuery(userId);

    client
    .fetch(createdPins)
    .then((data)=>{
        setPins(data);
    });
    }
    else{
        const savedPins = userSavedPinsQuery(userId);

        client
        .fetch(savedPins)
        .then((data) =>{
            setPins(data);
        });
    }
     
   
    
   }, [text, userId])
   



    const logout = () =>{
        localStorage.clear();
        sessionStorage.clear();

        navigate('/login');
    }

    if(!user) {
        return <Spinner message="Loading Profile..." />
    }
    
    
    return(
        <div className="pb-2 h-full justify-center items-center">
           <div className="flex flex-col pb-5">
            <div className="flex flex-col mb-7 lg:relative">
                <div className="flex flex-col justify-center">
                    <img
                    src={randomImg}
                    className="z-1000 w-full h-370 2xl:h-510 shadow-lg"
                    alt="banner" />
                    <img className="rounded-full w-20 h-20 -mt-10 ml-3 drop-shadow-xl object-cover"
                     src={user.image}/>
                     <h1 className="font-bold text-3xl text-center mt-3">{user.userName}</h1>
                     <div className="absolute top-0 z-1 right-0 p-2">
                    
                       {/* <GoogleLogout
                            render={(renderProps) => (
                            <button
                            type="button"
                            onClick={renderProps.onClick}
                            disabled={renderProps.disabled}
                            className='pt-4 pb-4 pl-6 pr-6 cursor-pointer bg-gradient-to-r from-purple-500 to-pink-500 text-white flex justify-center item-center rounded-xl'>
                               Logout
                            </button>
                             )}
                             onLogoutSuccess = {logout}
                               
                            cookiePolicy = 'single_host_origin'
                        
                        />*/} 
                       
                          <button className="bg-purple-500 text-white pl-6 pr-6 pb-4 pt-4 rounded-xl hover:bg-opacity-30 hover:text-lg" 
                          onClick={logout}>Logout</button>
                    
                        
                    </div>
                </div>
                <div className="text-center mb-7">
                    <button type="button" onClick={(e)=>{
                        setText(e.target.textContent)
                        setActiveBtn('created');
                    }}
                         className={`${activeBtn === 'created' ? activeBtnStyles : notActiveBtnStyles}`}>
                        Created
                    </button>

                    <button type="button" onClick={(e)=>{
                        setText(e.target.textContent)
                        setActiveBtn('saved');
                    }}
                         className={`${activeBtn === 'saved' ? activeBtnStyles : notActiveBtnStyles}`}>
                       Saved
                    </button>
                </div>
                <div className="px-2">
                    <MasonryLayout pins={pins} />
                </div>
                {pins?.length === 0 && (
        <div className="flex justify-center font-bold items-center w-full text-1xl mt-2">
          Nothing excited you yet 🤦‍♀️!
        </div>
        )}
            </div>
           </div>
        
        </div>
    )
}

export default UserProfile;