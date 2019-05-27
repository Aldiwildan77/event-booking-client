import React from 'react'
import {NavLink} from 'react-router-dom'

import './MainNavigation.css'

const mainNavigation = props => (
  <header className="main-nav">
    <div className="main-nav-logo">
      <h1>Event Booking</h1>
    </div>
    <nav className="main-nav-items">
      <ul>
        <li><NavLink to="/auth">Auth</NavLink></li>
        <li><NavLink to="/events">Events</NavLink></li>
        <li><NavLink to="/bookings">Bookings</NavLink></li>
      </ul>
    </nav>
  </header>
)

export default mainNavigation