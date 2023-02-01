import React from "react";
import {NavLink, Link} from 'react-router-dom';

import {FiHome} from 'react-icons/fi';
import {IoMdAdd, IoMdSearch} from 'react-icons/io';

import { categories } from "../utils/data";
import logo from '../assets/logo.svg';

const isNotActiveStyle = 'flex items-center bg-white text-gray-900 p-4 gap-2 hover:text-red-600 transition-all ease-in-out rounded-full';
const isActiveStyle = 'flex items-center bg-gradient-to-r from-purple-500 to-pink-500 text-white p-4 gap-2 transition-all ease-in-out rounded-full';

const Sidebar =({closeToggle, user}) =>{

    const handleCloseSidebar = () => {
        if (closeToggle) closeToggle(false)
        
    };

    return(
        <div className="z-0 flex flex-col justify-between bg-black h-full overflow-y-scroll min-w-210 hide-scrollbar border-r-2 border-b-gray-300 ">
            <div className="flex flex-col">
                <Link
                 to="/"
                 className="flex px-5 gap-2 my-6 pt-1 w-190 items-center"
                 onClick={handleCloseSidebar}>
                  <img src={logo} alt="logo" className="w-20" />    
                 </Link>
                 
                 <div className="flex flex-col gap-5">
                    <div className="flex gap-3">
                        <div className="ml-5" >
                        <NavLink
                          to='/'
                          className={({isActive}) => isActive ? isActiveStyle : isNotActiveStyle} 
                          onClick={handleCloseSidebar}>
                        <FiHome />
                        </NavLink>
                       </div>
                        <div className="items-center">
                        <p className="text-lg mt-3 text-bold text-gray-400">Home</p> 
                        </div>
                    </div>
                   
                    <div className="flex gap-3">
                     <div className="ml-5">
                     <NavLink to='create-pin' className={({isActive}) => isActive ? isActiveStyle : isNotActiveStyle}  >
                    <IoMdAdd /> 
                    </NavLink>
                    </div>
                    <div className="items-center">
                       <p className="text-lg mt-3 text-bold text-gray-400"> Post</p>
                    </div>   
                 </div>
                   
                  
                    <h3 className="mt-2 px-5 lg:text-xl text-bold text-gray-500 text-xl">Quick Filters</h3>
                    {categories.slice(0, categories.length - 1).map((category)=>(
                        <NavLink 
                          to={`/category/${category.name}`}
                          className="ml-3"
                          //className={({isActive}) => (isActive ? isActiveStyle : isNotActiveStyle)}
                          onClick={handleCloseSidebar}
                          key={category.name}
                        >  
                        {category.name}
                        </NavLink>
                    ))}
                 </div>
            </div>
             {user && (
                <Link to = {`user-profile/${user?._id}`}
                className="flex m-2 gap-2" onClick={handleCloseSidebar}>
                      <img src={user.image} className="w-10 h-10 rounded-full"/>
                      <p className="text-gray-400">{user.userName}</p>
                </Link>
             )}
        </div>
    )

}

export default Sidebar;