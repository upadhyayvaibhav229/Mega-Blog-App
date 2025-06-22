import React from 'react'
import { Link } from 'react-router-dom'

function PostCard({ slug, title, featuredImage }) {
  // console.log("🪵 PostCard received:", { slug, title, featuredImage }); // make sure slug is there
  
  return (
    <Link to={`/post/${slug}`}>
      <div className='w-full bg-gray-100 rounded-xl p-4 cursor-pointer hover:shadow-lg transition-shadow duration-300'>
        <div className='w-full justify-center mb-4'>
          <img 
            src={featuredImage} 
            alt={title} 
            className='rounded-xl object-cover w-full h-48'
          />
        </div>
        <h2 className='text-xl font-bold'>{title}</h2>
      </div>
    </Link>
  )
}

export default PostCard
