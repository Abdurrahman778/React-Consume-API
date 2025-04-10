import React, {useState, useEffect} from "react";
// import Seno from "./assets/images/seno.png";


export default function Profile() {
  const [userData, setUserData] = useState({
    username: "",
    email: "",
    role: "",
  });

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      const parsedUser = JSON.parse(user);
      setUserData({
        username: parsedUser.username,
        email: parsedUser.email,
        role: parsedUser.role,
      });
    }
  }, []);

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
          <h5 className="card-title">Email : {userData.email}</h5>
          <h5 className="card-title">Username : {userData.username}</h5>
          <h5 className="card-title">Role: {userData.role}</h5>
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
