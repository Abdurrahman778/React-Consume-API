import React from "react";
// import Seno from "./assets/images/seno.png";


export default function Profile() {
  return (
    <div className="container-fluid d-flex justify-content-center align-items-center vh-100">
      <div className="card text-center" style={{ width: "50%", maxWidth: "800px" }}>
        <img
          src="https://avatars.githubusercontent.com/u/150973246?v=4"
          className="card-img-top"
          alt="Banner"
        />
        <div className="card-header">Profile</div>
        <div className="card-body">
          <h5 className="card-title">Email : Abdurrahman@gmail.com</h5>
          <h5 className="card-title">Username : Abdurrahman</h5>
          <h5 className="card-title">Role: ATMIN</h5>
          <h5 className="card-title">Status: Jomblo</h5>
          {/* <p className="card-text">
            With supporting text below as a natural lead-in to additional content.
          </p>
          <a href="#" className="btn btn-primary">Go somewhere</a> */}
        </div>
        {/* <div className="card-footer text-body-secondary">2 days ago</div> */}
      </div>
    </div>
  );
}
