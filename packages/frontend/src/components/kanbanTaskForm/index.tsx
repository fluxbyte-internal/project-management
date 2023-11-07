import { KanbanForm } from "interface/kanbanForm";
import { LegacyRef, useEffect, useRef, useState } from "react";
import { KanbanDataSource } from "smart-webcomponents-react";
interface Props {
  formData: KanbanForm | undefined;
  close: () => void;
  task: (formData: KanbanDataSource | undefined) => void;
}
function KanbanFormView(props: Props) {
  const modelRef: LegacyRef<HTMLDivElement> | undefined = useRef(null);
  const [formData, setformData] = useState<KanbanDataSource>();
  useEffect(() => {
    modelRef?.current?.focus();

    if (props.formData?.purpose === "add") {
      setformData({ status: props?.formData?.column?.dataField });
    } else if (props.formData?.purpose === "edit")
      setformData(props.formData.FormData);
  }, [
    props.formData?.column?.dataField,
    props.formData?.purpose,
    props.formData?.FormData,
  ]);

  const close = () => {
    props.close();
  };
  const submit = () => {
    props.task(formData);
    close();
  };
  const heandleTask = (event: React.FormEvent<HTMLInputElement>) => {
    setformData({
      ...formData,
      [(event?.target as HTMLInputElement).name]: (
        event?.target as HTMLInputElement
      ).value,
    });
  };

  return (
    <div className="overflow-y-auto sm:p-0 pt-4 pr-4 pb-20 pl-4 bg-gray-800 bg-opacity-50 absolute top-0 w-full ">
      <div className="flex justify-center items-end text-center min-h-screen sm:block">
        <div className="bg-gray-500 transition-opacity bg-opacity-75"></div>
        <div
          className="inline-block text-left bg-white rounded-lg overflow-hidden align-bottom transition-all transform
            shadow-2xl sm:my-8 sm:align-middle sm:max-w-xl sm:w-full"
        >
          <div className="h-[800px] w-[1200px]">
            <div className="m-4">
              <h1>Task Form</h1>
              <h1>{formData?.text}</h1>

              <div className="w-1/2 mt-3">
                <div className="relative h-10 w-full min-w-[200px]">
                  <input
                    onChange={heandleTask}
                    name="text"
                    className="peer h-full w-full rounded-[7px] border border-blue-gray-200 border-t-transparent bg-transparent px-3 py-2.5 font-sans text-sm font-normal text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 focus:border-2 focus:border-pink-500 focus:border-t-transparent focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50"
                    placeholder=" "
                  />
                  <label className="before:content[' '] after:content[' '] pointer-events-none absolute left-0 -top-1.5 flex h-full w-full select-none text-[11px] font-normal leading-tight text-blue-gray-400 transition-all before:pointer-events-none before:mt-[6.5px] before:mr-1 before:box-border before:block before:h-1.5 before:w-2.5 before:rounded-tl-md before:border-t before:border-l before:border-blue-gray-200 before:transition-all after:pointer-events-none after:mt-[6.5px] after:ml-1 after:box-border after:block after:h-1.5 after:w-2.5 after:flex-grow after:rounded-tr-md after:border-t after:border-r after:border-blue-gray-200 after:transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:leading-[3.75] peer-placeholder-shown:text-blue-gray-500 peer-placeholder-shown:before:border-transparent peer-placeholder-shown:after:border-transparent peer-focus:text-[11px] peer-focus:leading-tight peer-focus:text-pink-500 peer-focus:before:border-t-2 peer-focus:before:border-l-2 peer-focus:before:border-pink-500 peer-focus:after:border-t-2 peer-focus:after:border-r-2 peer-focus:after:border-pink-500 peer-disabled:text-transparent peer-disabled:before:border-transparent peer-disabled:after:border-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500">
                    Required
                  </label>
                </div>
              </div>
              <button
                className="middle m-3 none center rounded-lg bg-pink-500 py-3 px-6 font-sans text-xs font-bold uppercase text-white shadow-md shadow-pink-500/20 transition-all hover:shadow-lg hover:shadow-pink-500/40 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                data-ripple-light="true"
                onClick={submit}
              >
                Button
              </button>
              <button
                className="middle none center rounded-lg bg-red-500 py-3 px-6 font-sans text-xs font-bold uppercase text-white shadow-md shadow-pink-500/20 transition-all hover:shadow-lg hover:shadow-pink-500/40 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                data-ripple-light="true"
                onClick={close}
              >
                close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default KanbanFormView;
