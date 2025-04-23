import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import Navigation from "../../components/Navigation";
import { businessAPI } from "../../services/api"; // Import businessAPI
import toast, { Toaster } from "react-hot-toast";

export default function Viewapplication() {
  const { id } = useParams();
  const [data, setData] = useState({});
  console.log(id);

  useEffect(() => {
    businessAPI
      .viewApplication(`${id}`) // Use businessAPI here
      .then((response) => {
        console.log(response);
        const data = response.data.data;
        setData(data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const handleCall = () => {
    if (!data.phoneNumber) {
      toast.error("Phone number not available");
      return;
    }
    window.location.href = `tel:${data.phoneNumber}`;
    toast.success("Initiating call...");
  };

  const handleEmail = () => {
    if (!data.email) {
      toast.error("Email not available");
      return;
    }
    window.location.href = `mailto:${data.email}?subject=Regarding your job application`;
    toast.success("Opening email client...");
  };

  return (
    <>
      <Navigation />
      <Toaster position="top-center" />

      <div
        className="container-fluid border rounded  mt-5 p-2"
        style={{ width: "70%", height: "100%", backgroundColor: "white" }}
      >
        <div
          className="container-fluid "
          style={{
            width: "100%",
            height: "100px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <h5>{data.title}</h5>
        </div>
        <div
          className="p-2 border rounded-3"
          style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}
        >
          <div>
            <span style={{ fontSize: "small", fontFamily: "serif" }}>category</span>
            <p>{data.category}</p>
          </div>
          <div>
            <span style={{ fontSize: "small", fontFamily: "serif" }}>city</span>
            <p>{data.city}</p>
          </div>
          <div>
            <span style={{ fontSize: "small", fontFamily: "serif" }}>date</span>
            <p>{data.city}</p>
          </div>
          <div>
            <span style={{ fontSize: "small", fontFamily: "serif" }}>budget</span>
            <p>{data.budget}</p>
          </div>
        </div>
        <div className="p-2 mt-4">
          <h6>Description</h6>
          <p style={{ textAlign: "justify" }}>{data.description}</p>

          <h6 className="mt-5">Images</h6>
          <div className="border rounded" style={{ width: "100%", height: "250px", display: "flex", justifyContent: "center", alignItems: "center", overflow: "hidden" }}>
            {data.image ? (
              <img 
                src={`http://localhost:5000/images/${data.image}`}
                alt="Job Image"
                style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }}
                onError={(e) => {
                  console.error("Image failed to load:", data.image);
                  e.target.onerror = null;
                  e.target.src = "https://via.placeholder.com/400x300?text=Image+Not+Available";
                }}
              />
            ) : (
              <p className="text-muted m-0">No image available</p>
            )}
          </div>

          <h6 className="mt-5">Customer details</h6>
          <div className="border rounded p-4" style={{ width: "100%", height: "220px" }}>
            <div>
              <p>{data.name}</p>
              <p>
                {data.house},{data.street}
                <br />
                {data.town},{data.city}
                <br />
                {data.district},{data.state}
                <br />
                {data.pincode}
              </p>
            </div>
          </div>
          <div className="mt-3" style={{ textAlign: "center" }}>
            <div className="btn-group btn-group-sm" role="group" aria-label="Small button group">
              <button 
                type="button" 
                className="btn btn-outline-primary"
                onClick={handleCall}
              >
                Call
              </button>
              <button 
                type="button" 
                className="btn btn-outline-primary"
                onClick={handleEmail}
              >
                Email
              </button>
              <Link
                to={data.userId ? `/viewmessage/${data.userId}` : "#"} 
                className="btn btn-outline-primary"
                onClick={(e) => {
                  if (!data.userId) {
                    e.preventDefault();
                    toast.error("Cannot message this user");
                  }
                }}
              >
                Message
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div style={{ minHeight: "300px" }}></div>
    </>
  );
}
