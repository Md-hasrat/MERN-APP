import React from 'react'
import { FaUserPlus } from 'react-icons/fa'
import { MdFindInPage } from 'react-icons/md'
import { IoMdSend } from 'react-icons/io'

const HowItWorks = () => {
  return (
    <div className='howitworks'>
        <div className="container">
          <h3>How JobZee Works</h3>
          <div className="banner">
            <div className="card">
              <FaUserPlus />
              <p>Create Account</p>
              <p>Find the perfect job tailored to your skills and interests. Connect with top employers, access career resources, and apply effortlessly. Start your journey to professional success today!</p>
            </div>
            <div className="card">
              <MdFindInPage />
              <p>Find a Job/Post a Job</p>
              <p>Find the perfect job tailored to your skills and interests. Connect with top employers, access career resources, and apply effortlessly. Start your journey to professional success today!</p>
            </div>
            <div className="card">
              <IoMdSend />
              <p>Find a Job/Post a Job</p>
              <p>Find the perfect job tailored to your skills and interests. Connect with top employers, access career resources, and apply effortlessly. Start your journey to professional success today!</p>
            </div>
          </div>
        </div>
    </div>
  )
}

export default HowItWorks
