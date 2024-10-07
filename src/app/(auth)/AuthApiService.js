import {unAuthorizedApi} from '../../services/axios';
export const AuthApiService = {
  login: (data) => unAuthorizedApi.post('/auth/SignIn',data),
  signup: (data) => unAuthorizedApi.post('/auth/signup',data),
  getInstitute: () => unAuthorizedApi.get('/auth/get_all_institute'),
  getDepartment: (data) => unAuthorizedApi.get(`/auth/department/${data}`),
  forgetPassword: (data) => unAuthorizedApi.post('/auth/forget-password',data),
  resetPassword: (data) => unAuthorizedApi.post(`/auth/reset-password`,data),
  logout: (data) => unAuthorizedApi.post(`/auth/logout`,data),
};
