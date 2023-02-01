import React,{useState} from "react";
import { AiOutlineCloudUpload } from "react-icons/ai";
import { MdDelete } from "react-icons/md";
import {MdOutlineImage } from 'react-icons/md';
import {HiOutlinePlay} from 'react-icons/hi2';
import { useNavigate } from "react-router-dom";

import { client } from "../client";
import Spinner from './Spinner';

import { categories } from "../utils/data";


const CreatePin = ({user}) =>{
   const [title, setTitle] = useState('');
   const [about, setAbout] = useState('');
   const [destination, setDestination] = useState('');
   const [loading, setLoading] = useState(false);
   const [fields, setFields] = useState(false);
   const [category, setCategory] = useState(null);
   const [imageAsset, setImageAsset] = useState(null);
   const [wrongImageType, setWrongImageType] = useState(false);

   const navigate = useNavigate();

   const uploadImage =(e)=>{
    const { type,name  } = e.target.files[0]; // destructring to get the value but basically the type of the file

    if(type === 'image/png' || type === 'image/svg' || type === 'image/jpeg' || type === 'image/gif'){
      
      setWrongImageType(false);
      setLoading(true);

      client.assets
      .upload('image', e.target.files[0], { contentType : type, filename: name })
      .then((document) => {
        setImageAsset(document);
        setLoading(false);
      })
      .catch((error) => {
        console.log("Image upload error", error);
      })

    }
    else{
      setWrongImageType(true);
    }

   }


   const savePin = () =>{

    if(title && about && destination && imageAsset?._id && category){
      const doc= {
        _type: 'pin',
        title,
        about,
        destination,
        image: {
          _type: 'image',
          asset: {
            _type: 'reference',
            _ref: imageAsset?._id
          },

        },
        userId:user?._id,
        postedBy: {
          _type: 'postedBy',
          _ref: user?._id,
        },
        category,
      }

      client.create(doc).then(() =>{
        navigate('/');
      });
    }else{
      setFields(true);

      setTimeout(
        () => {
          setFields(false);
        },
        2000,
      );
    }

   };


    return (
        <div className="flex flex-col justify-center items-center mt-5 lg:h-4/5">
          {fields && (
            <p className="text-red-500 mb-5 text-xl transition-all duration-150 ease-in">Please Fill all</p>
          )}

          <div className="flex lg:flex-row flex-col justify-center items-center bg-white lg:p-5 p-3 lg:w-4/5 w-full rounded-md">
            <div className="bg-secondaryColor p-3 flex flex-0.7 w-full">
              <div className="flex justify-center items-center flex-col border-2 border-dotted border-gray-30 p-3 w-full h-420">
                    {loading && 

                    (<Spinner />
                    
                    )}

                    {wrongImageType && (
                    
                    <p className="text-red-700">Wrong Image type</p>
                    )
                    }


                    {!imageAsset ? (
                      <label>
                        <div className="flex flex-col items-center justify-center h-full">
                          <div className="flex flex-col justify-center items-center">
                            <p className="font-bold text-2xl text-black">
                            <div className="flex flex-col mt-20">
                              <span className="flex flex-row text-purple-600 p-8 rounded-md "> <MdOutlineImage  className="text-8xl -rotate-6 drop-shadow-2xl"/><HiOutlinePlay className="-ml-6 -mt-7 text-9xl -rotate-6 drop-shadow-2xl" /></span>
                          
                             
                            </div>
                             
                              {/*<AiOutlineCloudUpload /> */}
                            </p>
                            <p className="text-lg text-black">Let's share our worst feed!😜</p>
                          </div>
                          <p className="mt-32 text-gray-400">JPG, PNG, SVG and GIF</p>
                        </div>
                        <input 
                        type="file"
                        name="upload-image"
                        onChange={uploadImage}
                        className="w-0 h-0" />
                     
                      </label>
                    ):(
                    <div className="relative h-full">
                       <img src={imageAsset?.url} alt="uploaded-pic" className="h-full w-full" />
                       <button type="button" className="absolute bottom-3 right-3 p-3 rounded-full bg-red-600 text-xl cursor-pointer transition-all duration-500 ease-in-out" 
                       onClick={()=> setImageAsset(null)}>
                        <MdDelete /></button>
                    </div>
                    )}
              </div>
            </div>

            <div className="flex flex-1 flex-col gap-6 lg:pl-5 mt-5 w-full">
               <input 
               type="text"
               value={title}
               onChange={(e)=> setTitle(e.target.value)}
               placeholder="Add title here"
               className="bg-white outline-none text-2xl sm:text-3xl font-bold border-b-2 border-gray-600 p-2"
               />
               {user && (
                <div className="flex gap-2 mt-2 mb-2 items-center rounded-lg">
                  <img
                  src={user.image}
                  className="w-10 h-10 rounded-full"
                  alt="user-profile" />

                  <p className="font-bold">{user.userName}</p>
                </div>
               )}
              <input 
               type="text"
               value={about}
               onChange={(e)=> setAbout(e.target.value)}
               placeholder="Maybe some poetic say..."
               className="bg-white outline-none text-base sm:text-lg border-b-2 border-gray-600 p-2"
               />
                 <input 
               type="text"
               value={destination}
               onChange={(e)=> setDestination(e.target.value)}
               placeholder="Let me know the link...."
               className="bg-white outline-none text-base sm:text-lg border-b-2 border-gray-600 p-2 "
               />
                

                <div className="flex flex-col">
                <div>
                  <p className="mb-2 font-semibold text-lg sm:text-xl">Choose a category!</p>
                  <select
                  onChange={(e)=> setCategory(e.target.value)}
                  className="bg-white outline-none w-4/5 text-base border-b-2 border-gray-600 p-2 cursor-pointer"
                  >
                    <option value="other" className="sm:text-bg bg-white">Select category</option>
                     {categories.map((item)=>(
                      <option className="text-base border-0 outline-none capitalize bg-white text-black" value={item.name}>
                         {item.name}
                      </option>
                     ))}
                  </select>
                 </div>
                 <div className="flex justify-end items-end mt-5">
                   <button
                   type="button"
                   onClick={savePin}
                   className="bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold p-2 rounded-full w-28 outline-none hover:translate-x-2">
                    Save
                   </button>
                 </div>
                </div>
            </div>
          </div>
        </div>
    )
}

export default CreatePin;