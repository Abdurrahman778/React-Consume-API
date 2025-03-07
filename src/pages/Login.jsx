import axios from "axios";
import React, { useState } from "react";

export default function Login() {
  // state : menyimpan data di project react
  // login: nama datanya, setLogin: func untuk mengisi datanya
  // useState(): membuat state dan nilai default
  const [login, setLogin] = useState({
    username: "",
    password: "",
  });

  const [error, setError] = useState(false);

  function loginProcess(e) {
    e.preventDefault();
    axios
      .post("http://localhost:8000/login", login)
      .then((res) => {
        console.log(res);
      })
      .catch((error) => {
        setError(error.response.data);
        console.log(error.response.data);
      });
  }
  return (
    //class menjadi classname
    <div className="d-flex justify-content-center align-items-center mt-5">
      <form className="card shadow p-4 w-50" onSubmit={loginProcess}>
        <h2 className="text-center fw-bold text-primary mb-4">Login</h2>
        {Object.keys(error).length > 0 ? (
          <div className="alert alert-danger m-2 p-2">
            <ol>
              {Object.entries(error.data).map(([key, value]) => (
                <li>{value}</li>
              ))}
            </ol>
          </div>
        ) : ''
        }
        <div className="mb-3">
          <label htmlFor="username" className="form-label">
            Username
          </label>
          <input
            type="text"
            id="username"
            className="form-control w-100"
            placeholder="Masukan Username Anda"
            onChange={(e) => setLogin({ ...login, username: e.target.value })}
          />
          {/* onchange: ketikan input berubah nilai value, data dari state login dikeluarkan (...login), diganti bagian username menjadi value input terbaru (e.target.value) */}
        </div>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">
            Password
          </label>
          <input
            type="text"
            id="password"
            className="form-control w-100"
            placeholder="Masukan password Anda"
            onChange={(e) => setLogin({ ...login, password: e.target.value })}
          />
        </div>
        <div className="mt-3">
          <button className="btn btn-primary w-100 text-center" type="submit">
            Submit
          </button>
        </div>
      </form>
    </div>
  );
}
