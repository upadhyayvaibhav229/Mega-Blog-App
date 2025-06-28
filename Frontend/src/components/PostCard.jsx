import React from 'react'
import { Link } from 'react-router-dom'

function PostCard({ slug, title, featuredImage, category }) {
  // console.log("🪵 PostCard received:", { slug, title, featuredImage }); // make sure slug is there
  
  return (
    <Link to={`/post/${slug}`}>
      <div className='w-full bg-gray-100 rounded-xl p-4 cursor-pointer hover:shadow-lg transition-shadow duration-300 space-y-3'>
        <div className='w-full justify-center mb-4'>
          <img 
            src={featuredImage} 
            alt={title} 
            className='rounded-xl object-cover w-full h-48'
          />
        </div>
        <span className='bg-[#5044E5]/20 text-[#5044e5] px-5 py-1 rounded-full'>{category}</span>
        <h2 className='text-xl font-bold'>{title}</h2>
        
      </div>
    </Link>
  )
}

export default PostCard
