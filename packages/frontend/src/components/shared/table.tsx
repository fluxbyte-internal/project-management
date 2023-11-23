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
  }, [data, height, tableRowHeight,ascendingToggle]);

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

  function compare(a: string, b: string) {
    let valStringA;
    let valStringB;
    if (
      !isNaN(Date.parse(new Date(a).toString())) &&
      !isNaN(Date.parse(new Date(a).toString()))
    ) {
      valStringA = new Date(a);
      valStringB = new Date(b);
    } else if (!isNaN(parseInt(a)) && !isNaN(parseInt(a))) {
      valStringA = parseInt(a);
      valStringB = parseInt(b);
    } else {
      valStringA = a;
      valStringB = b;
    }

    if (ascendingToggle) {
      if (valStringA > valStringB) {
        return 1;
      } else if (valStringA < valStringB) {
        return -1;
      } else {
        return 0;
      }
    } else {
      if (valStringA < valStringB) {
        return 1;
      } else if (valStringA > valStringB) {
        return -1;
      } else {
        return 0;
      }
    }
  }

  const shorting = (key: string) => {
    setDataSource(data.sort((a, b) => compare(a[key], b[key])));
    setCurrentPage(1);
    setAscendingToggle((prev) => !prev);
  };

  return (
    <>
      <div
        ref={table}
        className="py-9 px-3 relative border rounded-md text-sm h-[90%] overflow-y-hidden overflow-x-auto"
      >
        <table className="w-full">
          <thead>
            <tr className="text-left border-b border-[#D1D1D1] ">
              {columnDef.map((item, index) => {
                return (
                  <th className="px-2.5 lg:px-0 py-1" key={index}>
                    {item.sorting ? (
                      <>
                        <div
                          className="flex  gap-1 items-center cursor-pointer group"
                          onClick={() => shorting(item.key)}
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
                        className="px-2.5 max-md:truncate lg:break-words lg:px-0 py-2.5 max-w-[25ch] lg:max-w-[15ch]"
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
          <div className="flex gap-3 fixed max-w-full bottom-12 right-6 -translate-x-5 -translate-y-0  sm:bottom-14 sm:right-14 p-0 sm:p-3 justify-end items-center mb-1">
            <button
              className="disabled:opacity-50 p-2"
              onClick={previousPage}
              disabled={currentPage <= 1}
            >
              <img src={arrowImg} className="w-3" />
            </button>
            {currentPage}/{pages}
            <button
              className="disabled:opacity-50 p-2"
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
