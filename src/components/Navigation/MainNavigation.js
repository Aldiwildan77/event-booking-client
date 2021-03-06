import React from "react";
import { NavLink } from "react-router-dom";
import AuthContext from "../../context/auth-context";

import "./MainNavigation.css";

const mainNavigation = props => (
  <AuthContext.Consumer>
    {context => {
      return (
        <header className="main-nav">
          <div className="main-nav-logo">
            <h1>EventBooking</h1>
          </div>
          <nav className="main-nav-items">
            <ul>
              {!context.token && (
                <li>
                  <NavLink to="/auth">Auth</NavLink>
                </li>
              )}
              <li>
                <NavLink to="/events">Events</NavLink>
              </li>
              {context.token && (
                <React.Fragment>
                  <li>
                    <NavLink to="/bookings">Bookings</NavLink>
                  </li>
                  <li>
                    <button onClick={context.logout}>Logout</button>
                  </li>
                </React.Fragment>
              )}
            </ul>
          </nav>
        </header>
      );
    }}
  </AuthContext.Consumer>
);

export default mainNavigation;
