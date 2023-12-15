import Cookies from 'js-cookie';

class TokenService {
  getToken() {
    return Cookies.get('admin_token');
  }

  setToken(token) {
    Cookies.set('admin_token', token, { path: '/' });
  }

  removeToken() {
    Cookies.remove('admin_token');
  }
}

export default new TokenService();
