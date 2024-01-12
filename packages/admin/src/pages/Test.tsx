import { requestURLs } from "@/Environment";
import ApiRequest from "@/api/ApiRequest";
import { useEffect } from "react";

function Test() {
  useEffect(() => {
    const token = localStorage.getItem("Token");
    try {
      if (token) {
        ApiRequest.get(requestURLs.me);
      }
    } catch (error) {
      console.error(error);
    }
  }, []);
  return (
    <div className="grid place-content-center">
      <span className="text-3xl">Test</span>
    </div>
  );
}

export default Test;
