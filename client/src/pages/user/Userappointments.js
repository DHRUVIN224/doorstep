import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Pagination from "../../components/Pagination";
import Navigation from "../../components/Navigation";
import "./userappointments.css";
import Loading from "../../components/Loading";
import { userAPI } from "../../services/api";

export default function Userappointments() {
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  const [data, setData] = useState([]);

  useEffect(() => {
    userAPI.viewAppointments( {
        
      })
      .then((response) => {
        console.log("data", response);
        const data = response.data.data;
        setData(data);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const [currentPage, setCurrentpage] = useState(1);
  const [postsPerpage, setPostsperpage] = useState(5);

  const lastPostindex = currentPage * postsPerpage;
  const firstPostindex = lastPostindex - postsPerpage;
  const currentPageposts = data.slice(firstPostindex, lastPostindex);

  return (
    <>
      <Navigation />
      {loading ? (
        <>
          <Loading />
        </>
      ) : (
        <>
          {" "}
          <div className="border rounded p-2 user-ap-div">
            {currentPageposts.map((item) => (
              <div
                className="border rounded p-2"
                style={{
                  height: "100px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div>
                  <h5>{item.title}</h5>
                </div>
                <div>
                  <p>{item.date}</p>
                </div>
                <div>
                  <p>
                    {item.businessname}
                    <br />
                    {item.city}
                  </p>
                </div>
                <div>
                  <Link to={``} type="button" class="btn btn-outline-primary">
                    View
                  </Link>
                </div>
              </div>
            ))}
          </div>
          <Pagination
            totalPosts={data.length}
            postsPerpage={postsPerpage}
            setCurrentPage={setCurrentpage}
            currentPage={currentPage}
          />{" "}
        </>
      )}
    </>
  );
}
