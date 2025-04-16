import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import "./viewapplicantlist.css";
import Navigation from "../../components/Navigation";
import { userAPI } from "../../services/api";
import toast, { Toaster } from "react-hot-toast";

export default function Viewapplicantslist() {
  const { id } = useParams(); // jobid
  console.log("jobid:", id);

  const [data, setData] = useState([]);

  const fetchApplications = () => {
    userAPI.viewJobApplications(`${id}`)
      .then((response) => {
        console.log("response:", response);
        const data = response.data.data;
        setData(data);
      })
      .catch((error) => {
        console.log(error);
        toast.error("Failed to fetch applications");
      });
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const approve = (businessId) => {
    if (!businessId || !id) {
      toast.error("Invalid application or job ID");
      return;
    }

    userAPI.approveJobApplication(businessId, id)
      .then((response) => {
        console.log("Approval response:", response);
        toast.success(response.data.message || "Application approved successfully");
        // Refresh the list after successful approval
        fetchApplications();
      })
      .catch((error) => {
        console.error("Approval error:", error);
        toast.error(error.response?.data?.message || "Failed to approve application");
      });
  };

  return (
    <>
      <Navigation />
      <Toaster position="top-center" reverseOrder={false} />
      <div
        className="mm container-fluid border rounded p-2"
        style={{ width: "50%", height: "550px", marginTop: "50px" }}
      >
        {data.length === 0 ? (
          <div className="text-center p-5">
            <h5>No applications found</h5>
          </div>
        ) : (
          data.map((item) => (
            <div
              key={item._id}
              className="border rounded p-3"
              style={{
                width: "100%",
                height: "90px",
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <div style={{ width: "40%" }}>
                <Link
                  className="buissnessname"
                  style={{ textDecoration: "none" }}
                  to={`/viewapplicantprofile/${item.loginId}/${id}`}
                >
                  {item.name}
                </Link>
                <p>{item.category}</p>
              </div>
              <div className="p-3" style={{ width: "35%", textAlign: "center" }}>
                <p>{item.city}</p>
              </div>
              <div className="pt-2 " style={{ width: "25%", textAlign: "right" }}>
                <button
                  onClick={() => {
                    approve(item.loginId);
                  }}
                  className="btn btn-primary"
                  disabled={item.status === "1"}
                >
                  {item.status === "1" ? "Approved" : "Approve"}
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </>
  );
}
