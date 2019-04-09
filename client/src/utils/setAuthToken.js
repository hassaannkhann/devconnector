import axios from "axios";

const setAuthToken = token => {
  if (token) {
    //Apply to every request
    axios.defaults.headers.common["Authorization"] = token;
  } else {
    //Delete The Auth Header
    delete axios.defaults.headers.common["Authorization"];
  }
};

export default setAuthToken;
