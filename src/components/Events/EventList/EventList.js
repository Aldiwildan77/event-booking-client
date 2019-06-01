import React from "react";

import EventItem from "./EventItem/EventItem";
import "./EventList.css";

const eventList = props => {
  const events = props.events.map(listed => {
    return <EventItem eventId={listed._id} judul={listed.judul} harga={listed.harga}/>;
  });
  return <ul className="event-list">{events}</ul>;
};
export default eventList;
