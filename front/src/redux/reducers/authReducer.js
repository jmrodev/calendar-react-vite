import { LOGIN_SUCCESS, LOGIN_FAILURE } from '../actions/authActions';

const initialState = {
  isLoggedIn: false,
  userName: '',
  error: null,
};

const authReducer = (state = initialState, action) => {
  switch (action.type) {
	case LOGIN_SUCCESS:
	  return {
		...state,
		isLoggedIn: true,
		userName: action.payload.username,
		error: null,
	  };
	case LOGIN_FAILURE:
	  return {
		...state,
		isLoggedIn: false,
		userName: '',
		error: action.payload,
	  };
	default:
	  return state;
  }
};

export default authReducer;