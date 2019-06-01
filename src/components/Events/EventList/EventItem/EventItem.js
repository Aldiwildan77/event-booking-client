import React from "react";

import "./EventItem.css";

const eventItem = props => {
  return (
    <li key={props._id} className="event-list-item">
      <div>
        <h1>{props.judul}</h1>
        <h2>Rp. {props.harga}</h2>
      </div>
      <div>
        <button className="btn">View Details</button>
      </div>
    </li>
  );
};

export default eventItem;
