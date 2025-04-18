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
  const [messageText, setMessageText] = useState("");
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

  const handleInputChange = (e) => {
    setMessageText(e.target.value);
  };

  const sendMessage = () => {
    if (!messageText.trim()) {
      toast.error("Message cannot be empty");
      return;
    }
    
    setLoading(true);
    
    const replyData = {
      message: messageText
    };
    
    messageAPI.saveReplyMessage(id, replyData)
      .then((response) => {
        // Clear input field
        setMessageText("");
        
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

      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: 'calc(100vh - 70px)',
        backgroundColor: '#f8f9fa'
      }}>
        <div style={{
          width: '90%',
          maxWidth: '800px',
          borderRadius: '20px',
          overflow: 'hidden',
          boxShadow: '0 12px 28px rgba(0, 0, 0, 0.12)',
          display: 'flex',
          flexDirection: 'column',
          height: '80vh',
          backgroundColor: 'white',
          border: '1px solid #e1e1e1'
        }}>
          <div style={{
            backgroundColor: '#6c5ce7',
            padding: '15px 20px',
            display: 'flex',
            alignItems: 'center'
          }}>
            <div style={{
              width: '46px',
              height: '46px',
              borderRadius: '50%',
              backgroundColor: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: '12px',
              fontSize: '20px',
              color: '#6c5ce7',
              fontWeight: 'bold'
            }}>
              {userData.name ? userData.name.charAt(0).toUpperCase() : "U"}
            </div>
            <div>
              <div style={{
                color: 'white',
                fontSize: '16px',
                fontWeight: '600',
                margin: '0',
                padding: '0'
              }}>{userData.name || "User"}</div>
              <div style={{
                color: 'rgba(255,255,255,0.7)',
                fontSize: '14px'
              }}>{userData.email || "user@example.com"}</div>
            </div>
          </div>

          <div ref={chatContainerRef} style={{
            flex: 1,
            padding: '20px',
            overflowY: 'auto',
            backgroundColor: '#f5f7fb'
          }}>
            {data.length === 0 ? (
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100%',
                color: '#888'
              }}>
                <i className="bi bi-chat-dots" style={{ fontSize: '30px', marginBottom: '10px' }}></i>
                <p style={{ margin: '5px 0' }}>No messages yet</p>
                <small>Start the conversation by sending a message</small>
              </div>
            ) : (
              data.map((item, index) => (
                <div key={index} style={{ marginBottom: '12px' }}>
                  {item.type === "reply" ? (
                    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                      <div style={{
                        backgroundColor: '#6c5ce7',
                        color: 'white',
                        borderRadius: '18px',
                        padding: '8px 15px',
                        maxWidth: '70%',
                        boxShadow: '0 1px 1px rgba(0, 0, 0, 0.05)'
                      }}>
                        <div>{item.message}</div>
                        <div style={{
                          fontSize: '11px',
                          color: 'rgba(255, 255, 255, 0.7)',
                          textAlign: 'right',
                          marginTop: '2px'
                        }}>
                          {new Date(parseInt(item.time)).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                      <div style={{
                        backgroundColor: 'rgba(243, 243, 243, 0.95)',
                        color: '#333',
                        borderRadius: '18px',
                        padding: '8px 15px',
                        maxWidth: '70%',
                        boxShadow: '0 1px 1px rgba(0, 0, 0, 0.05)'
                      }}>
                        <div>{item.message}</div>
                        <div style={{
                          fontSize: '11px',
                          color: '#888',
                          textAlign: 'right',
                          marginTop: '2px'
                        }}>
                          {new Date(parseInt(item.time)).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>

          <div style={{
            padding: '15px 20px',
            borderTop: '1px solid #f0f0f0',
            backgroundColor: 'white'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              backgroundColor: '#f5f7fb',
              borderRadius: '30px',
              padding: '5px'
            }}>
              <input
                type="text"
                value={messageText}
                onChange={handleInputChange}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                disabled={loading}
                style={{
                  flex: 1,
                  border: 'none',
                  padding: '8px 15px',
                  borderRadius: '30px',
                  outline: 'none',
                  backgroundColor: '#f5f7fb',
                  fontSize: '14px'
                }}
              />
              <button
                onClick={sendMessage}
                disabled={loading}
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  backgroundColor: '#6c5ce7',
                  color: 'white',
                  border: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer'
                }}
              >
                {loading ? (
                  <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-send-fill" viewBox="0 0 16 16">
                    <path d="M15.964.686a.5.5 0 0 0-.65-.65L.767 5.855H.766l-.452.18a.5.5 0 0 0-.082.887l.41.26.001.002 4.995 3.178 3.178 4.995.002.002.26.41a.5.5 0 0 0 .886-.083zm-1.833 1.89L6.637 10.07l-.215-.338a.5.5 0 0 0-.154-.154l-.338-.215 7.494-7.494 1.178-.471z"/>
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
