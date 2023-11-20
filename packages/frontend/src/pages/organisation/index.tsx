import { useState } from "react";
import organisationImage from "../../assets/png/organisation.png";
import backGroundImage from "../../assets/png/background2.png";
import OrganisationForm from "./organisationForm";
function Organisation() {
  const [organisationForm, setOrganisationForm,] = useState<boolean>(false);
  return (
    <>
      <div
        className={`w-full h-full flex justify-center items-center bg-[url(/src/assets/png/background2.png)] bg-cover bg-no-repeat`}
        style={{ backgroundImage: backGroundImage, }}
      >
        <div className="flex flex-col justify-center items-center gap-24">
          <img
            src={organisationImage}
            className="w-96"
          />
          <div className="lg:flex justify-between gap-x-5">
            <div>
              <span className="text-primary-400 text-3xl font-medium font-['Poppins']">
                Don’t have any organisation?
                <br />
              </span>
              <span className="text-neutral-600 text-5xl font-bold">
                Create One!
              </span>
            </div>
            <div className="flex items-center ">
              <button
                onClick={() => setOrganisationForm(true)}
                className=" w-full mt-3 tracking-wide lg:mt-0 lg:w-fit bg-warning hover:bg-opacity-80 text-lg font-medium text-orange-800 py-3 px-7 rounded-md gap-4"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      </div>
      {organisationForm && (
        <OrganisationForm close={() => setOrganisationForm(false)} />
      )}
    </>
  );
}

export default Organisation;