import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useLocation } from "react-router-dom";
import "./viewjob.css";
import toast, { Toaster } from "react-hot-toast";
import Pagination from "../components/Pagination";
import Navigation from "../components/Navigation";
import { userAPI } from "../services/api";

export default function Viewjob() {
  const token = localStorage.getItem("token");
  const [data, setData] = useState([]);
  const [loading, setloading] = useState(true);
  const location = useLocation();

  // Function to load jobs data
  const loadJobsData = () => {
    setloading(true);
    userAPI.viewJobs()
      .then((response) => {
        setloading(false);
        console.log("Job data response:", response);
        
        if (response.data && Array.isArray(response.data.data)) {
          // Filter out any potentially corrupt/empty job items more strictly
          const validJobs = response.data.data.filter(job => 
            job && 
            job._id && 
            job.title && 
            job.title.trim() !== "" &&
            job.category &&
            job.budget
          );
          
          console.log("Valid jobs count:", validJobs.length);
          // Further deduplicate jobs by ID to prevent duplicates
          const uniqueJobs = Array.from(new Map(validJobs.map(job => [job._id, job])).values());
          setData(uniqueJobs);
        } else {
          console.warn("Invalid response format:", response);
          setData([]);
          toast.error("Could not load job data properly");
        }
      })
      .catch((error) => {
        setloading(false);
        console.error("Error loading jobs:", error);
        setData([]);
        toast.error("Error loading jobs: " + (error.response?.data?.message || "Unknown error"));
      });
  };

  // Load data on mount and when navigating back to this page
  useEffect(() => {
    // Force data refresh when coming from edit page
    if (location.state?.refresh) {
      console.log("Forcing job data refresh from edit page");
      // Clear the state to prevent repeated refreshes
      window.history.replaceState({}, document.title);
    }
    loadJobsData();
  }, [location]);

  const deleteJob = (jobId) => {
    userAPI.deleteJob(jobId)
      .then((response) => {
        console.log(response);
        const message = response.data.message;
        toast.success(message);
        
        // Reload the job list to get fresh data
        loadJobsData();
      })
      .catch((error) => {
        console.log(error);
        toast.error("Error deleting job");
      });
  };

  const [currentPage, setCurrentpage] = useState(1);
  const [postsPerpage, setPostsperpage] = useState(5);

  const lastPostindex = currentPage * postsPerpage;
  const firstPostindex = lastPostindex - postsPerpage;
  const currentPageposts = data.slice(firstPostindex, lastPostindex);
  return (
    <>
      <Navigation />
      <Toaster position="top-center" reverseOrder={false} />

      {loading ? (
        <>
          <div
            style={{
              width: "100%",
              height: "500px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        </>
      ) : (
        <>
          <div
            className="joblist-div container-fluid border border-2 rounded"
            style={{
              minHeight: "500px",
              marginTop: "50px",
              backgroundColor: "white",
              padding: "5px",
            }}
          >
            {data.length === 0 ? (
              <div className="text-center p-5">
                <h5>No jobs found</h5>
                <p>Create a new job posting to see it here</p>
              </div>
            ) : (
              currentPageposts.map((item) => (
                <div
                  key={item._id}
                  className="container-fluid border rounded"
                  style={{
                    width: "100%",
                    height: "120px",
                    display: "flex",
                    padding: "10px",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <div style={{ width: "50%" }} className="container">
                    <Link
                      to={`/singlejob/${item._id}`}
                      style={{ textDecoration: "none", color: "#333" }}
                      href="#"
                    >
                      <h5
                        className="jobtitle"
                        style={{ fontFamily: "serif", padding: "0px", margin: "0px" }}
                      >
                        {item.title || "Untitled Job"}
                      </h5>
                    </Link>
                    <p>{item.category || "Uncategorized"}</p>
                    {item.status == "1" ? (
                      <span className="badge text-bg-success">Approved</span>
                    ) : (
                      <span className="badge text-bg-danger">Pending</span>
                    )}
                  </div>

                  <div style={{ width: "25%" }}></div>

                  <div style={{ width: "25%" }}>
                    {item.status == "1" ? (
                      <div className="d-grid gap-1 col-6 mx-auto">
                        <Link
                          to={`/viewapplicantslist/${item._id}`}
                          style={{ height: "30px", padding: "0px" }}
                          className="btn btn-primary"
                          type="button"
                        >
                          Applicants
                        </Link>
                        <Link
                          to={`/editjob/${item._id}`}
                          style={{ height: "30px", padding: "0px" }}
                          className="btn btn-outline-secondary"
                          type="button"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => {
                            deleteJob(item._id);
                          }}
                          style={{ height: "30px", padding: "0px" }}
                          className="btn btn-outline-danger"
                          type="button"
                        >
                          Delete
                        </button>
                      </div>
                    ) : (
                      <div className="d-grid gap-1 col-6 mx-auto">
                        <Link
                          to={`/editjob/${item._id}`}
                          style={{ height: "30px", padding: "0px" }}
                          className="btn btn-outline-secondary"
                          type="button"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => {
                            deleteJob(item._id);
                          }}
                          style={{ height: "30px", padding: "0px" }}
                          className="btn btn-outline-danger"
                          type="button"
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
          <Pagination
            totalPosts={data.length}
            postsPerpage={postsPerpage}
            setCurrentPage={setCurrentpage}
            currentPage={currentPage}
          />
        </>
      )}
    </>
  );
}
