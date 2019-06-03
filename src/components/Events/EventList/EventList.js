import React from "react";

import EventItem from "./EventItem/EventItem";
import "./EventList.css";

const eventList = props => {
  const events = props.events.map(listed => {
    return (
      <EventItem
        key={listed._id}
        eventId={listed._id}
        judul={listed.judul}
        harga={listed.harga}
        date={listed.date}
        creatorId={listed.creator._id}
        userId={props.authUserId}
        onDetail={props.onViewDetail}
      />
    );
  });
  return <ul className="event-list">{events}</ul>;
};
export default eventList;
