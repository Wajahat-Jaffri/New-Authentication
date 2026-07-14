let logoutFunction = null;
//ye function ko store kary ga jo logout karega
export const setLogoutFunction = (fn) => {
  logoutFunction = fn;
};
//ye function ko call kary ga
export const logoutUser = () => {
  if (logoutFunction) {
    logoutFunction();
  }
};