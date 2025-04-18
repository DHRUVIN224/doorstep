import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { businessAPI, messageAPI } from "../../services/api";
import toast, { Toaster } from "react-hot-toast";
import Pagination from "../../components/Pagination";
import Navigation from "../../components/Navigation";
import "./enquiries.css";

export default function Enquiries() {
  const token = localStorage.getItem("token");
  const [data, setData] = useState([]);
  useEffect(() => {
    // Replace direct axios call with businessAPI
    businessAPI.viewEnquiries()
      .then((response) => {
        console.log(response, "response");
        const bookingData = response.data.data;
        setData(bookingData);

        const datanumber = response.data.data.length;
        console.log("length", datanumber);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const updateStatus = (bookingId) => {
    businessAPI.acceptBooking(`${bookingId}`)
      .then((response) => {
        console.log(response);

        const filterData = data.filter((obj) => {
          return obj._id != bookingId;
        });
        setData(filterData);

        const message = response.data.message;
        console.log("message", message);
        toast.success(message);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const rejectBooking = (bookingId) => {
    businessAPI.rejectBooking(`${bookingId}`)
      .then((response) => {
        console.log(response);
        const message = response.data.message;

        const filterData = data.filter((obj) => {
          return obj._id != bookingId;
        });
        setData(filterData);
        console.log("message", message);
        toast.error(message);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleCall = (phoneNumber) => {
    if (!phoneNumber) {
      toast.error("Phone number not available");
      return;
    }
    window.location.href = `tel:${phoneNumber}`;
    toast.success("Initiating call...");
  };

  const handleEmail = (email) => {
    if (!email) {
      toast.error("Email not available");
      return;
    }
    window.location.href = `mailto:${email}?subject=Regarding your booking enquiry`;
    toast.success("Opening email client...");
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
      <div className="enquiries-div border rounded p-2">
        {currentPageposts.map((item) => (
          <div
            className="border rounded p-2 mb-3"
            style={{
              backgroundColor: "white",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div className="d-flex align-items-center mb-2">
              <div className="flex-grow-1">
                <h5>{item.title}</h5>
                <p>
                  {item.jobtype}
                  <br />
                  {item.date}
                  <br /> <br />
                  Description : <br />
                  {item.description}
                </p>
              </div>

              <div className="d-flex flex-column align-items-end">
                <div className="mb-2">
                  <button
                    onClick={() => {
                      updateStatus(item._id);
                    }}
                    className="btn btn-primary me-2"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => {
                      rejectBooking(item._id);
                    }}
                    className="btn btn-danger"
                  >
                    Reject
                  </button>
                </div>

                <div className="btn-group btn-group-sm" role="group" aria-label="Contact options">
                  <button 
                    type="button" 
                    className="btn btn-outline-primary"
                    onClick={() => handleCall(item.phoneNumber)}
                  >
                    Call
                  </button>
                  <Link
                    to={`/viewmessage/${item.userId}`}
                    type="button"
                    className="btn btn-outline-primary"
                  >
                    Message
                  </Link>
                  <button 
                    type="button" 
                    className="btn btn-outline-primary"
                    onClick={() => handleEmail(item.email)}
                  >
                    Email
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <Pagination
        totalPosts={data.length}
        postsPerpage={postsPerpage}
        setCurrentPage={setCurrentpage}
        currentPage={currentPage}
      />
    </>
  );
}
