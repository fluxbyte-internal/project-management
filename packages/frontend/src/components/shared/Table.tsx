import { useCallback, useEffect, useRef, useState } from "react";
import arrowImg from "../../assets/svg/Arrow.svg";
import downArrow from "../../assets/svg/DownArrow.svg";
export type ColumeDef = {
  key: string;
  header: string;
  sorting?: boolean;
  onCellRender?: (data: any) => JSX.Element;
};
export type Props = {
  columnDef: ColumeDef[];
  data: any[];
};

function Table(props: Props) {
  const { columnDef, data } = props;
  const [dataSource, setDataSource] = useState(data);
  const [height, setHeight] = useState(0);
  const [tableRowHeight, setTableRowHeight] = useState(0);
  const [dataPerPage, setDataPerPage] = useState(0);
  const [pages, setPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  const [ascendingToggle, setAscendingToggle] = useState<boolean>(false);

  const table = useRef<HTMLDivElement>(null);
  const tableRow = useRef<HTMLTableRowElement>(null);

  useEffect(() => {
    if (table.current && tableRow.current) {
      setHeight(table.current.offsetHeight);
      setTableRowHeight(tableRow.current.offsetHeight);
      const length = parseInt((height / tableRowHeight).toFixed()) - 2;
      setDataPerPage(length);
      if (!isNaN(length)) {
        setDataSource(data.slice(0, length));
        const count = Math.ceil(data.length / length);
        setPages(count);
      }
    }
  }, [data, height, tableRowHeight, ascendingToggle]);

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

  function isValidDate(dateString: string) {
    const regex = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/;
    return regex.test(dateString);
  }
  function parseDate(dateString: string) {
    const [day, month, year] = dateString.split("/").map(Number);
    return [day, month, year];
  }

  const sorting = (key: string) => {
    setDataSource(data.sort(dynamicSort(key)));
    setCurrentPage(1);
    setAscendingToggle((prev) => !prev);
  };

  return (
    <>
      <div
        ref={table}
        className="py-9 sm:pb-9 bg-white px-6 relative border rounded-md text-sm h-[90%] overflow-y-hidden overflow-x-auto"
      >
        <table className="w-full">
          <thead>
            <tr className="text-left border-b border-[#D1D1D1] ">
              {columnDef.map((item, index) => {
                return (
                  <th
                    className="py-2.5 px-2 w-fit whitespace-nowrap"
                    key={index}
                  >
                    {item.sorting ? (
                      <>
                        <div
                          className="flex gap-1 items-center cursor-pointer group"
                          onClick={() => sorting(item.key)}
                        >
                          {item.header}
                          <img
                            src={downArrow}
                            className={`${!ascendingToggle ? "rotate-180" : "" } group-hover:opacity-50 opacity-0 `}
                          />
                        </div>
                      </>
                    ) : (
                      item.header
                    )}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {dataSource.map((item, index) => {
              return (
                <tr ref={tableRow} className="border-b" key={index}>
                  {columnDef.map((key: ColumeDef) => {
                    return (
                      <td
                        className="px-2 py-2.5 max-md:truncate lg:break-words "
                        key={key.key}
                      >
                        {" "}
                        {key.onCellRender && key.key
                          ? key.onCellRender(item)
                          : null ?? item[key.key]}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
        {dataPerPage < data.length && (
          <div className="flex gap-x-3 gap-y-5 fixed sm:absolute max-w-full bottom-[3%]  right-[7%]  sm:bottom-[0%] sm:right-[1%] p-0 justify-end items-center mb-2">
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
        )}
      </div>
    </>
  );
}

export default Table;
