import config from '../../config/env.cfg'; 

export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const LOGIN_FAILURE = 'LOGIN_FAILURE';
export const LOGOUT = 'LOGOUT';

export const loginSuccess = (user) => ({
  type: LOGIN_SUCCESS,
  payload: user
});

export const loginFailure = (error) => ({
  type: LOGIN_FAILURE,
  payload: error,
});

export const logout = () => {
  return {
    type: LOGOUT
  };
};

export const login = (credentials) => async (dispatch) => {
  try {
    const response = await fetch(`${config.url_login}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    const data = await response.json();

    if (response.ok) {
      localStorage.setItem('jwt', data.token);
      dispatch(loginSuccess(data.user));
      return { success: true };
    } else {
      dispatch(loginFailure(data.message || 'Error al iniciar sesión'));
      return { error: data.message };
    }
  } catch (error) {
    dispatch(loginFailure(error.message || 'Error desconocido'));
    return { error: error.message };
  }
};



