import React from "react";

import "./EventItem.css";

const eventItem = props => {
  return (
    <li key={props._id} className="event-list-item">
      <div>
        <h1>{props.judul}</h1>
        <h2>Rp. {props.harga} - {new Date(props.date).toLocaleDateString()}</h2>
      </div>
      <div>
        {props.userId === props.creatorId ? (
          <p>You are the owner of this Event</p>
        ) : (
          <button className="btn" onClick={props.onDetail.bind(this, props.eventId)}>View Details</button>
        )}
      </div>
    </li>
  );
};

export default eventItem;
