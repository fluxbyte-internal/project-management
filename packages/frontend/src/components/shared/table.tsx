export type columeDef = {
  key: string;
  label: string;
  onCellRender?: (data: any) => JSX.Element | string;
};
export type Props = {
  columnDef: columeDef[];
  data: any[];
};

function Table(props: Props) {
  const { columnDef, data } = props;
  return (
    <>
      <div className="py-10 px-3 border rounded-md text-sm ">
        <table className="w-full">
          <thead>
            <tr className="text-left border-b border-[#D1D1D1]">
              {columnDef.map((item,index) => {
                return <th key={index}>{item.label}</th>;
              })}
            </tr>
          </thead>
          <tbody>
            {data.map((item,index) => {
              return (
                <tr className="border-b" key={index}>
                  {columnDef.map((key: columeDef) => {
                    return (
                      <td className="py-2.5" key={key.key}>
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
      </div>
    </>
  );
}

export default Table;
