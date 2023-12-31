import organisationImage from "../../assets/png/organisation.png";
import CreateProjectForm from "@/components/project/CreateProjectForm";
import { useState } from "react";

function NoProject() {
  const [isOpenPopUp, setIsOpenPopUp] = useState(false);
  const close = () => {
    setIsOpenPopUp(false);
  };
  return (
    <>
      <div
        style={{backgroundSize:"102% 106%",backgroundPosition:"-2rem"}}
        className={`w-full px-5 h-full flex  justify-center  items-center bg-[url(/src/assets/png/background2.png)]  bg-no-repeat`}
      >
        <div className="flex flex-col justify-center items-center gap-24">
          <div className="p-6">
            <img src={organisationImage} className="w-96" />
          </div>
          <div className="lg:flex justify-between gap-x-5 w-full">
            <div>
              <span className="text-gray-400 text-2xl sm:text-3xl font-medium font-['Poppins']">
                Don’t have any projects?
                <br />
              </span>
              <span className="text-neutral-600 text-5xl font-bold">
                Create One!
              </span>
            </div>
            <div className="flex items-center ">
              <button
                onClick={() => setIsOpenPopUp(true)}
                className="w-full mt-3 tracking-wide lg:mt-0 lg:w-fit bg-warning hover:bg-opacity-80 text-lg font-medium text-orange-800 py-3 px-7 rounded-md gap-4"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      </div>
      {isOpenPopUp && <CreateProjectForm handleClosePopUp={close} />}
    </>
  );
}

export default NoProject;
