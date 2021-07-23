/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { Dispatch } from "react";

interface Payload {
    message: string | null,
    token: string | undefined | null
}
interface ActionPromiseResult {
    type: string,
    name: string,
    status: string,
    payload: Payload | null,
    error: string | null

}

export const actionAuthLogin = (jwt:string):{type:string,jwt:string} => ({ type: 'LOGIN', jwt });

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const actionPromise = ({ name, promise }: { name: string; promise?: Promise<any>; }): (dispatch: Dispatch<ActionPromiseResult>) => Promise<Payload> => {
  const actionPending = () : ActionPromiseResult => ({
    type: 'PROMISE',
    name,
    status: 'PENDING',
    payload: null,
    error: null,
  });
  const actionResolved = (payload: Payload) : ActionPromiseResult => ({
    type: 'PROMISE',
    name,
    status: 'RESOLVED',
    payload,
    error: null,
  });
  const actionRejected = (error:string) : ActionPromiseResult => ({
    type: 'PROMISE',
    name,
    status: 'REJECTED',
    payload: null,
    error,
  });

  return async (dispatch:Dispatch<ActionPromiseResult>): Promise<Payload> => {
    dispatch(actionPending());
    let payload;
    try {
      payload = await promise;
      dispatch(actionResolved(payload));
    } catch (e) {
      dispatch(actionRejected(e));
    }

    return payload;
  };
};

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const actionEnter = (login:string, password:string) => async (dispatch:any):Promise<void> => {
  console.log("++++",dispatch)
  const registration = await dispatch(
    actionPromise(
      {
        name: 'registration',
        // eslint-disable-next-line no-undef
        promise: fetch('http://127.0.0.1:5050/user/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: login,
            password,
          }),
        }).then((res) => res.json())
      },
    ),
  );
  if (!registration.errors) {
    if (registration.token) {
      dispatch(actionAuthLogin(registration.token));
      // eslint-disable-next-line no-undef
      window.location.reload();
    }
  }
};
