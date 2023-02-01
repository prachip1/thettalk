import React, { useState, useEffect} from "react";
import { MdDownloadForOffline } from "react-icons/md";
import {Link, useParams} from 'react-router-dom';
import {v4 as uuidv4} from 'uuid';

import {client, urlFor } from '../client';

import {pinDetailMorePinQuery, pinDetailQuery} from '../utils/data';

import Spinner from './Spinner';


const PinDetail =({ user }) =>{
    const [pins, setPins] = useState(null);
    const [pinDetails, setPinDetails] = useState(null);
    const [comment, setComment] = useState('');
    const [addingComment, setAddingComment] = useState(false);

    const { pinId } = useParams();
   
  
   


    const fetchPinDetails = () =>{
        let query = pinDetailQuery(pinId);

        if(query) {
            client.fetch(query)
            .then((data) =>{
                setPinDetails(data[0]);  // for getting the exact pin

                if(data[0]) {
                  query = pinDetailMorePinQuery(data[0]);

                  client.fetch(query)

                  .then((res) => setPins(res)); // for getting more pin simailar to that or basically similar category
                }
            })
        }

    }

    useEffect(() => {

        fetchPinDetails ();
      
    }, [pinId]);

    const addComment = () =>{
      if(comment){
        setAddingComment(true);

        client
        .patch(pinId)
        .setIfMissing({ comments: []})
        .insert('after', 'comments[-1]', [{ 
          comment, 
          _key: uuidv4(), 
          postedBy: {_type:'postedBy', _ref: user._id}}])
        .commit()
        .then(() =>{
          fetchPinDetails();
          setComment('');
          setAddingComment(false);
        });
      }

    };

   const deleteComment = (comment) =>{
      try {
        client
     
        .delete([`comments[comment == "${comment}"]`])
        .commit()
       
        window.location.reload();
      } catch (error) {
        console.log(error);
      }

    }

 
    

    if(!pinDetails) return <Spinner message="Loading pin detail" /> 
   
    

    return(
        <div className="flex xl:flex-row flex-col m-auto bg-black" style={{ maxWidth : '1500px', borderRadius: '32px' }}>
        <div className="flex justify-center items-center md:items-start flex-initial">
        <img 
        src={pinDetails?.image && urlFor(pinDetails.image).url()}
        className="rounded-t-3xl rounded-b-lg h-screen"
        alt="user-post"
        />
        </div>
        <div className="w-full p-5 flex-1 xl:min-w-620">
            <div className="flex items-center justify-between">
              <div className="flex gap-2 items-center">
                <a
                  href={`${pinDetails.image?.asset?.url}?dl=`}
                  download
                  className="bg-secondaryColor p-2 text-xl rounded-full flex items-center justify-center text-dark opacity-75 hover:opacity-100"
                >
                  <MdDownloadForOffline />
                </a>
              </div>
              <a href={pinDetails.destination} target="_blank" 
              rel="noreferrer" 
              className="bg-white pt-4 pb-4 pl-7 pr-7 border-none text-purple-800 rounded-md hover:bg-gray-100 ">
                {/*{pinDetails.destination?.slice(0,20)} */}
               LINK
              </a>
            </div>
            <div>
              <h3 className="text-4xl font-bold break-words mt-3 text-gray-200">
                {pinDetails.title}
              </h3>
              <p className="mt-3">{pinDetails.about}</p>
            </div>

            <Link to={`/user-profile/${pinDetails.postedBy?._id}`} 
            className="flex gap-2 mt-5 items-center text-gray-200 rounded-lg ">

              <img src={pinDetails.postedBy?.image} 
              className="w-10 h-10 rounded-full" 
              alt="user-profile" />

              <p className="font-semibold capitalize">{pinDetails?.postedBy.userName}</p>
            </Link>

            <h5 className="mt-5 text-lg">Comments</h5>

            {/* comment section which will appear after posting comment */}

            <div className="max-h-370 overflow-y-auto">
              {pinDetails?.comments?.map((comment,i) => (
                <>
                <div 
                className="flex gap-2 mt-5 items-center  rounded-lg" 
                key={i}>
                  <img
                    src={comment.postedBy?.image}
                    className="w-10 h-10 rounded-full cursor-pointer"
                    alt="user-profile"
                  />
                  <div className="flex flex-col bg-black">
                    <p className="font-bold">{comment.postedBy?.userName}</p>
                  
                  </div>
                  <p className="font-bold text-white bg-black">{comment.comment}</p>
                  {/* this button should appear with comment field for deletion of the comment */}
                  <button type="button" onClick={deleteComment}>Delete</button>
                </div>
            </>
              ))}

            </div>
            <div className="flex flex-wrap mt-6 gap-3">
            <Link to={`/user-profile/${pinDetails.postedBy?._id}`} >

              <img src={pinDetails.postedBy?.image} 
              className="w-10 h-10 rounded-full cursor-pointer" 
              alt="user-profile" 
              />
              
            </Link>
            <input 
            className="flex-1 bg-black border-b-2 border-b-gray-700 outline-none p-2  focus:border-white" 
            type="text"
            placeholder="Add your shitty comment"
            value={comment}
            onChange={(e) =>setComment(e.target.value)}
            />
            <button 
            type="button"
            className="bg-purple-500 text-white rounded-full px-6 py-2 font-semibold text-base outline-none"
            onClick={addComment}>
              {addingComment ? 'Posting..' : 'Post'}
            </button>
            </div>
        </div>
        </div>
    )
}

export default PinDetail;