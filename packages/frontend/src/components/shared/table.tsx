import { useCallback, useEffect, useRef, useState } from "react";
import arrowImg from "../../assets/png/arrow.png";
export type columeDef = {
  key: string;
  label: string;
  onCellRender?: (data: any) => JSX.Element;
};
export type Props = {
  columnDef: columeDef[];
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
  }, [data, height, tableRowHeight]);

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

  return (
    <>
      <div
        ref={table}
        className="py-9 px-3 border rounded-md text-sm h-[90%] overflow-y-hidden overflow-x-auto"
      >
        <table className="w-full">
          <thead>
            <tr className="text-left border-b border-[#D1D1D1] ">
              {columnDef.map((item, index) => {
                return (
                  <th className="px-2.5 lg:px-0 py-1" key={index}>
                    {item.label}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {dataSource.map((item, index) => {
              return (
                <tr ref={tableRow} className="border-b" key={index}>
                  {columnDef.map((key: columeDef) => {
                    return (
                      <td
                        className="px-2.5 max-md:truncate lg:break-words lg:px-0 py-2.5 max-w-[25ch] lg:max-w-[15ch]"
                        key={key.key}
                      >
                        {" "}
                        {key.onCellRender
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
          <div className="flex gap-3 fixed bottom-16 right-8 lg:bottom-16 lg:right-20 justify-end items-center mb-1">
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
