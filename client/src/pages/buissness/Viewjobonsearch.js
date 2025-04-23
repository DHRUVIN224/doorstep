import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import Navigation from "../../components/Navigation";
import "./viewjobonsearch.css";
import { businessAPI } from "../../services/api";

export default function Viewjobonsearch() {
  const [jobData, setJobData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { id } = useParams();

  useEffect(() => {
    if (!id) {
      setError("No job ID provided");
      setLoading(false);
      return;
    }

    businessAPI.viewJobOnSearch(id)
      .then((response) => {
        if (response.data && response.data.data) {
          setJobData(response.data.data);
        } else {
          setError("No data received");
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching job:", error);
        setError("Failed to load job details");
        setLoading(false);
      });
  }, [id]);

  const sendApplication = (jobId) => {
    if (!jobId) {
      toast.error("Invalid job ID");
      return;
    }

    const applicationPayload = {
      jobId: jobId,
      // Include any other required fields for the application
    };

    businessAPI.apply(jobId, applicationPayload)
      .then((response) => {
        toast.success(response.data.message || "Application submitted successfully");
      })
      .catch((error) => {
        console.error("Application error:", error);
        toast.error(error.response?.data?.message || "Failed to submit application");
      });
  };

  const handleCall = () => {
    if (!jobData || !jobData.phoneNumber) {
      toast.error("Phone number not available");
      return;
    }
    window.location.href = `tel:${jobData.phoneNumber}`;
    toast.success("Initiating call...");
  };

  const handleEmail = () => {
    if (!jobData || !jobData.email) {
      toast.error("Email not available");
      return;
    }
    window.location.href = `mailto:${jobData.email}?subject=Regarding your job listing`;
    toast.success("Opening email client...");
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!jobData) return <div>No job data found</div>;

  return (
    <>
      <Navigation />
      <Toaster position="top-center" reverseOrder={false} />

      <div className="vj-main-div container-fluid border rounded mt-5 p-2">
        <div className="container-fluid" style={{
          width: "100%",
          height: "100px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}>
          <h5>{jobData.title}</h5>
        </div>
        <div
          className="p-2 border rounded-3"
          style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}
        >
          <div>
            <span style={{ fontSize: "small", fontFamily: "serif" }}>category</span>
            <p>{jobData.category}</p>
          </div>
          <div>
            <span style={{ fontSize: "small", fontFamily: "serif" }}>city</span>
            <p>{jobData.city}</p>
          </div>
          <div>
            <span style={{ fontSize: "small", fontFamily: "serif" }}>date</span>
            <p>{jobData.city}</p>
          </div>
          <div>
            <span style={{ fontSize: "small", fontFamily: "serif" }}>budget</span>
            <p>{jobData.budget}</p>
          </div>
        </div>
        <div className="p-2 mt-4">
          <h6>Description</h6>
          <p style={{ textAlign: "justify" }}>{jobData.description}</p>

          <h6 className="mt-5">Images</h6>
          <div className="border rounded" style={{ width: "100%", height: "250px", display: "flex", justifyContent: "center", alignItems: "center", overflow: "hidden" }}>
            {jobData.image ? (
              <img 
                src={`http://localhost:5000/images/${jobData.image}`} 
                alt="Job"
                style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }}
                onError={(e) => {
                  console.error("Image failed to load:", jobData.image);
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
              <p>{jobData.name}</p>
              <p>
                {jobData.house},{jobData.street}
                <br />
                {jobData.town},{jobData.city}
                <br />
                {jobData.district},{jobData.state}
                <br />
                {jobData.pincode}
              </p>
            </div>
            
            <div className="mt-3 d-flex justify-content-center">
              <div className="btn-group" role="group" aria-label="Contact Options">
                <button 
                  type="button" 
                  className="btn btn-outline-success"
                  onClick={handleCall}
                >
                  Call
                </button>
                <Link
                  to={jobData.userId ? `/viewmessage/${jobData.userId}` : "#"} 
                  className="btn btn-outline-success"
                  onClick={(e) => {
                    if (!jobData.userId) {
                      e.preventDefault();
                      toast.error("Cannot message this user");
                    }
                  }}
                >
                  Message
                </Link>
                <button 
                  type="button" 
                  className="btn btn-outline-success"
                  onClick={handleEmail}
                >
                  Email
                </button>
              </div>
            </div>
          </div>
          <div className="mt-3" style={{ textAlign: "center" }}>
            <button
              onClick={() => {
                sendApplication(jobData._id);
              }}
              className="btn btn-primary"
            >
              Apply
            </button>
          </div>
        </div>
      </div>

      <div style={{ minHeight: "300px" }}></div>
    </>
  );
}