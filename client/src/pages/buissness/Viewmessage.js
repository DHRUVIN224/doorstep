import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Navigation from "../../components/Navigation";
import { messageAPI, businessAPI } from "../../services/api";
import toast, { Toaster } from "react-hot-toast";
import "./messages.css";

export default function Viewmessage() {
  const token = localStorage.getItem("token");
  const { id } = useParams();

  const [data, setData] = useState([]);
  const [userData, setUserdata] = useState({});
  const [loading, setLoading] = useState(false);
  const messageInputRef = useRef(null);
  const chatContainerRef = useRef(null);

  const fetchMessages = () => {
    messageAPI.viewChatMessage(id)
      .then((response) => {
        const messageData = response.data.data;
        const sortData = messageData.sort((a, b) => parseInt(a.time) - parseInt(b.time));
        setData(sortData);
        
        // Scroll to bottom of chat when messages update
        setTimeout(() => {
          if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
          }
        }, 100);
      })
      .catch((error) => {
        console.log(error);
        toast.error("Failed to load messages");
      });
  };

  useEffect(() => {
    fetchMessages();
    
    // Set up auto-refresh of messages every 5 seconds
    const interval = setInterval(() => {
      fetchMessages();
    }, 5000);
    
    return () => clearInterval(interval);
  }, [id]);

  useEffect(() => {
    businessAPI.viewUserDetails(id)
      .then((response) => {
        const data = response.data.data;
        setUserdata(data);
      })
      .catch((error) => {
        console.log(error);
        toast.error("Failed to load user details");
      });
  }, [id]);

  const [replyData, setReplydata] = useState({
    message: "",
  });

  const inputChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;

    setReplydata({ ...replyData, [name]: value });
  };

  const sendMessage = () => {
    if (!replyData.message.trim()) {
      toast.error("Message cannot be empty");
      return;
    }
    
    setLoading(true);
    messageAPI.saveReplyMessage(id, replyData)
      .then((response) => {
        // Clear input field
        setReplydata({ message: "" });
        if (messageInputRef.current) {
          messageInputRef.current.value = "";
        }
        
        // Refresh messages
        fetchMessages();
        setLoading(false);
        toast.success("Message sent");
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
        toast.error("Failed to send message");
      });
  };
  
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      <Navigation />
      <Toaster position="top-center" />

      <div className="container-fluid chat-page-container">
        <div className="row justify-content-center h-100 mx-0">
          <div className="col-12 d-flex flex-column">
            <div className="card message-card shadow border-0">
              <div className="business-header">
                <div className="business-info">
                  <div className="business-avatar">
                    {userData.name ? userData.name.charAt(0).toUpperCase() : "U"}
                  </div>
                  <div className="business-name">
                    <h5>{userData.name}</h5>
                    <small>{userData.email}</small>
                  </div>
                </div>
              </div>

              <div 
                ref={chatContainerRef}
                className="chat-container" 
              >
                {data.length === 0 ? (
                  <div className="empty-chat">
                    <i className="bi bi-chat-dots"></i>
                    <p>No messages yet</p>
                    <p className="small">Start the conversation by sending a message</p>
                  </div>
                ) : (
                  data.map((item, index) => (
                    <div key={index} className="mb-3">
                      {item.type === "reply" ? (
                        <div className="d-flex justify-content-end">
                          <div className="message-bubble message-sent">
                            <p className="mb-0">{item.message}</p>
                            <div className="message-time">
                              {new Date(parseInt(item.time)).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="d-flex justify-content-start">
                          <div className="message-bubble message-received">
                            <p className="mb-0">{item.message}</p>
                            <div className="message-time">
                              {new Date(parseInt(item.time)).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>

              <div className="chat-input">
                <div className="input-group">
                  <input
                    ref={messageInputRef}
                    onChange={inputChange}
                    onKeyPress={handleKeyPress}
                    type="text"
                    className="form-control"
                    name="message"
                    placeholder="Type a message..."
                    aria-label="Type a message"
                    value={replyData.message}
                    disabled={loading}
                  />
                  <button 
                    onClick={sendMessage} 
                    className="btn" 
                    type="button" 
                    disabled={loading}
                  >
                    {loading ? (
                      <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                    ) : (
                      <i className="bi bi-send-fill"></i>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
