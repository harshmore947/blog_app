import LeftSidebar from '@/components/dashboard/left-Sidebar'
import React from 'react'

function Layout({children}:{
  children:React.ReactNode
}) {
  return (
    <div className='w-full min-h-screen' >
      <div className='flex'>
        <LeftSidebar/>
        <div className='flex-1'>
          {children}
        </div>
      </div>
    </div>
  )
}

export default Layout
