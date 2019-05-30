import React, { Component } from 'react'
import AuthContext from '../context/auth-context'

import './Auth.css'

class AuthPage extends Component {
  state = {
    isLogin: true
  }
  static contextType = AuthContext

  constructor(props){
    super(props)
    this.namaEl = React.createRef()
    this.usernameEl = React.createRef()
    this.emailEl = React.createRef()
    this.passwordEl = React.createRef()
  }


  switchModeHandler = event => {
    this.setState(prevState => {
      return {
        isLogin: !prevState.isLogin
      }
    })
  }

  Foo = () => {
    return (
      <>
        <div className="form-control">
          <label htmlFor="nama">Nama</label>
          <input type="text" id="nama" ref={this.namaEl}></input>
        </div>
        <div className="form-control">
          <label htmlFor="email">Email</label>
          <input type="email" id="email" ref={this.emailEl}></input>
        </div>
      </>
    )
  }

  submitHandler = event => {
    event.preventDefault()
    const username = this.usernameEl.current.value
    const password = this.passwordEl.current.value
    
    if(username.trim().length === 0 || password.trim().length === 0) {
      return;
    } 
    
    let requestBody = {
      query: `
        {
          login(username: "${username}", password: "${password}"){
            userId
            token
            tokenExp
          }
        }
      `
    }

    if(!this.state.isLogin){
      const nama = this.namaEl.current.value
      const email = this.emailEl.current.value

      if(nama.length === 0 || email.trim().length === 0){
        return;
      }

      requestBody = {
        query: `
        mutation {
          createUser(UserInput: {
            nama:"${nama}", 
            username:"${username}", 
            email:"${email}", 
            password:"${password}"}){
              _id
              nama
              email
              password
              createdEvents {
                _id
                judul
              }
          }
        }
        `
      }
    }

    fetch('http://localhost:5000/graphql', {
        method: 'POST',
        body: JSON.stringify(requestBody),
        headers: {
          'Content-Type': 'application/json'
        }
    })
    .then(res => {
      if(res.status !== 200 && res.status !== 201){
        throw new Error("Authentication Failed!")
      }
      return res.json()
    })
    .then(resBody => {
      if(resBody.data.login.token){
        this.context.login(
          resBody.data.login.token, 
          resBody.data.login.userId,
          resBody.data.login.tokenExp
        )
      }

    })
    .catch(err => {
      console.error(err)
    })
  }

  render(){
    return <form className="auth-form" onSubmit={this.submitHandler}>
      <div className="form-control">
        <label htmlFor="username">Username</label>
        <input type="text" id="username" ref={this.usernameEl}></input>
      </div>
      {this.state.isLogin ? '' : (<this.Foo />)}
      <div className="form-control">
        <label htmlFor="password">Password</label>
        <input type="password" id="password" ref={this.passwordEl}></input>
      </div>
      <div className="form-actions">
        <button type="submit">Submit</button>
        <button type="button" onClick={this.switchModeHandler}>Switch to {this.state.isLogin ? 'Signup' : 'Login'}</button>
      </div>
    </form>
  }
}

export default AuthPage