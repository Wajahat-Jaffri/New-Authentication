import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { checkAuthentication } from "../redux/authSlice";

const AuthLoader = ({ children }) => {
  const dispatch = useDispatch();

  const { authChecked } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(checkAuthentication());
  }, [dispatch]);

  if (!authChecked) {
    return (
      <div className="flex justify-center items-center h-screen">
        <h1 className="text-2xl">Loading...</h1>
      </div>
    );
  }

  return children;
};

export default AuthLoader;