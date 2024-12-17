import config from '../../config/env.cfg'; 

export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const LOGIN_FAILURE = 'LOGIN_FAILURE';

export const loginSuccess = (user) => ({
  type: LOGIN_SUCCESS,
  payload: user,
});

export const loginFailure = (error) => ({
  type: LOGIN_FAILURE,
  payload: error,
});


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
    } else {
      dispatch(loginFailure(data.message || 'Error al iniciar sesión'));
    }
  } catch (error) {
    dispatch(loginFailure(error.message || 'Error desconocido'));
  }
};



