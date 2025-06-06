import React, { useEffect, useState } from "react";
import "./buissnessverification.css";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import Navigation from "../../components/Navigation";
import Loading from "../../components/Loading";
import { adminAPI } from "../../services/api"; // Adjust the path based on your project structure

export default function Buissnessverification() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminAPI.viewBusinessProfile(`${id}`)
      .then((response) => {
        console.log(response);
        const data = response.data.data;
        setData(data);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const approve = (loginId) => {
    adminAPI.updateStatus(loginId)
      .then((response) => {
        console.log(response);
        const message = response.data.message;
        toast.success(message);

        setTimeout(() => {
          navigate("/verifications");
        }, 2000);
      })
      .catch((error) => {
        console.log(error);
        toast.error("Failed to approve business: " + error.message);
      });
  };

  const reject = (loginId) => {
    adminAPI.rejectStatus(loginId)
      .then((response) => {
        console.log(response);
        const message = response.data.message;
        toast.error(message);
  
        setTimeout(() => {
          navigate("/verifications");
        }, 2000);
      })
      .catch((error) => {
        console.log(error);
        toast.error("Failed to reject business: " + error.message);
      });
  };

  return (
    <>
      <Navigation />
      <Toaster position="top-center" reverseOrder={false} />
      {loading ? (
        <>
          <Loading />
        </>
      ) : (
        <>
          <div className="bvp-main-div border rounded">
            <div className="border-bottom" style={{ height: "50px" }}></div>
            <div className="p-3">
              <h5>{data.businessname}</h5>
              <p>
                {data.category} <br />
                {data.city}
              </p>

              <div className="border rounded p-2 mt-5" style={{ height: "150px" }}>
                <h6>Address</h6>
                <p>
                  {data.building},{data.street}
                  <br />
                  {data.town},{data.city}
                  <br />
                  {data.district},{data.state}
                  <br />
                  {data.pincode}
                </p>
              </div>

              <div className="border rounded p-2 mt-5" style={{ height: "150px" }}>
                <h6>Contact Details</h6>
                <p>
                  Phone number:{data.phonenumber}
                  <br />
                  Email : {data.email}
                </p>
              </div>

              <div className="mt-4" style={{ textAlign: "center" }}>
                <button
                  onClick={() => {
                    approve(data.loginId);
                  }}
                  type="button"
                  class="btn btn-primary"
                >
                  Approve
                </button>
                <button
                  onClick={() => {
                    reject(data.loginId);
                  }}
                  type="button"
                  class="btn btn-outline-danger"
                >
                  Reject
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
