import Cookies from 'js-cookie';
export const setToken = (token) => {
  Cookies.set('auth-token', token, { sameSite: 'Strict' });
};
export const getToken = () => {
  return Cookies.get('auth-token');
};
export const destroyToken = () => {
  Cookies.remove('auth-token');
};

//user info
export const setUserInfo = (userInfo) => {
  Cookies.set('user-info', userInfo, { sameSite: 'Strict' });
}
export const getUserInfo = () => {
  return Cookies.get('user-info');
};
export const destroyUserInfo = (userInfo) => {
  Cookies.remove('user-info');

}
