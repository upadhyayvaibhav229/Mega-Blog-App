import React from 'react'

function Container({children}) {
  return <div className='w-full min-w-[300px] max-w-7xl mx-auto px-4'>{children}</div>;
  
}

export default Container