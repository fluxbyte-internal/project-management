import CrossIcon from "../../assets/svg/CrossIcon.svg";
import { Button } from "../ui/button";
import { useFormik } from "formik";
import { useUser } from "@/hooks/useUser";

type AccountPropsType = {
  handleCloseAccountPopUp: () => void;
};

function AccountSettings(props: AccountPropsType) {
  const { handleCloseAccountPopUp } = props;
  const { user } = useUser();
  const errorStyle = "text-red-400 block text-sm h-1";
  const labelStyle = "font-medium text-base text-gray-700 ";
  const inputStyle =
    "py-1.5 px-3 rounded-md border border-gray-100 mt-1 w-full h-[46px]";

  const formik = useFormik({
    initialValues: {
      firstName: user?.firstName,
      lastName: user?.lastName,
      email: user?.email,
    },
    onSubmit: () => {},
  });

  return (
    <div className="fixed bg-[#00000066] w-full top-0 h-full items-center flex justify-center z-50">
      <div className="sm:rounded-lg border border-white bg-[#fff] w-full sm:w-auto h-full sm:h-auto flex flex-col ">
        <div className="flex justify-between py-5 px-4 border-b border-gray-100 lg:border-none">
          <div className="font-semibold text-2xl ">Update User Profile</div>
          <div
            onClick={handleCloseAccountPopUp}
            className="flex items-center justify-center "
          >
            <img src={CrossIcon}></img>
          </div>
        </div>
        <div>
          <div className="p-5 pt-0">
            <form onSubmit={formik.handleSubmit}>
              <div className="w-full flex flex-col gap-1">
                <div className="text-left ">
                  <label className={labelStyle}>First Name</label>

                  <input
                    type="text"
                    name="firstName"
                    placeholder="First Name"
                    className={inputStyle}
                    value={formik.values.firstName ?? ""}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  <span className={errorStyle}>
                    {formik.touched.firstName && formik.errors.firstName}
                  </span>
                </div>
                <div className="text-left">
                  <label className={labelStyle}>Last Name</label>

                  <input
                    type="text"
                    name="lastName"
                    placeholder="Last Name"
                    className={inputStyle}
                    value={formik.values.lastName ?? ""}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  <span className={errorStyle}>
                    {formik.touched.lastName && formik.errors.lastName}
                  </span>
                </div>
                <div className="text-left">
                  <label className={labelStyle}>Email</label>

                  <input
                    type="text"
                    name="email"
                    placeholder="Email"
                    className={inputStyle}
                    value={formik.values.email ?? ""}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  <span className={errorStyle}>
                    {formik.touched.email && formik.errors.email}
                  </span>
                </div>
              </div>

              <div className="flex justify-center mt-6 lg:mt-2">
                <Button
                  type="submit"
                  variant={"none"}
                  className="bg-primary-400 text-primary-800 font-medium text-lg"
                >
                  Update
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AccountSettings;
