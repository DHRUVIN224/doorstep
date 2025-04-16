import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import Navigation from "../../components/Navigation";
import "./viewjobapproval.css";
import Loading from "../../components/Loading";
import { adminAPI } from "../../services/api";

export default function Viewjobapproval() {
  const { id } = useParams();
  const navigate = useNavigate();
  console.log(id);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminAPI.viewJobPost(`${id}`)
      .then((response) => {
        console.log("resssss", response);
        console.log("hi");
        const data = response.data.data;
        setData(data);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const [data, setData] = useState({});

  const updateStatus = (jobID) => {
    adminAPI.updateJobStatus(`${jobID}`)
      .then((response) => {
        console.log(response);
        const message = response.data.message;
        toast.success(message);
        setTimeout(() => {
          navigate("/jobapprovals");
        }, 2000);
      })
      .catch((error) => {
        console.log(error);
        toast.error(error.response?.data?.message || "Failed to approve job");
      });
  };

  const rejectStatus = (jobID) => {
    if (!jobID) {
      toast.error("Invalid job ID");
      return;
    }

    adminAPI.rejectJobStatus(jobID)
      .then((response) => {
        console.log("Reject response:", response);
        if (response.data.success) {
          toast.success(response.data.message);
          setTimeout(() => {
            navigate("/jobapprovals");
          }, 2000);
        } else {
          toast.error(response.data.message || "Failed to reject job");
        }
      })
      .catch((error) => {
        console.error("Reject error:", error);
        toast.error(error.response?.data?.message || "Failed to reject job");
      });
  };

  return (
    <>
      <Navigation />
      <Toaster position="top-center" reverseOrder={false} />

      {loading ? (
        <>
          {" "}
          <Loading />{" "}
        </>
      ) : (
        <>
          <div className="vja-main-div container-fluid border rounded  mt-5 p-2">
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
              {/* <button className="btn btn-primary">Apply</button> */}
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
                <div style={{ textAlign: "center" }}>
                  <div class="btn-group" role="group" aria-label="Basic outlined example">
                    <button
                      onClick={() => {
                        updateStatus(data._id);
                      }}
                      type="button"
                      class="btn btn-outline-success"
                    >
                      Approve
                    </button>
                    <button 
                      onClick={() => {
                        rejectStatus(data._id);
                      }}
                      type="button" 
                      class="btn btn-outline-danger"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      <div style={{ minHeight: "300px" }}></div>
    </>
  );
}
