import React, { useEffect, useState } from "react";
import "./editjob.css";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Navigation from "../../components/Navigation";
import { userAPI } from "../../services/api";
import toast, { Toaster } from "react-hot-toast";

export default function Editjob() {
  const { id } = useParams();
  const navigate = useNavigate();
  console.log("jobid", id);
  const [data, setData] = useState({
    title: "",
    description: "",
    category: "",
    city: "",
    date: "",
    budget: "",
    image: "",
    address: "",
  });
  console.log(data);
  const [isSubmit, setIsSubmit] = useState(false);
  const token = localStorage.getItem("token");
  console.log(token);

  useEffect(() => {
    userAPI.viewPostedJob(id)
      .then((response) => {
        console.log(response);
        const jobdata = response.data.data;
        setData(jobdata);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const inputChange = (event) => {
    const name = event.target.name;
    
    if (name === "image" && event.target.files && event.target.files[0]) {
      setData({ ...data, [name]: event.target.files[0] });
    } else {
      const value = event.target.value;
      setData({ ...data, [name]: value });
    }
  };
  console.log(data);

  const setSelectedValue = (event) => {
    setData({ ...data, city: event.target.value });
  };

  const [formErrors, setFormErrors] = useState({});

  const validate = (values) => {
    var error = {};

    if (!values.title) {
      error.title = "enter title";
    }
    if (!values.description) {
      error.description = "enter description";
    }
    if (!values.category) {
      error.category = "enter category";
    }
    if (!values.city) {
      error.city = "enter city";
    }
    if (!values.date) {
      error.date = "enter date";
    }
    if (!values.budget) {
      error.budget = "enter budget";
    }
    if (!values.image) {
      error.image = "upload image";
    }
    if (!values.address) {
      error.address = "enter address";
    }
    return error;
  };

  const submit = (e) => {
    e.preventDefault();
    const errors = validate(data);
    setFormErrors(errors);
    setIsSubmit(true);

    // Skip image validation if there's already an image
    if (errors.image && typeof data.image === 'string' && data.image.length > 0) {
      delete errors.image;
    }

    if (Object.keys(errors).length === 0) {
      // Show loading state
      setIsSubmit(true);
      
      try {
        // Create FormData for all submissions to handle potential file uploads
        const formData = new FormData();
        formData.append("title", data.title);
        formData.append("description", data.description);
        formData.append("category", data.category);
        formData.append("date", data.date);
        
        // Ensure budget is a valid number string without commas
        let cleanBudget = "0";
        if (data.budget) {
          // Remove any non-numeric characters except decimal point
          cleanBudget = data.budget.toString().replace(/[^\d.]/g, '');
          // Ensure it's a valid number
          if (isNaN(Number(cleanBudget))) {
            cleanBudget = "0";
          }
        }
        formData.append("budget", cleanBudget);
        
        formData.append("address", data.address || "");
        formData.append("city", data.city);
        
        // Only append image if it's a file object (new upload)
        if (data.image instanceof File) {
          formData.append("image", data.image);
        }
        
        console.log("Submitting form data:", {
          title: data.title,
          description: data.description,
          category: data.category,
          date: data.date,
          budget: cleanBudget,
          address: data.address || "",
          city: data.city
        });
        
        userAPI.saveJob(id, formData)
          .then((response) => {
            console.log("Save response:", response);
            toast.success("Job updated successfully!");
            
            // Navigate immediately to force a full refresh of the jobs page
            navigate('/viewjob', { state: { refresh: true } });
          })
          .catch((error) => {
            console.error("Error saving job:", error);
            toast.error(error.response?.data?.message || "Error updating job");
            setIsSubmit(false);
          });
      } catch (error) {
        console.error("Error in form submission:", error);
        toast.error("Error preparing form data");
        setIsSubmit(false);
      }
    } else {
      // Validation failed
      setIsSubmit(false);
      toast.error("Please fix the errors in the form");
    }
  };
  return (
    <>
      <Navigation />
      <Toaster position="top-center" reverseOrder={false} />

      <div>
        <div
          className="editjob-div container-fluid border border-2  rounded "
          style={{
            height: "100%",
            marginTop: "50px",
            padding: "0px",
            backgroundColor: "white",
          }}
        >
          <div className="container-fluid border-bottom  " style={{ padding: " 15px" }}>
            <h5 style={{ textAlign: "center" }}>Edit Job</h5>
          </div>
          <div style={{ padding: "20px" }}>
            <div>
              <form>
                <div className="mb-3">
                  <label htmlFor="jobTitle" className="formlabel">
                    Job Title
                  </label>
                  <span
                    style={{
                      color: "red",
                      marginLeft: "10px",
                      fontSize: "small",
                    }}
                  >
                    {formErrors.title}
                  </span>

                  <input
                    name="title"
                    onChange={inputChange}
                    type="text"
                    className="form-control forminput"
                    value={data.title}
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="jobDescription" className="formlabel">
                    Job Description
                  </label>
                  <span
                    style={{
                      color: "red",
                      marginLeft: "10px",
                      fontSize: "small",
                    }}
                  >
                    {formErrors.description}
                  </span>

                  <input
                    value={data.description}
                    name="description"
                    onChange={inputChange}
                    type="text"
                    className="form-control forminput"
                  />
                </div>

                <div className="row" style={{ marginTop: "20px" }}>
                  <div className=" col col-sm-12 col-lg-6 ">
                    <select
                      value={data.category}
                      id="Select"
                      className="form-select"
                      style={{ height: 50, fontSize: 14 }}
                      onChange={inputChange}
                      name="category"
                    >
                      <option value="">Select Category</option>
                      <option value="electrical">Electrical</option>
                      <option value="plumbing">Plumbing</option>
                      <option value="carpentry">Carpentry</option>
                      <option value="pestcontrol">Pest Control</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div className=" col col-sm-12 col-lg-6 mt-sm-3 mt-lg-0 ">
                    <select
                      value={data.city}
                      id="Select"
                      className="form-select"
                      style={{ height: 50, fontSize: 14 }}
                      onChange={setSelectedValue}
                      name="city"
                    >
                      <option value="">Select City</option>
                      <option value="kozhikode">Kozhikode</option>
                      <option value="kannur">Kannur</option>
                      <option value="vadakara">Vadakara</option>
                      <option value="ahmedabad">Ahmedabad</option>
                      <option value="mumbai">Mumbai</option>
                    </select>
                  </div>

                  <div className=" row " style={{ marginTop: "10px" }}>
                    <div className="col col-sm-12 col-lg-6 ">
                      <div className="mb-3">
                        <label htmlFor="jobDate" className="formlabel">
                          Date
                        </label>
                        <span
                          style={{
                            color: "red",
                            marginLeft: "10px",
                            fontSize: "small",
                          }}
                        >
                          {formErrors.date}
                        </span>

                        <input
                          value={data.date}
                          onChange={inputChange}
                          name="date"
                          type="date"
                          className="form-control forminput"
                          id="jobDate"
                        />
                      </div>
                    </div>

                    <div className="col col-sm-12 col-lg-6 ">
                      <div className="mb-3">
                        <label htmlFor="jobBudget" className="formlabel">
                          Budget
                        </label>
                        <span
                          style={{
                            color: "red",
                            marginLeft: "10px",
                            fontSize: "small",
                          }}
                        >
                          {formErrors.budget}
                        </span>

                        <input
                          value={data.budget}
                          onChange={inputChange}
                          name="budget"
                          type="text"
                          className="form-control forminput"
                          id="jobBudget"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="mb-3">
                    <label htmlFor="formFile" className="formlabel">
                      Upload images
                    </label>
                    <span
                      style={{
                        color: "red",
                        marginLeft: "10px",
                        fontSize: "small",
                      }}
                    >
                      {formErrors.image}
                    </span>

                    <input
                      onChange={inputChange}
                      name="image"
                      className="form-control form-control-lg"
                      type="file"
                      id="formFile"
                      style={{ fontSize: "16px" }}
                    />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="jobAddress" className="formlabel">
                      Address
                    </label>
                    <span
                      style={{
                        color: "red",
                        marginLeft: "10px",
                        fontSize: "small",
                      }}
                    >
                      {formErrors.address}
                    </span>

                    <textarea
                      value={data.address}
                      onChange={inputChange}
                      name="address"
                      rows={3}
                      className="form-control forminput"
                      id="jobAddress"
                    />
                  </div>
                </div>
              </form>

              <div style={{ textAlign: "center" }}>
                <button onClick={submit} type="button" className="btn btn-success me-2">
                  Save
                </button>
                <button onClick={() => navigate('/viewjob')} type="button" className="btn btn-secondary">
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
