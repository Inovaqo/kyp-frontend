import {api} from '../../services/axios';
export const BaseApiService = {
  getProfessors: (data) => api.get('/professors/search'+data),
  getProfessor: (data) => api.post('/auth/signup',data),
  getRecommendations: (data) => api.get('/professors/getRecommendations'+data),
  saveProfessor: (data) => api.post('/professors/saved',data),
  SavedProfessors: (data) => api.get('/student/saved-professors'+data),
  postReview: (data) => api.post(`/auth/logout`,data),
  postRating: (data) => api.post(`rating/rate-Professor`,data),
  getReviews: (data) => api.get('/student/my-ratings'+data),
  updateProfile: (data) => api.post(`/student/update-profile`,data),
  // updateProfilePic: (data) => api.post(`/student/update-profile-pic`,data),
  updatePassword: (data) => api.post(`/student/update-password`,data),
  reactRatings: (data) => api.post(`/rating/react-rating`,data),
  getProfessorCoursesDetails: (data) => api.get(`/professors/coursedetails/${data}`),
  getProfessorDetails: (data) => api.get(`/professors/details/${data}`),
  getProfessorCourses: (data) => api.get(`/professors/course/${data}`),
  getSavedProfessor:(data) => api.get(`/professors/saved/professors/${data}`),
  getReview:(data) => api.get(`/rating/review/${data}`),

};
