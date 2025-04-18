import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navigation from "../../components/Navigation";
import { messageAPI } from "../../services/api";
import toast, { Toaster } from "react-hot-toast";
import "../buissness/messages.css";

export default function Usermessage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    messageAPI
      .viewMessage()
      .then((response) => {
        const messageData = response.data.data;
        setData(messageData);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        toast.error("Failed to load messages");
        setLoading(false);
      });
  }, []);

  return (
    <>
      <Navigation />
      <Toaster position="top-center" />
      
      <div className="container-fluid mt-4 mb-5">
        <div className="row justify-content-center">
          <div className="col-12">
            <div className="card message-card shadow">
              <div className="card-header d-flex align-items-center">
                <i className="bi bi-chat-left-text-fill me-2" style={{ fontSize: "1.4rem" }}></i>
                <h5 className="mb-0" style={{ fontSize: "1.4rem" }}>My Messages</h5>
              </div>
              
              <div className="card-body p-0">
                {loading ? (
                  <div className="text-center py-5">
                    <div className="spinner-border text-primary" role="status" style={{ width: "3rem", height: "3rem" }}>
                      <span className="visually-hidden">Loading...</span>
                    </div>
                    <p className="mt-3" style={{ fontSize: "1.2rem" }}>Loading your messages...</p>
                  </div>
                ) : data.length === 0 ? (
                  <div className="text-center py-5">
                    <div className="text-muted">
                      <i className="bi bi-inbox fs-1" style={{ fontSize: "3rem" }}></i>
                      <p className="mt-3" style={{ fontSize: "1.2rem" }}>No messages yet</p>
                      <p style={{ fontSize: "1rem" }}>When you message service providers, they'll appear here</p>
                    </div>
                  </div>
                ) : (
                  <div className="list-group list-group-flush">
                    {data.map((item, index) => (
                      <Link 
                        key={index}
                        to={`/viewuserchat/${item.loginId}`} 
                        className="message-item list-group-item list-group-item-action"
                      >
                        <div className="d-flex align-items-center">
                          <div className="avatar-circle me-3">
                            {item.businessname ? item.businessname.charAt(0).toUpperCase() : "?"}
                          </div>
                          <div className="flex-grow-1">
                            <h6 className="mb-1" style={{ fontSize: "1.2rem" }}>{item.businessname}</h6>
                            <small className="text-muted" style={{ fontSize: "1rem" }}>Click to view conversation</small>
                          </div>
                          <span className="message-arrow">
                            <i className="bi bi-chevron-right"></i>
                          </span>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
