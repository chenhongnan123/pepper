import Cookies from 'js-cookie';

class TokenService {
  getToken() {
    return Cookies.get('novo_ios_token');
  }

  setToken(token) {
    Cookies.set('novo_ios_token', token, { path: '/' });
  }

  removeToken() {
    Cookies.remove('novo_ios_token');
  }
}

export default new TokenService();
