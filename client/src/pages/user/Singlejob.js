import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import Navigation from "../../components/Navigation";
import "./singlejob.css";
import { userAPI } from "../../services/api";

export default function Singlejob() {
  const token = localStorage.getItem("token");
  const { id } = useParams();
  const [data, setData] = useState({});
  const [address, setAddress] = useState({});
  const [testImageAccess, setTestImageAccess] = useState(null);
  const navigate = useNavigate();

  // Function to test image server access
  const testImageServer = () => {
    const testUrl = "http://localhost:5000/public/images/test-image.txt";
    console.log("Testing image server access:", testUrl);
    
    fetch(testUrl)
      .then(response => {
        console.log("Test image response status:", response.status);
        if (!response.ok) throw new Error(`Status: ${response.status}`);
        return response.text();
      })
      .then(text => {
        console.log("Test image content:", text);
        setTestImageAccess({ success: true, message: `Server accessible: ${text}` });
        toast.success("Image server is accessible");
      })
      .catch(error => {
        console.error("Test image access failed:", error);
        setTestImageAccess({ success: false, message: `Error: ${error.message}` });
        toast.error("Failed to access image server");
      });
  };

  useEffect(() => {
    // Test the image server when component mounts
    testImageServer();
    
    userAPI.profile({
        
      })
      .then((response) => {
        console.log(response);
        const data = response.data.data;
        setAddress(data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  useEffect(() => {
    userAPI.viewSingleJob(`${id}`)
      .then((response) => {
        console.log("Job data response:", response);
        const jobdata = response.data.data;
        setData(jobdata);
        
        // Log image path for debugging
        if (jobdata && jobdata.image) {
          console.log("Image path:", `http://localhost:5000/public/images/${jobdata.image}`);
        } else {
          console.log("No image available in job data");
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const deleteJob = (jobId) => {
    userAPI.deleteJob(`${jobId}`)
      .then((response) => {
        console.log(response);

        const message = response.data.message;
        toast.success(message);

        setTimeout(() => {
          navigate("/viewjob");
        }, 2000);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <>
      <Navigation />
      <Toaster position="top-center" reverseOrder={false} />

      <div
        className="viewjob-div container-fluid border rounded  mt-5 p-2"
        style={{ height: "100%", backgroundColor: "white" }}
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
            <p>{address.city}</p>
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
          <div className="border rounded" style={{ width: "100%", height: "250px", display: "flex", justifyContent: "center", alignItems: "center", overflow: "hidden", position: "relative" }}>
            {data.image ? (
              <img 
                src={`http://localhost:5000/public/images/${data.image}`} 
                alt="Job"
                style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }}
                onError={(e) => {
                  console.error("Image failed to load:", data.image);
                  console.error("Full image URL:", `http://localhost:5000/public/images/${data.image}`);
                  e.target.onerror = null;
                  e.target.src = "https://via.placeholder.com/400x300?text=Image+Not+Available";
                }}
              />
            ) : (
              <p className="text-muted m-0">No image available</p>
            )}
            <div style={{ position: 'absolute', bottom: '5px', right: '5px', fontSize: '10px', color: '#999' }}>
              {data.image ? `Image ID: ${data.image}` : 'No image'} 
              {testImageAccess && (
                <span style={{ marginLeft: '10px', color: testImageAccess.success ? 'green' : 'red' }}>
                  {testImageAccess.success ? '✓' : '✗'}
                </span>
              )}
            </div>
          </div>

          <h6 className="mt-5">Customer details</h6>
          <div className="border rounded p-4" style={{ width: "100%", height: "220px" }}>
            <div>
              <p>{address.name}</p>
              <p>
                {address.house},{address.street}
                <br />
                {address.town},{address.city}
                <br />
                {address.district},{address.state}
                <br />
                {address.pincode}
              </p>
            </div>
            <div style={{ textAlign: "center" }}>
              <div class="btn-group" role="group" aria-label="Basic outlined example">
                <button type="button" class="btn btn-outline-primary">
                  Edit
                </button>

                <button
                  onClick={() => {
                    deleteJob(data._id);
                  }}
                  type="button"
                  class="btn btn-outline-primary"
                >
                  Delete
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
