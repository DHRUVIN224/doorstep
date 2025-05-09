import React, { useEffect, useState } from "react";
import "./viewjoblisting.css";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import Navigation from "../../components/Navigation";
import { businessAPI } from "../../services/api"; // Import businessAPI
import toast, { Toaster } from "react-hot-toast";

export default function Viewjoblisting() {
  const { id } = useParams();

  console.log("id:", id);

  useEffect(() => {
    businessAPI
      .viewJobDetails(`${id}`) // Use businessAPI here
      .then((response) => {
        console.log("response logged", response);
        const jobdata = response.data.data;
        setData(jobdata);
        console.log("jobdata", jobdata);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const [data, setData] = useState({});

  const handleApply = () => {
    businessAPI.apply(id, {})
      .then(response => {
        toast.success("Application submitted successfully");
      })
      .catch(error => {
        console.error(error);
        toast.error("Failed to submit application");
      });
  };

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
    window.location.href = `mailto:${data.email}?subject=Regarding your job listing`;
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
          <button onClick={handleApply} className="btn btn-primary"></button>
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
            <p>{data.date}</p>
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
          <div className="border rounded" style={{ width: "100%", height: "250px" }}></div>

          <h6 className="mt-5">Customer details</h6>
          <div className="border rounded p-4" style={{ width: "100%", height: "220px" }}>
            <div>
              <p><strong>Name:</strong> {data.userName || 'Not available'}</p>
              <p>
                {data.address || 'Address not available'}
                <br />
                {data.city && data.state ? 
                  `${data.city}, ${data.state}${data.pincode ? ', ' + data.pincode : ''}` : 
                  'Location not available'}
              </p>
            </div>
            <div style={{ textAlign: "center", marginTop: "20px" }}>
              <div className="btn-group" role="group" aria-label="Basic outlined example">
                <button 
                  type="button" 
                  className="btn btn-outline-primary"
                  onClick={handleCall}
                >
                  Call
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
                <button 
                  type="button" 
                  className="btn btn-outline-primary"
                  onClick={handleEmail}
                >
                  Email
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div style={{ minHeight: "300px" }}></div>
    </>
  );
}
