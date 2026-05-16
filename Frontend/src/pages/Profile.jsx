import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import { assets } from '../assets/assets'
import axios from 'axios'
import { toast } from 'react-toastify'

const Profile = () => {
  const { navigate, token, setCartItems, setToken, backendUrl } = useContext(ShopContext)
  const [userData, setUserData] = useState(null)
  const [loading, setLoading] = useState(true)

  const logout = () => {
    navigate('/login')
    localStorage.removeItem('token')
    setToken('')
    setCartItems({})
  }

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!token) {
        navigate('/login')
        return
      }

      try {
        const response = await axios.get(backendUrl + '/api/user/profile', {
          headers: { token }
        })

        if (response.data.success) {
          setUserData(response.data.user)
        } else {
          toast.error(response.data.message)
        }
      } catch (error) {
        console.error(error)
        toast.error(error.message)
      } finally {
        setLoading(false)
      }
    }

    fetchUserProfile()
  }, [token, backendUrl, navigate])

  if (loading) {
    return (
      <div className='flex justify-center items-center h-[60vh]'>
        <div className='w-10 h-10 border-4 border-gray-300 border-t-black rounded-full animate-spin'></div>
      </div>
    )
  }

  return (
    <div className='flex flex-col items-center pt-10 border-t'>
      <div className='w-full max-w-2xl bg-white shadow-sm border border-gray-200 rounded-lg p-8 mt-8'>
        <div className='flex flex-col sm:flex-row items-center gap-6'>
          <div className='w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden border border-gray-300'>
            <img src={assets.profile_icon} alt="Profile" className='w-12 h-12 opacity-50' />
          </div>
          <div className='flex-1 text-center sm:text-left'>
            <h1 className='text-2xl font-medium text-gray-800'>{userData?.name || 'User'}</h1>
            <p className='text-gray-500 mt-1'>Manage your account details and orders</p>
          </div>
          <button 
            onClick={logout} 
            className='px-6 py-2 bg-black text-white text-sm rounded-md hover:bg-gray-800 transition-colors'
          >
            Logout
          </button>
        </div>

        <div className='mt-10'>
          <h2 className='text-lg font-medium text-gray-800 border-b pb-3 mb-6'>Account Information</h2>
          <div className='grid grid-cols-1 sm:grid-cols-2 gap-6'>
            <div>
              <p className='text-sm text-gray-500 mb-1'>Full Name</p>
              <p className='text-base text-gray-800 font-medium'>{userData?.name || 'Not provided'}</p>
            </div>
            <div>
              <p className='text-sm text-gray-500 mb-1'>Email Address</p>
              <p className='text-base text-gray-800 font-medium'>{userData?.email || 'Not provided'}</p>
            </div>
            {/* Phone and Address removed for now as they are not in the db, but can be added in future */}
            <div>
              <p className='text-sm text-gray-500 mb-1'>Phone Number</p>
              <p className='text-base text-gray-400 italic'>Add your phone number</p>
            </div>
            <div>
              <p className='text-sm text-gray-500 mb-1'>Address</p>
              <p className='text-base text-gray-400 italic'>Add your address</p>
            </div>
          </div>
          
          <div className='mt-8 pt-6 border-t flex gap-4'>
             <button className='px-6 py-2 border border-gray-300 text-gray-700 text-sm rounded-md hover:bg-gray-50 transition-colors'>
               Edit Profile
             </button>
             <button onClick={() => navigate('/orders')} className='px-6 py-2 border border-black bg-black text-white text-sm rounded-md hover:bg-gray-800 transition-colors'>
               View Orders
             </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile
