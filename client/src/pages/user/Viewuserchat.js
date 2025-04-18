import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Navigation from "../../components/Navigation";
import { userAPI, messageAPI } from "../../services/api";
import toast, { Toaster } from "react-hot-toast";
import "../buissness/messages.css";

export default function Viewuserchat() {
  const { id } = useParams();
  const token = localStorage.getItem("token");
  const [data, setData] = useState([]);
  const [buissnessData, setBusinessdata] = useState({});
  const [loading, setLoading] = useState(false);
  const messageInputRef = useRef(null);
  const chatContainerRef = useRef(null);

  const fetchMessages = () => {
    messageAPI.viewUserChat(id)
      .then((response) => {
        const message = response.data.data;
        const sortData = message.sort((a, b) => parseInt(a.time) - parseInt(b.time));
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
    userAPI.viewBusinessDetails(id)
      .then((response) => {
        const data = response.data.data;
        setBusinessdata(data);
      })
      .catch((error) => {
        console.log(error);
        toast.error("Failed to load business details");
      });
  }, [id]);

  const [messageData, setMessageData] = useState({
    message: "",
  });

  const inputChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setMessageData({ ...messageData, [name]: value });
  };
  
  const sendMessage = () => {
    if (!messageData.message.trim()) {
      toast.error("Message cannot be empty");
      return;
    }
    
    setLoading(true);
    messageAPI.sendMessage(id, messageData)
      .then((response) => {
        // Clear input field
        setMessageData({ message: "" });
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

  // Format date for message separators
  const formatDate = (timestamp) => {
    const date = new Date(parseInt(timestamp));
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  // Group messages by date
  const groupMessagesByDate = () => {
    const groups = {};
    data.forEach(message => {
      const date = formatDate(message.time);
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(message);
    });
    return groups;
  };

  const messageGroups = groupMessagesByDate();

  return (
    <>
      <Navigation />
      <Toaster position="top-center" />

      <div className="container chat-page-container" style={{ marginTop: '20px', marginBottom: '20px', height: 'auto' }}>
        <div className="row justify-content-center">
          <div className="col-md-10 col-lg-8">
            <div className="card message-card shadow" style={{ maxHeight: '70vh', minHeight: '60vh' }}>
              <div className="business-header" style={{ height: '70px', padding: '15px 20px' }}>
                <div className="business-info">
                  <div className="business-avatar" style={{ width: '40px', height: '40px', fontSize: '18px' }}>
                    {buissnessData.businessname ? buissnessData.businessname.charAt(0).toUpperCase() : "B"}
                  </div>
                  <div className="business-name">
                    <h5 style={{ fontSize: '1rem' }}>{buissnessData.businessname}</h5>
                    <small style={{ fontSize: '0.8rem' }}>{buissnessData.category}</small>
                  </div>
                </div>
              </div>

              <div 
                ref={chatContainerRef}
                className="chat-container" 
                style={{ flex: 1, minHeight: '300px', maxHeight: 'calc(70vh - 150px)', overflow: 'auto' }}
              >
                {data.length === 0 ? (
                  <div className="empty-chat">
                    <i className="bi bi-chat-dots" style={{ fontSize: '2.5rem' }}></i>
                    <p>No messages yet</p>
                    <small>Start the conversation by sending a message</small>
                  </div>
                ) : (
                  Object.entries(messageGroups).map(([date, messages]) => (
                    <div key={date}>
                      <div className="message-date-separator" style={{ margin: '12px 0' }}>
                        <span style={{ fontSize: '11px' }}>{date}</span>
                      </div>
                      {messages.map((item, index) => (
                        <div key={index} className="mb-2">
                          {item.type === "sent" ? (
                            <div className="d-flex justify-content-end">
                              <div className="message-bubble message-sent" style={{ maxWidth: '65%', padding: '8px 12px', fontSize: '13px' }}>
                                <p className="mb-0">{item.message}</p>
                                <div className="message-time" style={{ fontSize: '9px' }}>
                                  {new Date(parseInt(item.time)).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                </div>
                              </div>
                            </div>
                          ) : (
                            <div className="d-flex justify-content-start">
                              <div className="message-bubble message-received" style={{ maxWidth: '65%', padding: '8px 12px', fontSize: '13px' }}>
                                <p className="mb-0">{item.message}</p>
                                <div className="message-time" style={{ fontSize: '9px' }}>
                                  {new Date(parseInt(item.time)).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ))
                )}
              </div>

              <div className="chat-input" style={{ padding: '12px' }}>
                <div className="input-group">
                  <input
                    ref={messageInputRef}
                    onChange={inputChange}
                    onKeyPress={handleKeyPress}
                    type="text"
                    className="form-control"
                    name="message"
                    placeholder="Type your message..."
                    aria-label="Type your message"
                    value={messageData.message}
                    disabled={loading}
                    style={{ padding: '8px 15px', fontSize: '13px' }}
                  />
                  <button 
                    onClick={sendMessage} 
                    className="btn btn-primary d-flex align-items-center justify-content-center" 
                    type="button" 
                    disabled={loading}
                    style={{ width: 'auto', borderRadius: '0 30px 30px 0', padding: '0 15px', height: '38px' }}
                  >
                    {loading ? (
                      <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                    ) : (
                      <>
                        <i className="bi bi-send-fill me-2"></i>
                        Send
                      </>
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
