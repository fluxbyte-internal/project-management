import Table, { ColumeDef } from "@/components/shared/Table";
import dateFormatter from "@/helperFuntions/dateFormater";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import Loader from "@/components/common/Loader";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link } from "react-router-dom";
import Select, { SingleValue } from "react-select";
import CalendarSvg from "../../assets/svg/Calendar.svg";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@radix-ui/react-popover";
import { Calendar } from "@/components/ui/calendar";
import { DateRange } from "react-day-picker";
import useOrganisationsListQuery, {
  OrganisationsType,
} from "@/api/query/organisationListQuery";
import useOrganisationStatusMutation from "@/api/mutation/useOrganisationStatusMutation";
import { OrgStatusEnumValue } from "@backend/src/schemas/enums";
import { toast } from "react-toastify";
import useDeleteOrganisationMutation from "@/api/mutation/useDeleteOrganisationDeleteMutation";

type Options = { label: string; value: string };

function AdminConsole() {
  const [data, setData] = useState<OrganisationsType[]>();
  const [filterData, setFilterData] = useState<OrganisationsType[]>();
  const [filter, setFilter] = useState<{
    industry: SingleValue<Options> | null;
    country: SingleValue<Options> | null;
    status: SingleValue<Options> | null;
    date: DateRange | undefined;
  }>({
    industry: null,
    country: null,
    status: null,
    date: undefined,
  });
  const useOrganisationStatusApi = useOrganisationStatusMutation();
  const organisationQuery = useOrganisationsListQuery();
  const deleteOrganisationMutation = useDeleteOrganisationMutation();
  useEffect(() => {
    setData(organisationQuery.data?.data?.data);
    setFilterData(organisationQuery.data?.data?.data);
  }, [organisationQuery.data?.data]);
const handleDelete = (organisationId:string) =>{
  deleteOrganisationMutation.mutate(
    organisationId,
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
  )
}
  const handleView = (id: string, status: keyof typeof OrgStatusEnumValue) => {
    useOrganisationStatusApi.mutate(
      { OrganisationId: id, status: status },
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
  const industry = (): Options[] | undefined => {
    const industryData: any[] | undefined = [
      { label: "Select industry", value: "" },
    ];
    data?.forEach((item) => {
      const val = item.industry;
      if (!industryData.some((i) => i.value == item.industry)) {
        industryData.push({ label: val, value: val });
      }
    });
    return industryData;
  };
  const country = (): Options[] | undefined => {
    const countryData: Options[] | undefined = [
      { label: "Select Country", value: "" },
    ];
    data?.forEach((item) => {
      const val = item.country;
      if (!countryData.some((i) => i.value == item.country)) {
        countryData.push({ label: val, value: val });
      }
    });
    return countryData;
  };
  const status = (): Options[] | undefined => {
    const statusData: Options[] | undefined = [
      { label: "Select status", value: "" },
    ];
    data?.forEach((item) => {
      if (!statusData.some((i) => i.value == item.status)) {
        statusData.push({ label: item.status, value: item.status });
      }
    });

    return statusData;
  };

  const columnDef: ColumeDef[] = [
    {
      key: "organisationName",
      header: "Organisation Name",
      onCellRender: (userData: any) => {
        const adminUser = userData.userOrganisation.find((res: any) => res.role === "ADMINISTRATOR" && res.user.status === "ACTIVE");
        return (
          <>
            {adminUser ? (<>  <Link
              to={"/organisationUsers"}
              className=""
              state={userData.userOrganisation}
            >
              {userData.organisationName}
            </Link></>
            ) : (
              
               <Link
              to={"/organisationUsers"}
              className="flex gap-3 items-center text-center"
              state={userData.userOrganisation}
            >
              {userData.organisationName}<img   className="h-[20px] w-[20px] text-[#44546F]"
              src="./src/assets/svg/Alert.svg"></img>
            </Link>
            )}
          </>
        );
      },
    },
    {
      key: "status",
      header: "Status",
      onCellRender: (item: any) => (
        <>
         <div
            className={`w-32 h-8 px-3 py-1.5 ${
              item.status === "ACTIVE" ? "bg-cyan-100 text-cyan-700" : "bg-red-500 text-white"
            } rounded justify-center items-center gap-px inline-flex`}
          >
            <div className=" text-xs font-medium leading-tight">
              {item.status}
            </div>
          </div>
        </>
      ),
    },
    {
      key: "industry",
      header: "industry",
    },
    {
      key: "joinDate",
      header: "Joining Date",

      onCellRender: (item: any) => (
        <>{dateFormatter(new Date(item.createdAt))}</>
      ),
    },
    {
      key: "country",
      header: "Country",
    },
    {
      key: "Action",
      header: "Action",
      onCellRender: (item: any) => (
        <>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="cursor-pointer w-24 h-8 px-3 py-1.5 bg-white border rounded justify-center items-center gap-px inline-flex">
                Edit
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-11 flex flex-col gap-1">
             {(item.status === "ACTIVE") && (
              <> <DropdownMenuItem
                onClick={() => handleView(item.organisationId, "DEACTIVE")}
              >
                <img
                  className="mr-2 h-4 w-4 text-[#44546F]"
                  src="./src/assets/svg/Blocked.svg"
                />
                <span className="p-0 font-normal h-auto">Block</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="mx-1" />
              </>
              )}
              {(item.status === "DEACTIVE") && (
                <>
                      <DropdownMenuItem
                onClick={() => handleView(item.organisationId, "ACTIVE")}
              >
                <img
                  className="mr-2 h-4 w-4 text-[#44546F]"
                  src="./src/assets/svg/Active.svg"
                />
                <span className="p-0 font-normal h-auto">Retrieve</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="mx-1" />
                </>
              )}
              <DropdownMenuItem
                onClick={() => handleDelete(item.organisationId)}
              >
                <img
                  className="mr-2 h-4 w-4 text-[#44546F]"
                  src="./src/assets/svg/Delete.svg"
                />
                <span className="p-0 font-normal h-auto">Delete</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </>
      ),
    }
  ];
  const reactSelectStyle = {
    control: (
      provided: Record<string, unknown>,
      state: { isFocused: boolean }
    ) => ({
      ...provided,
      border: "1px solid #E7E7E7",
      paddingTop: "0.2rem",
      paddingBottom: "0.2rem",
      outline: state.isFocused ? "2px solid #943B0C" : "0px solid #E7E7E7",
      boxShadow: state.isFocused ? "0px 0px 0px #943B0C" : "none",
      "&:hover": {
        outline: state.isFocused ? "2px solid #943B0C" : "0px solid #E7E7E7",
        boxShadow: "0px 0px 0px #943B0C",
      },
    }),
  };

  let filteredData = data;
  useEffect(() => {
    setFilterData(filteredData);
    if (filter && filter.status && filter.status.value) {
      filteredData = filteredData?.filter(
        (d) => d.status === filter.status?.value
      );
    } else if (filter && filter.date?.from && filter.date?.to) {
      filteredData = filteredData?.filter((d) => {
        return (
          new Date(d.createdAt) >= (filter.date?.from ?? new Date()) &&
          new Date(d.createdAt) <= (filter.date?.to ?? new Date())
        );
      });
    } else if (filter && filter.industry && filter.industry.value) {
      console.log(filter);
      filteredData = filteredData?.filter(
        (d) => d.industry === filter.industry?.value
      );
    } else if (filter && filter.country && filter.country.value) {
      console.log(filter);
      filteredData = filteredData?.filter(
        (d) => d.country === filter.country?.value
      );
    } else {
      setFilterData(data);
    }
    setFilterData(filteredData);
  }, [filter, data]);

  const reset = () => {
    setFilter({
      industry: null,
      country: null,
      date: undefined,
      status: null,
    });
    setFilterData(data);
  };

const fetchData=()=>{
  organisationQuery.refetch();
  setData(organisationQuery.data?.data?.data);
  setFilterData(organisationQuery.data?.data?.data);
}

  return (
    <>
      <div className="w-full h-full relative bg-[url('./src/assets/operatorHomePageImage.jpg')] bg-no-repeat bg-cover">
        {organisationQuery.isLoading ? (
          <Loader />
        ) : (
          <>
            {data && data.length > 0 ? (
              <div className="h-full py-5 p-4 lg:p-14 w-full flex flex-col gap-5 bg-[url('./src/assets/operatorHomePageImage.jpg')] bg-no-repeat bg-cover">
                <div className="flex justify-between items-center">
                  <h2 className="font-medium text-3xl leading-normal text-gray-600">
                    Organisations
                  </h2>
                </div>
                {data && (
                  <div className="flex justify-around items-center flex-col lg:flex-row gap-3 ">
                    <div className="lg:w-1/6 w-full">
                      <Select
                        className="p-0 z-40"
                        value={
                          filter.industry || {
                            label: "Select industry",
                            value: "",
                          }
                        }
                        options={industry()}
                        onChange={(e) =>
                          setFilter((prev) => ({ ...prev, industry: e }))
                        }
                        placeholder="Select industry"
                        styles={reactSelectStyle}
                      />
                    </div>
                    <div className="lg:w-1/6 w-full">
                      <Select
                        value={
                          filter.status || { label: "Select status", value: "" }
                        }
                        className="p-0 z-1"
                        options={status()}
                        onChange={(e) =>
                          setFilter((prev) => ({ ...prev, status: e }))
                        }
                        placeholder="Select status"
                        styles={reactSelectStyle}
                      />
                    </div>
                    <div className="lg:w-1/6 w-full">
                      <Select
                        className="p-0 z-1"
                        value={
                          filter.country || {
                            label: "Select country",
                            value: "",
                          }
                        }
                        options={country()}
                        onChange={(e) =>
                          setFilter((prev) => ({ ...prev, country: e }))
                        }
                        placeholder="Select country"
                        styles={reactSelectStyle}
                      />
                    </div>
                    <div className="lg:w-1/6 w-full">
                      <Popover>
                        <PopoverTrigger className="w-full">
                          <Button
                            variant={"outline"}
                            className="w-full h-11 py-1"
                          >
                            <div className="flex justify-between items-center w-full text-gray-400 font-normal">
                              {filter.date
                                ? `${dateFormatter(
                                    filter.date.from ?? new Date()
                                  )}-
                              ${dateFormatter(filter.date.to ?? new Date())}`
                                : "Joining date"}
                              <img src={CalendarSvg} width={20} />
                            </div>
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className=" bg-white !z-10 ">
                          <div>
                            <Calendar
                              mode="range"
                              selected={filter.date}
                              onSelect={(e) =>
                                setFilter((prev) => ({ ...prev, date: e }))
                              }
                              className="rounded-md border"
                            />
                          </div>
                        </PopoverContent>
                      </Popover>
                    </div>
                    <div>
                      <Button
                        variant={"outline"}
                        className="h-11 py-1 bg-gray-100/50"
                        onClick={reset}
                      >
                        Clear
                      </Button>
                    </div>
                  </div>
                )}
                <div className="h-[80%]">
                  {filterData && (
                    <Table
                      key="Organisation view"
                      columnDef={columnDef}
                      data={filterData}
                    />
                  )}
                  {!data && (
                    <div className="flex justify-center p-3 w-full">
                      No data available for this organisation.
                    </div>
                  )}
                </div>
              </div>
            ) : (
              ""
            )}
          </>
        )}
      </div>
    </>
  );
}

export default AdminConsole;
