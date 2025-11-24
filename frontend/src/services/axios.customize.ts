import axios from 'axios'

const instance = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL_BACKEND + '/api-v1',
  withCredentials: true,
})

// Add a request interceptor
instance.interceptors.request.use(
  function (config) {
    // Do something before request is sent

    const persisted = localStorage.getItem("auth-storage");

    let token = null;
    if (persisted) {
      try {
        token = JSON.parse(persisted)?.state?.accessToken || null;
      } catch (e) { }
    }

    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }



    return config;
  },
  function (error) {
    // Do something with request error
    return Promise.reject(error);
  },
  // { synchronous: true, runWhen: () => /* This function returns true */ }
)

// Add a response interceptor
instance.interceptors.response.use(
  function onFulfilled(response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response;
  },
  function onRejected(error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error

    return Promise.reject(error)
  },
)

export default instance
