import { useState } from "react";
import organisationImage from "../../assets/png/organisation.png";
import OrganisationForm from "./organisationForm";
import { useUser } from "@/hooks/useUser";
import { useNavigate } from "react-router-dom";
function Organisation() {
  const [organisationForm, setOrganisationForm] = useState<boolean>(false);
  const navigate = useNavigate();
  const { user } = useUser();
  return (
    <>
      <div
        style={{ backgroundSize: "102% 106%", backgroundPosition: "-2rem" }}
        className={`w-full px-5 h-full  flex justify-center items-center bg-[url(/src/assets/png/background2.png)] bg-no-repeat`}
      >
        <div className="flex flex-col justify-center items-center gap-24">
          <div className="p-6">
            <img src={organisationImage} className="w-96" />
          </div>
          <div className="lg:flex justify-between gap-x-5 w-full">
            {user && user.userOrganisation.length > 0 ? (
              <>
                <div>
                  <span className="text-gray-400 text-2xl lg:text-3xl font-medium font-['Poppins']">
                    You already have an organisation
                    <br />
                  </span>
                  {user && (
                    <span className="text-neutral-600 text-3xl lg:text-5xl font-bold">
                      {user.userOrganisation[0].organisation.organisationName}
                    </span>
                  )}
                </div>
                <div className="flex items-center ">
                  <button
                    onClick={() => navigate("/projects")}
                    className="w-full mt-3 tracking-wide lg:mt-0 lg:w-fit bg-warning hover:bg-opacity-80 text-lg font-medium text-orange-800 py-3 px-7 rounded-md gap-4"
                  >
                    Go to projects
                  </button>
                </div>
              </>
            ) : (
              <>
                <div>
                  <span className="text-gray-400 text-2xl lg:text-3xl  font-medium font-['Poppins']">
                    Don’t have any organisation?
                    <br />
                  </span>
                  <span className="text-neutral-600  text-3xl lg:text-5xl font-bold">
                    Create One!
                  </span>
                </div>
                <div className="flex items-center mt-3 ">
                  <button
                    onClick={() => setOrganisationForm(true)}
                    className="w-full mt-3 tracking-wide lg:mt-0 lg:w-fit bg-warning hover:bg-opacity-80 text-lg font-medium text-orange-800 py-3 px-7 rounded-md gap-4"
                  >
                    Create
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
      {organisationForm && <OrganisationForm close={()=>setOrganisationForm(false)} />}
    </>
  );
}

export default Organisation;
