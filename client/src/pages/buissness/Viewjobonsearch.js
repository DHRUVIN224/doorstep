import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
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
          <div className="border rounded" style={{ width: "100%", height: "250px" }}></div>

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