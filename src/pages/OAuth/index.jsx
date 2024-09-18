import { useLocation } from "react-router-dom";

const OAuth = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);

  const accessToken = queryParams.get("access");
  const refreshToken = queryParams.get("refresh");

  console.log("Access Token:", accessToken);
  console.log("Refresh Token:", refreshToken);

  return (
    <div>
      <h1>OAuth Component</h1>
      <p>Access Token: {accessToken}</p>
      <p>Refresh Token: {refreshToken}</p>
    </div>
  );
};

export default OAuth;
