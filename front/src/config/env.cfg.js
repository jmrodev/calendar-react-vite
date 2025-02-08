const config = {
  baseUrl: import.meta.env.VITE_API_URL || 'http://localhost:3002/api',
  endpoints: {
    login: '/users/login',
    register: '/users/register',
    logout: '/users/logout',
    calendar: '/calendar'
  }
};

// For direct URL access (legacy support)
config.url_login = `${config.baseUrl}/users/login`;
config.url_register = `${config.baseUrl}/users/register`;
config.url_logout = `${config.baseUrl}/users/logout`;

export default config;