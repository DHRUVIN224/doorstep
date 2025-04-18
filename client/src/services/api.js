import axios from 'axios';
// Remove the circular import
// import { userAPI, businessAPI, adminAPI, messageAPI } from "./api";

// Use environment variable with a fallback
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

// Create an axios instance with default configuration
const api = axios.create({
  baseURL: API_URL
});

// Add a request interceptor to attach the JWT token and handle FormData
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    
    // Check if the data is FormData, if so, don't set Content-Type (browser will set it with boundary)
    if (config.data instanceof FormData) {
      // Let the browser set the Content-Type to multipart/form-data with boundary
      delete config.headers['Content-Type'];
    } else {
      // Set the default Content-Type for JSON data
      config.headers['Content-Type'] = 'application/json';
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Export API methods for different endpoints
export const userAPI = {
  login: (data) => api.post('/user/login', data),
  register: (data) => api.post('/user/register', data),
  profile: () => api.get('/user/profile'),
  postJob: (data) => api.post('/user/postjob', data),
  viewJobs: () => api.get('/user/viewjobpost'),
  deleteJob: (jobId) => api.get(`/user/deletejob/${jobId}`),
  viewSingleJob: (id) => api.get(`/user/viewsinglejob/${id}`),
  viewPostedJob: (id) => api.get(`/user/viewpostedjob/${id}`),
  saveJob: (id, data) => api.post(`/user/savejob/${id}`, data),
  searchServices: (data) => api.post('/user/search', data),
  bookService: (businessId, data) => api.post(`/user/bookservice/${businessId}`, data),
  viewBusinessProfile: (id) => api.get(`/user/viewfullbuissnessprofile/${id}`),
  viewJobApplications: (id) => api.get(`/user/viewjobapplications/${id}`),
  approveJobApplication: (businessId, jobId) => api.put(`/user/approvejobapplication/${businessId}/${jobId}`),
  viewAppointments: () => api.get('/user/appointments'),
  approveJob: (loginId, jobId) => api.get(`/user/approvejob/${loginId}/${jobId}`),
  viewApplicantProfile: (id) => api.get(`/user/viewapplicantprofile/${id}`),
  sendMessage: (loginId, data) => api.post(`/user/message/${loginId}`, data),
  viewBusinessDetails: (id) => api.get(`/user/viewbuissnessdetails/${id}`)
};

export const businessAPI = {
  register: (data) => api.post('/buissness/register', data),
  profile: () => api.get('/buissness/profile'),
  viewJobList: (data) => api.post('/buissness/viewjoblist', data),
  apply: (jobId, data) => api.post(`/buissness/apply/${jobId}`, data),
  viewJobDetails: (id) => api.get(`/buissness/viewjobdetails/${id}`),
  viewJobOnSearch: (id) => api.get(`/buissness/viewjobonsearch/${id}`),
  viewUserDetails: (id) => api.get(`/buissness/viewuserdetails/${id}`),
  viewApplication: (id) => api.get(`/buissness/viewapplication/${id}`),
  viewJobApplications: () => api.get('/buissness/viewjobapplications'),
  viewJobAppointments: () => api.get('/buissness/viewjobappointments'),
  viewJobAppointmentDetails: (id) => api.get(`/buissness/viewjobappointments/${id}`),
  jobFinished: (applicationId, jobId) => api.get(`/buissness/jobfinished/${applicationId}/${jobId}`),
  viewBookingAppointments: () => api.get('/buissness/bookingappointments'),
  viewBookingDetails: (id) => api.get(`/buissness/bookingappointments/${id}`),
  updateBooking: (bookingId) => api.get(`/buissness/updatebooking/${bookingId}`),
  acceptBooking: (bookingId) => api.get(`/buissness/acceptbooking/${bookingId}`),
  rejectBooking: (bookingId) => api.get(`/buissness/rejectbooking/${bookingId}`),
  viewEnquiries: () => api.get('/buissness/enquiries')
};

export const adminAPI = {
  viewBusinessVerification: () => api.get('/admin/buissnessverification'),
  viewBusinessProfile: (id) => api.get(`/admin/viewbuissnessprofile/${id}`),
  updateStatus: (loginId) => api.get(`/admin/updatestatus/${loginId}`),
  rejectStatus: (loginId) => api.get(`/admin/rejectstatus/${loginId}`),
  jobApprovals: () => api.get('/admin/jobapprovals'),
  viewJobPost: (id) => api.get(`/admin/viewjobpost/${id}`),
  updateJobStatus: (jobId) => api.get(`/admin/updatejobstatus/${jobId}`),
  rejectJobStatus: (jobId) => api.get(`/admin/rejectjobstatus/${jobId}`)
};

export const messageAPI = {
  viewMessage: () => api.get('/message/viewmessage'),
  viewBusinessMessage: () => api.get('/message/viewbuissnessmessage'),
  viewUserChat: (id) => api.get(`/message/viewuserchat/${id}`),
  viewChatMessage: (id) => api.get(`/message/viewchatmessage/${id}`),
  sendMessage: (id, data) => api.post(`/message/sendmessage/${id}`, data),
  saveReplyMessage: (id, data) => api.post(`/message/savereplymessage/${id}`, data)
};

export default api; 