import React, { Component } from "react";

import Modal from "../components/Modal/Modal";
import Backdrop from "../components/Backdrop/Backdrop";
import AuthContext from '../context/auth-context'
import "./styles/Events.css";

class EventsPage extends Component {
  state = {
    creating: false
  };

  constructor(props) {
    super(props);
    this.judulEl = React.createRef();
    this.deskripsiEl = React.createRef();
    this.hargaEl = React.createRef();
    this.dateEl = React.createRef();
  }

  static contextType = AuthContext

  createEvent = () => {
    this.setState({ creating: true });
  };

  modalOnCancel = () => {
    this.setState({ creating: false });
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
      console.error('Your input is not valid')
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
          judul: ${judul},
          deskripsi: ${deskripsi},
          harga: ${harga},
          date: ${date}
        }) {
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

    const token = this.context.token

    fetch('http://localhost:5000/graphql', {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      }
    })
    .then(res => {
      if (res.status !== 200 && res.status !== 201) {
        throw new Error("Failed!");
      }
      return res.json();
    })
    .then(resBody => {
      console.log(resBody)
    })
    .catch(err => {
      console.log(err);
    });
  };

  render() {
    return (
      <React.Fragment>
        {this.state.creating && <Backdrop />}
        {this.state.creating && (
          <Modal
            title="Add Event"
            canCancel
            canConfirm
            onCancel={this.modalOnCancel}
            onConfirm={this.modalOnConfirm}
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
        <div className="events-control">
          <p>Buat event milikmu sekarang juga</p>
          <button className="btn" onClick={this.createEvent}>
            Create Event
          </button>
        </div>
      </React.Fragment>
    );
  }
}

export default EventsPage;
