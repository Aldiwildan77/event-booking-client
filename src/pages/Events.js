import React, { Component } from "react";

import Modal from "../components/Modal/Modal";
import Backdrop from "../components/Backdrop/Backdrop";
import AuthContext from "../context/auth-context";
import EventList from "../components/Events/EventList/EventList";
import Spinner from "../components/Spinner/Spinner";

import "./styles/Events.css";

class EventsPage extends Component {
  state = {
    creating: false,
    events: [],
    isLoading: false,
    selectedEvent: null
  };

  constructor(props) {
    super(props);
    this.judulEl = React.createRef();
    this.deskripsiEl = React.createRef();
    this.hargaEl = React.createRef();
    this.dateEl = React.createRef();
  }

  static contextType = AuthContext;

  componentDidMount() {
    this.fetchEvent();
  }

  createEvent = () => {
    this.setState({ creating: true });
  };

  modalOnCancel = () => {
    this.setState({ creating: false, selectedEvent: null });
  };

  modalOnConfirm = () => {
    this.setState({ creating: false });
    const judul = this.judulEl.current.value;
    const deskripsi = this.deskripsiEl.current.value;
    const harga = +this.hargaEl.current.value;
    const date = this.dateEl.current.value;

    if (
      judul.trim().length === 0 ||
      deskripsi.trim().length === 0 ||
      harga <= 0 ||
      date.trim().length === 0
    ) {
      console.error("Your input is not valid");
      return;
    }

    const event = {
      judul,
      deskripsi,
      harga,
      date
    };

    console.log(event);
    const requestBody = {
      query: `mutation {
        createEvent(EventInput: {
          judul: "${judul}",
          deskripsi: "${deskripsi}",
          harga: ${harga},
          date: "${date}"
        }) {
          _id
          judul
          deskripsi
          harga
          date
        }
      }`
    };

    const token = this.context.token;

    fetch("http://localhost:5000/graphql", {
      method: "POST",
      body: JSON.stringify(requestBody),
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token
      }
    })
      .then(res => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error("Failed!");
        }
        return res.json();
      })
      .then(resBody => {
        this.setState(prevState => {
          const updatedEvents = [...prevState.events];
          updatedEvents.push({
            _id: resBody.data.createEvent._id,
            judul: resBody.data.createEvent.judul,
            deskripsi: resBody.data.createEvent.deskripsi,
            harga: resBody.data.createEvent.harga,
            date: resBody.data.createEvent.date,
            creator: {
              _id: this.context.userId
            }
          });
          return { events: updatedEvents };
        });
      })
      .catch(err => {
        console.log(err);
      });
  };

  fetchEvent = () => {
    this.setState({ isLoading: true });
    const requestBody = {
      query: `query {
        events {
          _id
          judul
          deskripsi
          harga
          date
          creator {
            _id
            nama
          }
        } 
      }`
    };

    fetch("http://localhost:5000/graphql", {
      method: "POST",
      body: JSON.stringify(requestBody),
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then(res => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error("Failed!");
        }
        return res.json();
      })
      .then(resBody => {
        const events = resBody.data.events;
        this.setState({ events: events, isLoading: false });
      })
      .catch(err => {
        console.log(err);
      });
  };

  showDetailHandler = eventId => {
    this.setState(prevState => {
      const selectedEvent = prevState.events.find(e => e._id === eventId);
      return { selectedEvent: selectedEvent };
    });
  };

  bookEventHandler = () => {};

  render() {
    return (
      <React.Fragment>
        {(this.state.creating || this.state.selectedEvent) && <Backdrop />}
        {this.state.creating && (
          <Modal
            title="Add Event"
            canCancel
            canConfirm
            onCancel={this.modalOnCancel}
            onConfirm={this.modalOnConfirm}
            confirmText="Add"
          >
            <form>
              <div className="form-control">
                <label htmlFor="title">Judul</label>
                <input type="text" id="title" ref={this.judulEl} />
              </div>
              <div className="form-control">
                <label htmlFor="deskripsi">Deskripsi</label>
                <textarea
                  id="deskripsi"
                  rows="4"
                  width=""
                  ref={this.deskripsiEl}
                />
              </div>
              <div className="form-control">
                <label htmlFor="harga">Harga</label>
                <input type="number" id="harga" min="0" ref={this.hargaEl} />
              </div>
              <div className="form-control">
                <label htmlFor="date">Tanggal</label>
                <input type="datetime-local" id="date" ref={this.dateEl} />
              </div>
            </form>
          </Modal>
        )}
        {this.state.selectedEvent && (
          <Modal
            title="Event Details"
            canCancel
            canConfirm
            onCancel={this.modalOnCancel}
            onConfirm={this.bookEventHandler}
            confirmText="Book"
          >
            <h1>{this.state.selectedEvent.judul}</h1>
            <h2>
              ${this.state.selectedEvent.harga} -{" "}
              {new Date(this.state.selectedEvent.date).toLocaleDateString()}
            </h2>
            <p>{this.state.selectedEvent.deskripsi}</p>
          </Modal>
        )}
        {this.context.token && (
          <div className="events-control">
            <p>Buat event milikmu sekarang juga</p>
            <button className="btn" onClick={this.createEvent}>
              Create Event
            </button>
          </div>
        )}
        {this.state.isLoading ? (
          <Spinner />
        ) : (
          <EventList
            events={this.state.events}
            authUserId={this.context.userId}
            onViewDetail={this.showDetailHandler}
          />
        )}
      </React.Fragment>
    );
  }
}

export default EventsPage;
