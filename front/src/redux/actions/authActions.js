import config from "../../config/env.cfg.js";

export const LOGIN_SUCCESS = "LOGIN_SUCCESS";
export const LOGIN_FAILURE = "LOGIN_FAILURE";
export const LOGOUT = "LOGOUT";

export const loginSuccess = (user) => ({
  type: LOGIN_SUCCESS,
  payload: user,
});

export const loginFailure = (error) => ({
  type: LOGIN_FAILURE,
  payload: error,
});

export const logoutSuccess = () => ({
  type: LOGOUT,
});

export const login = (credentials) => async (dispatch) => {
  try {
    const response = await fetch(`${config.api_url}/users/login`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    });

    const data = await response.json();

    if (response.ok) {
      dispatch(loginSuccess(data.user));
      return { success: true };
    } else {
      dispatch(loginFailure(data.message || "Error al iniciar sesión"));
      return { error: data.message };
    }
  } catch (error) {
    dispatch(loginFailure("Error de conexión"));
    return { error: error.message };
  }
};

export const logout = () => async (dispatch) => {
  try {
    const response = await fetch(`${config.api_url}/users/logout`, {
      method: "POST",
      credentials: "include",
    });

    if (response.ok) {
      dispatch(logoutSuccess());
      return { success: true };
    }
  } catch (error) {
    console.error("Error during logout:", error);
    return { error: error.message };
  }
};