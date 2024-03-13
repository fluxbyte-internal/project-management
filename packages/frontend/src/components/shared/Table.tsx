import { useCallback, useEffect, useRef, useState } from "react";
import arrowImg from "../../assets/svg/Arrow.svg";
import downArrow from "../../assets/svg/DownArrow.svg";
import Select from "react-select";
export type ColumeDef = {
  key: string;
  header: string;
  sorting?: boolean;
  onCellRender?: (data: any) => JSX.Element;
  onHeaderRender?: (header: string) => JSX.Element;
};
export type Props = {
  columnDef?: ColumeDef[];
  data: any[];
  className?: string;
  hidePagination?: boolean;
  hideHeaders?: boolean;
  onAccordionRender?: (data: any) => JSX.Element;
};

const pageOptions = [
  { label: 10, value: 10 },
  { label: 25, value: 25 },
  { label: 50, value: 50 },
  { label: 100, value: 100 },
];

function Table(props: Props) {
  const { columnDef, data, className } = props;
  const [dataSource, setDataSource] = useState(data);

  const [dataPerPage, setDataPerPage] = useState(pageOptions[0].value);
  const [pages, setPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  const [ascendingToggle, setAscendingToggle] = useState<boolean>(false);
  const [accordions, setAccordionshow] = useState<number | null>();
  const table = useRef<HTMLDivElement>(null);
  const tableRow = useRef<HTMLTableRowElement>(null);
  useEffect(() => {
    if (!props.hidePagination) {
      setDataSource(data.slice(0, dataPerPage));
      const count = Math.ceil(data.length / dataPerPage);
      setPages(count);
    } else {
      setDataSource(data);
    }
    setCurrentPage(1);
  }, [data, dataPerPage, props.hidePagination,props]);

  const nextPage = () => {
    if (currentPage < pages) {
      const newCurrentPage = currentPage + 1;
      const [startIndex, endIndex] = calculateIndices(newCurrentPage);
      changePage(newCurrentPage, startIndex, endIndex);
    }
  };
  const previousPage = () => {
    if (currentPage >= 1) {
      const newCurrentPage = currentPage - 1;
      const [startIndex, endIndex] = calculateIndices(newCurrentPage);
      changePage(newCurrentPage, startIndex, endIndex);
    }
  };
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
        outline: state.isFocused ? "1px solid #943B0C" : "1px solid #E7E7E7",
        boxShadow: "0px 0px 0px #943B0C",
      },
    }),
  };

  const calculateIndices = useCallback(
    (page: number) => {
      const startIndex = (page - 1) * dataPerPage;
      const endIndex = startIndex + dataPerPage;
      return [startIndex, endIndex];
    },
    [dataPerPage]
  );

  const changePage = useCallback(
    (newPage: number, startIndex: number, endIndex: number) => {
      setCurrentPage(newPage);
      setDataSource(data.slice(startIndex, endIndex));
    },
    [data]
  );

  function dynamicSort(property: any) {
    return function (a: string, b: string) {
      let aValue, bValue;

      aValue = a[property];
      bValue = b[property];

      if (typeof aValue === "string") {
        aValue = aValue.toUpperCase();
        bValue = bValue.toUpperCase();
      }

      if (isValidDate(aValue) && isValidDate(bValue)) {
        const [aDay, aMonth, aYear] = parseDate(aValue);
        const [bDay, bMonth, bYear] = parseDate(bValue);

        aValue = new Date(`${aYear}-${aMonth}-${aDay}`);
        bValue = new Date(`${bYear}-${bMonth}-${bDay}`);
      }
      if (typeof aValue === "string" && !isNaN(Number(aValue))) {
        aValue = Number(aValue);
      }

      if (typeof bValue === "string" && !isNaN(Number(bValue))) {
        bValue = Number(bValue);
      }
      let comparison = 0;

      if (aValue > bValue) {
        comparison = 1;
      } else if (aValue < bValue) {
        comparison = -1;
      }

      return !ascendingToggle ? comparison * -1 : comparison;
    };
  }
  function toggle(index: number) {
    if (index == accordions) {
      setAccordionshow(null);
    } else {
      setAccordionshow(index);
    }
  }

  function isValidDate(dateString: string) {
    const regex = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/;
    return regex.test(dateString);
  }
  function parseDate(dateString: string) {
    const [day, month, year] = dateString.split("/").map(Number);
    return [day, month, year];
  }

  const sorting = (key: string) => {
    setAccordionshow(null);
    setDataSource(data.sort(dynamicSort(key)));
    setCurrentPage(1);
    setAscendingToggle((prev) => !prev);
  };

  return (
    <>
      <div
        ref={table}
        className={`py-9 pb-3 flex flex-col justify-between bg-white px-6 border rounded-md text-sm h-full w-full ${
          className ?? ""
        }`}
      >
        <div className="overflow-auto">
          <table className="w-full">
            {!props.hideHeaders && (
              <thead>
                <tr className="text-left border-b border-[#D1D1D1] ">
                  {props.onAccordionRender &&
                    dataSource.filter(
                      (item) =>
                        props.onAccordionRender &&
                        props.onAccordionRender(item).props.children
                    ).length > 0 && <th></th>}
                  {columnDef &&
                    columnDef.map((item, index) => {
                      return (
                        <th
                          className="py-2.5 px-2 w-fit whitespace-nowrap "
                          key={index}
                        >
                          {item.sorting ? (
                            <>
                              <div
                                className="flex gap-1 items-center cursor-pointer group"
                                onClick={() => sorting(item.key)}
                              >
                                {item.onHeaderRender && item.header
                              ? item.onHeaderRender(item["header"])
                              : item["header"] }
                                <img
                                  src={downArrow}
                                  className={`${
                                    !ascendingToggle ? "rotate-180" : ""
                                  } group-hover:opacity-50 opacity-0 `}
                                />
                              </div>
                            </>
                          ) : (
                            item.onHeaderRender && item.header
                              ? item.onHeaderRender(item["header"])
                              : item["header"]  
                          )}
                        </th>
                      );
                    })}
                </tr>
              </thead>
            )}
            <tbody>
              {dataSource.map((item, index) => {
                return (
                  <>
                    <tr
                      ref={tableRow}
                      className="border-b border-gray-100/50"
                      key={index}
                    >
                      {props.onAccordionRender &&
                        dataSource.filter(
                          (item) =>
                            props.onAccordionRender &&
                            props.onAccordionRender(item).props.children
                        ).length > 0 && (
                          <td onClick={() => toggle(index)} className="cursor-pointer">
                            <div>
                              {item.subtasks.length > 0 && (
                                <div className="img w-3.5 h-3.5">
                                  <img src={downArrow} />
                                </div>
                              )}
                            </div>
                          </td>
                        )}
                      {columnDef &&
                        columnDef.map((key: ColumeDef) => {
                          return (
                            <>
                              <td
                                className="px-2 py-2.5 max-md:truncate lg:break-words "
                                key={key.key}
                              >
                                {key.onCellRender && key.key
                                  ? key.onCellRender({ index: index, ...item })
                                  : null ?? item[key.key]}
                              </td>
                            </>
                          );
                        })}
                    </tr>
                    {accordions === index && (
                      <tr>
                        <td colSpan={columnDef?.length ? columnDef?.length + 1 :columnDef?.length }>
                          <div
                            className={`rounded-xl flex justify-center ${
                              props.onAccordionRender &&
                              props.onAccordionRender(item).props.children
                                ? "p-2 py-3  bg-slate-200/30"
                                : ""
                            } `}
                          >
                            {props.onAccordionRender &&
                              props.onAccordionRender(item)}
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                );
              })}
            </tbody>
          </table>
        </div>

        <div>
          {!props.hidePagination && (
            <div className="justify-between items-center mb-2 flex">
              <div>
                <Select
                  className="w-24"
                  defaultValue={pageOptions.find(
                    (page) => page.value == dataPerPage
                  )}
                  options={pageOptions}
                  menuPlacement="auto"
                  styles={reactSelectStyle}
                  onChange={(e) => setDataPerPage(Number(e?.value))}
                />
              </div>
              <div className="flex gap-2 items-center">
                <div className="text-gray-400/80 mr-5">
                  {calculateIndices(currentPage)[0] + 1} -{" "}
                  {calculateIndices(currentPage)[1] > data.length
                    ? data.length
                    : calculateIndices(currentPage)[1]}{" "}
                  of {data.length}
                </div>
                <button
                  className="disabled:opacity-50 "
                  onClick={previousPage}
                  disabled={currentPage <= 1}
                >
                  <img src={arrowImg} className="w-3" />
                </button>
                {currentPage}/{pages}
                <button
                  className="disabled:opacity-50 "
                  onClick={nextPage}
                  disabled={currentPage === pages}
                >
                  <img
                    src={arrowImg}
                    className="rotate-180 w-3"
                    width={18}
                    height={10}
                  />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default Table;
