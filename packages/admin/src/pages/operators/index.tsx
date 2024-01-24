import { useFormik } from "formik";
import Table from "@/components/shared/Table";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import Loader from "@/components/common/Loader";
import BackgroundImage from "@/components/layout/BackgroundImage";
import CrossIcon from "../../assets/svg/CrossIcon.svg";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import useOperatorsListQuery, {
  operatorDataType,
} from "@/api/query/operatorsListQuery";
import { z } from "zod";
import { operatorSchema } from "@backend/src/schemas/consoleSchema";
import { toFormikValidationSchema } from "zod-formik-adapter";
import useAddOperatorMutation from "@/api/mutation/useAddOperatorMutation";
import UserAvatar from "@/components/ui/userAvatar";
import useOperatorStatusMutation from "@/api/mutation/useOperatorStatusMutation";
import {
  OperatorStatusEnumValue,
  UserStatusEnumValue,
} from "@backend/src/schemas/enums";
import useOperatorDeleteMutation from "@/api/mutation/useOperatorsDeleteMutation";
import { toast } from "react-toastify";
<<<<<<< HEAD
import Blocked from "../../assets/svg/Blocked.svg";
import Active from "../../assets/svg/Active.svg";
import Delete from "../../assets/svg/Delete.svg";
import OperartorBackground from "../../assets/operatorHomePageImage.jpg";
=======
>>>>>>> 8c5818bb7fd918c6cd870ad09c51bd4a32c5607d

function OperatorsList() {
  const [data, setData] = useState<operatorDataType[]>([]);
  const [tableData, setTableData] = useState<operatorDataType[]>([]);
  const [selectedTableData, setSelectedTableData] = useState<"ACTIVE" | "BLOCKED">("ACTIVE");
  const [activeOperators, setActiveOperators] = useState<operatorDataType[]>(
    []
  );
  const [blockedOperators, setBlockedOperators] = useState<operatorDataType[]>(
    []
  );

  const [isOpenPopUp, setIsOpenPopUp] = useState(false);
  const operatorsQuery = useOperatorsListQuery();
  const addOperatorsMutation = useAddOperatorMutation();
  const addOperatorsStatusMutation = useOperatorStatusMutation();
  const deleteOperatorsStatusMutation = useOperatorDeleteMutation();

  const handleStatus = (
    id: string,
    status: keyof typeof OperatorStatusEnumValue
  ) => {
    addOperatorsStatusMutation.mutate(
      { userId: id, status: status },
      {
        onSuccess(data) {
          fetchData();
          toast.success(data.data.message);
        },
        onError(err) {
          toast.error(
            err.response?.data?.message ?? "An unexpected error occurred."
          );
        },
      }
    );
  };

  const handleDelete = (id: string) => {
    deleteOperatorsStatusMutation.mutate(id, {
      onSuccess(data) {
        fetchData();
        toast.success(data.data.message);
      },
      onError(err) {
        toast.error(
          err.response?.data?.message ?? "An unexpected error occurred."
        );
      },
    });
  };

  const formik = useFormik<z.infer<typeof operatorSchema>>({
    initialValues: {
      email: "",
    },
    validationSchema: toFormikValidationSchema(operatorSchema),
    onSubmit: (values, helper) => {
      addOperatorsMutation.mutate(values, {
        onSuccess(data) {
          formik.resetForm();
          fetchData();
          setIsOpenPopUp(false);
          toast.success(data.data.message);
        },
        onError(error) {
          if (
            error.response?.status === 400 &&
            error.response.data?.errors &&
            Array.isArray(error.response?.data.errors)
          ) {
            error.response.data.errors.forEach((item) => {
              helper.setFieldError(item.path[0], item.message);
            });
          }
          if (!Array.isArray(error.response?.data.errors)) {
            toast.error(
              error.response?.data?.message ?? "An unexpected error occurred."
            );
          }
        },
      });
    },
  });
  const handleData = () => {
    setData(operatorsQuery.data?.data?.data || []);
    // Reset previous data
    setActiveOperators([]);
    setBlockedOperators([]);
    operatorsQuery.data?.data?.data?.forEach((res) => {
      if (res.status === UserStatusEnumValue.ACTIVE) {
        setActiveOperators((current) => [...current, res]);

      } else if (res.status === UserStatusEnumValue.INACTIVE) {
        setBlockedOperators((current) => [...current, res]);
      }
    });
    if(selectedTableData==="ACTIVE"){
            setTableData([...activeOperators]);
    }else if(selectedTableData==="BLOCKED"){
      setTableData([...blockedOperators]);
    }
  };
  const toggleActiveOperatorData = () => {
    setTableData([...activeOperators]);
    setSelectedTableData("ACTIVE")
    return;
  };
  const toggleBlockedOperatorData = () => {
    setTableData([...blockedOperators]);
    setSelectedTableData("BLOCKED")
    return;
  };
  const fetchData = async () => {
    operatorsQuery.refetch();
      handleData();
  };

  useEffect(() => {
    handleData();
  }, [data, selectedTableData]);

  const close = () => {
    setIsOpenPopUp(false);
  };

  return (
    <>
      <div className="w-full h-full relative overflow-hidden">
        <BackgroundImage />
        {operatorsQuery.isLoading ? (
          <Loader />
        ) : (
          <>
            {data ? (
<<<<<<< HEAD
              <div style={{ backgroundImage: `url(${OperartorBackground})` }}  className=" py-5 p-4 lg:p-14 w-full h-full flex flex-col gap-5 bg-no-repeat bg-cover">
=======
              <div className=" py-5 p-4 lg:p-14 w-full h-full flex flex-col gap-5 bg-[url('./src/assets/operatorHomePageImage.jpg')] bg-no-repeat bg-cover">
>>>>>>> 8c5818bb7fd918c6cd870ad09c51bd4a32c5607d
                <div className="flex justify-between items-center">
                  <h2 className="font-medium text-3xl leading-normal text-gray-600">
                    Operators
                  </h2>
                  <div>
                    <Button
                      variant={"primary"}
                      onClick={() => setIsOpenPopUp(true)}
                    >
                      Add new operator
                    </Button>
                  </div>
                </div>
                {data && (
                  <div className="h-full lg:overflow-hidden overflow-auto items-center bg-white border-[#E7E7E7] border-2 rounded-md p-2 lg:p-6">
                    <div className="flex flex-col w-full  gap-5">
                      <div className="w-full flex">
                        <button type="button"
                          className={`font-bold hover:text-[#1F845A] focus:bg-gray-200 cursor-pointer w-fit h-8 px-5 py-5 ${selectedTableData==="ACTIVE"?"bg-gray-200" : "bg-white"} border rounded justify-center items-center gap-px inline-flex`}
                          onClick={() => toggleActiveOperatorData()}
                        >
                          Active
<<<<<<< HEAD
                          <img src={Active} alt="" />
=======
                          <img src="./src/assets/svg/Active.svg" alt="" />
>>>>>>> 8c5818bb7fd918c6cd870ad09c51bd4a32c5607d
                        </button>

                        <button  type="button"
                          className={`font-bold hover:text-[#C42C2C] focus:bg-gray-200 cursor-pointer w-fit h-8 px-5 py-5 ml-2 ${selectedTableData==="BLOCKED"?"bg-gray-200" : "bg-white"} border rounded justify-center items-center gap-px inline-flex`}
                          onClick={() => toggleBlockedOperatorData()}
                        >
                          Blocked
<<<<<<< HEAD
                          <img src={Blocked} alt="" />
=======
                          <img src="./src/assets/svg/Blocked.svg" alt="" />
>>>>>>> 8c5818bb7fd918c6cd870ad09c51bd4a32c5607d
                        </button>
                      </div>
                   
                      {tableData.length != 0 ? (
                        <div className="h-full w-full overflow-auto">
                          <div className="lg:visible collapse flex gap-5 h-fit w-full py-2 flex-wrap">
                            {tableData.map((res, index) => (
                              <div
                                key={index}
                                className="group relative overflow-hidden flex flex-col gap-5 lg:w-[176px] lg:h-[164px] h-0 w-0 lg:justify-between items-center bg-primary-50 hover:bg-primary-100 border-[1px] border-[#FFE388] rounded-md lg:p-2"
                              >
                                <div className="flex flex-col items-center justify-between h-3/5 w-3/5 gap-2">
                                  <div className="flex items-center rounded-full border-2 h-full w-full min-w-[100px] min-h-[100px] ">
                                    <UserAvatar
                                      user={res}
                                      className="w-full h-full"
                                    />
                                    <div></div>
                                  </div>
                                  <div className="flex flex-col items-center">
                                    <a className="group-hover:text-primary-800 font-semibold text-base text-center overflow-hidden max-w-[140px] w-fit text-ellipsis">
                                      {res.firstName} {res.lastName}
                                    </a>
                                    <a className="group-hover:text-primary-500 text-gray-300   text-xs font-semibold text-center overflow-hidden max-w-[140px] w-fit text-ellipsis">
                                      {res.email}
                                    </a>
                                  </div>
                                </div>
                                <div className="group-hover:visible flex w-full absolute top-0 right-0">
                                  <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                      <div className="group-hover:text-primary-600 boldf cursor-pointer text-end w-full h-8 px-3 py-1.5">
                                        ...
                                      </div>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent className="w-11 flex flex-col gap-1">
                                    {selectedTableData===UserStatusEnumValue.ACTIVE?(
                                                <DropdownMenuItem
                                                onClick={() =>
                                                  handleStatus(
                                                    res.userId,
                                                    UserStatusEnumValue.INACTIVE
                                                  )
                                                }
                                              >
                                                <img
                                                  className="mr-2 h-4 w-4 text-[#44546F]"
<<<<<<< HEAD
                                                  src={Blocked}
=======
                                                  src="./src/assets/svg/Blocked.svg"
>>>>>>> 8c5818bb7fd918c6cd870ad09c51bd4a32c5607d
                                                />
                                                <span className="p-0 font-normal h-auto">
                                                  Block
                                                </span>
                                              </DropdownMenuItem>
                                              ):(
                                                <DropdownMenuItem
                                                onClick={() =>
                                                  handleStatus(
                                                    res.userId,
                                                    UserStatusEnumValue.ACTIVE
                                                  )
                                                }
                                              >
                                                <img
                                                  className="mr-2 h-4 w-4 text-[#44546F]"
<<<<<<< HEAD
                                                  src={Active}
=======
                                                  src="./src/assets/svg/Active.svg"
>>>>>>> 8c5818bb7fd918c6cd870ad09c51bd4a32c5607d
                                                />
                                                <span className="p-0 font-normal h-auto">
                                                  Retrieve
                                                </span>
                                              </DropdownMenuItem>
                                              
                                              )}
                                      <DropdownMenuSeparator className="mx-1" />
                                      <DropdownMenuItem
                                        onClick={() => handleDelete(res.userId)}
                                      >
                                        <img
                                          className="mr-2 h-4 w-4 text-[#44546F]"
<<<<<<< HEAD
                                          src={Delete}
=======
                                          src="./src/assets/svg/Delete.svg"
>>>>>>> 8c5818bb7fd918c6cd870ad09c51bd4a32c5607d
                                        />
                                        <span className="p-0 font-normal h-auto">
                                          Delete
                                        </span>
                                      </DropdownMenuItem>
                                    </DropdownMenuContent>
                                  </DropdownMenu>
                                </div>
                              </div>
                            ))}
                          </div>
                          <div className="lg:h-0 lg:w-0 w-full h-full lg:collapse ">
                            <div className="h-[95%]">
                              {tableData && (
                                <Table
                                  key="Operator View"
                                  columnDef={[
                                    {
                                      key: "avatar",
                                      header: "Avatar",
<<<<<<< HEAD
                                      onCellRender: (res) => (
=======
                                      onCellRender: (res: any) => (
>>>>>>> 8c5818bb7fd918c6cd870ad09c51bd4a32c5607d
                                        <>
                                          <div className="w-1/2 h-fit items-center rounded-full p-2">
                                            <UserAvatar
                                              user={res}
                                              className="w-[32px] h-[32px] "
                                            />
                                          </div>
                                        </>
                                      ),
                                    },
                                    {
                                      key: "user",
                                      header: "Full Name",
<<<<<<< HEAD
                                      onCellRender: (res) => (
=======
                                      onCellRender: (res: any) => (
>>>>>>> 8c5818bb7fd918c6cd870ad09c51bd4a32c5607d
                                        <>
                                          {res.firstName
                                            ? res.firstName
                                            : "" + " " + res.lastName
                                            ? res.lastName
                                            : ""}
                                        </>
                                      ),
                                    },
                                    {
                                      key: "email",
                                      header: "Email",
<<<<<<< HEAD
                                      onCellRender: (res) => (
=======
                                      onCellRender: (res: any) => (
>>>>>>> 8c5818bb7fd918c6cd870ad09c51bd4a32c5607d
                                        <>{res.email}</>
                                      ),
                                    },
                                    {
                                      key: "Action",
                                      header: "Action",
<<<<<<< HEAD
                                      onCellRender: (res) => (
=======
                                      onCellRender: (res: any) => (
>>>>>>> 8c5818bb7fd918c6cd870ad09c51bd4a32c5607d
                                        <>
                                          <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                              <div className="cursor-pointer w-24 h-8 px-3 py-1.5 bg-white border rounded justify-center items-center gap-px inline-flex">
                                                Edit
                                              </div>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent className="w-11 flex flex-col gap-1">
                                              {selectedTableData===UserStatusEnumValue.ACTIVE?(
                                                <DropdownMenuItem
                                                onClick={() =>
                                                  handleStatus(
                                                    res.userId,
                                                    UserStatusEnumValue.INACTIVE
                                                  )
                                                }
                                              >
                                                <img
                                                  className="mr-2 h-4 w-4 text-[#44546F]"
<<<<<<< HEAD
                                                  src={Blocked}
=======
                                                  src="./src/assets/svg/Blocked.svg"
>>>>>>> 8c5818bb7fd918c6cd870ad09c51bd4a32c5607d
                                                />
                                                <span className="p-0 font-normal h-auto">
                                                  Block
                                                </span>
                                              </DropdownMenuItem>
                                              ):(
                                                <DropdownMenuItem
                                                onClick={() =>
                                                  handleStatus(
                                                    res.userId,
                                                    UserStatusEnumValue.ACTIVE
                                                  )
                                                }
                                              >
                                                <img
                                                  className="mr-2 h-4 w-4 text-[#44546F]"
<<<<<<< HEAD
                                                  src={Active}
=======
                                                  src="./src/assets/svg/Active.svg"
>>>>>>> 8c5818bb7fd918c6cd870ad09c51bd4a32c5607d
                                                />
                                                <span className="p-0 font-normal h-auto">
                                                  Retrieve{selectedTableData}
                                                </span>
                                              </DropdownMenuItem>
                                              
                                              )}
                                              <DropdownMenuSeparator className="mx-1" />
                                              <DropdownMenuItem
                                                onClick={() =>
                                                  handleDelete(res.userId)
                                                }
                                              >
                                                <img
                                                  className="mr-2 h-4 w-4 text-[#44546F]"
<<<<<<< HEAD
                                                  src={Delete}
=======
                                                  src="./src/assets/svg/Delete.svg"
>>>>>>> 8c5818bb7fd918c6cd870ad09c51bd4a32c5607d
                                                />
                                                <span className="p-0 font-normal h-auto">
                                                  Delete
                                                </span>
                                              </DropdownMenuItem>
                                            </DropdownMenuContent>
                                          </DropdownMenu>
                                        </>
                                      ),
                                    },
                                  ]}
                                  data={tableData}
                                />
                              )}
                              {!data && (
                                <div className="flex justify-center p-3 w-full">
                                  No organisations available
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className="flex gap-5 h-fit w-full py-2 min-h-[164px] text-center justify-center items-center">
                            No active operators found
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <></>
            )}
            {isOpenPopUp && (
              <div className="fixed z-50 w-full h-full top-0 bg-black/40 flex items-center align-center justify-center">
<<<<<<< HEAD
                <div   className="operatorForm-background-image h-1/3 min-h-fit py-2 lg:w-2/6 w-4/5 flex flex-col justify-evenly lg:gap-1 gap-1 rounded-lg bg-white px-3 bg-no-repeat bg-cover">
=======
                <div className="h-1/3 min-h-fit py-2 lg:w-2/6 w-4/5 flex flex-col justify-evenly lg:gap-1 gap-1 rounded-lg bg-white px-3 bg-[url('./src/assets/operatorForm.jpg')] bg-no-repeat bg-cover">
>>>>>>> 8c5818bb7fd918c6cd870ad09c51bd4a32c5607d
                  <div className="flex justify-between lg:py-5 py-2">
                    <div className="text-2xl lg:text-3xl font-bold text-gray-500 lg:px-4 px-4">
                      Add Operator
                    </div>
                    <div
                      onClick={close}
                      className="flex items-center justify-center cursor-pointer lg:px-6 px-4"
                    >
                      <img src={CrossIcon}></img>
                    </div>
                  </div>
                  <form
                    className="flex flex-col lg:gap-5 gap-2 px-4"
                    onSubmit={formik.handleSubmit}
                  >
                    <a className="font-bold mt-2">Email</a>
                    <input
                      type="email"
                      name="email"
                      className="p-2 text-black border-2 rounded-lg border-black/10"
                      placeholder="operator@gmail.com"
                      value={formik.values.email}
                      onChange={formik.handleChange}
                    ></input>
                    <div className="flex items-end justify-end lg:mt-8 ">
                      <Button type="submit" variant={"primary"}>
                        Add
                      </Button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}
export default OperatorsList;
