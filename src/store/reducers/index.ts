/* eslint-disable no-undef */
// eslint-disable-next-line camelcase
import jwt_decode from 'jwt-decode';

interface InitialState {
    token: string,
    payload: {id:string, admin:boolean, name:string, iat:number},
    login:boolean
}
// eslint-disable-next-line
function authReducer(state:InitialState|undefined, action: { type: string; jwt: string; }):any {
  if (state === undefined) {
    if (localStorage.authToken) {
      // eslint-disable-next-line no-param-reassign
      action.type = 'LOGIN';
    } else {
      return {};
    }
  }

  if (action.type === 'LOGIN') {
    if (action.jwt) {
      localStorage.authToken = action.jwt;
      return { token: action.jwt, payload: jwt_decode(action.jwt), login: true };
    }
    return {
      token: localStorage.authToken,
      payload: jwt_decode(localStorage.authToken),
      login: true,
    };
  }

  return state;
}

export default authReducer;
