import useRootAuthMutation from "@/api/mutation/useRootAuthMutation";
import React, { useState } from "react";
interface RootCredState {
  username: string;
  password: string;
}
type Props = {
  allow: (data: boolean) => void;
  notfound: (data: boolean) => void;
};
function RootAuth(props: Props) {
  const [RootCred, setRootCred] = useState<RootCredState>({
    username: "",
    password: "",
  });
  const rootAuth = useRootAuthMutation();
  const handleInputChange = (
    e: React.ChangeEvent<{ name: string; value: string }>
  ) => {
    const { name, value } = e.target;

    setRootCred((prevRootCred) => ({
      ...prevRootCred,
      [name]: value,
    }));
  };
  const handleSubmit = () => {
    rootAuth.mutate(RootCred, {
      onSuccess() {
        props.allow(true);
      },
      onError() {
        props.notfound(true);
      },
    });
  };
  return (
    <div className="fixed text-white top-0 w-full left-0 h-full flex  justify-center ">
      <div className="bg-gray-900 p-8 w-[35rem] h-fit rounded-lg shadow-lg">
        <div>
          <label>Enter username</label>
          <input
            type="text"
            name="username"
            placeholder="Username"
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 bg-transparent rounded mb-4"
          />
        </div>
        <div>
          <label>Enter Password</label>
          <input
            type="text"
            name="password"
            placeholder="Password"
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 bg-transparent rounded mb-4"
          />
        </div>

        <div className="flex justify-end gap-2">
          <button
            onClick={handleSubmit}
            className="bg-blue-300 w-24 text-white px-4 py-2 rounded ml-2 hover:bg-blue-400"
          >
            OK
          </button>
          <button
            onClick={() => props.notfound(true)}
            className=" w-24 border text-blue-400 px-4 py-2 rounded hover:bg-gray-700"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export default RootAuth;
