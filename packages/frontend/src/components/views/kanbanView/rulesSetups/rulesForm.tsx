import useKanbanColumnMutation from "@/api/mutation/useKanbanCreateColumn";
import FormLabel from "@/components/common/FormLabel";
import InputText from "@/components/common/InputText";
import InputNumber from "@/components/common/inputNumber";
import { Button } from "@/components/ui/button";
import { createKanbanSchema } from "@backend/src/schemas/projectSchema";
import { useFormik } from "formik";
import { toast } from "react-toastify";
import { z } from "zod";
import { toFormikValidationSchema } from "zod-formik-adapter";

type Props = {
  projectId: string;
  refatch?: () => void;
  close?: () => void;
};

function RulesForm(props: Props) {
  const kanbanColumnMutation = useKanbanColumnMutation(props.projectId);
  const kanbanColumnFormik = useFormik<z.infer<typeof createKanbanSchema>>({
    initialValues: {
      name: "",
      percentage: 0,
    },
    validationSchema: toFormikValidationSchema(createKanbanSchema),
    onSubmit: (values) => {
      kanbanColumnMutation.mutate(values, {
        onSuccess() {
          kanbanColumnFormik.resetForm();
          if (props?.close) {
            props?.close();
          }
          if (props.refatch) {
            props.refatch();
          }
        },
        onError(err) {
          toast.error(err.response?.data.message);
        },
      });
    },
  });
  const handleSave = () => {
    kanbanColumnFormik.submitForm();
  };
  return (
    <div className="border rounded-lg flex flex-col justify-between gap-2 px-2.5 py-1.5 bg-white">
      <div>
        <FormLabel className="text-sm m-0 text-gray-500">Column Name</FormLabel>
        <InputText
          name="name"
          className="h-8 rounded-sm mt-0"
          onChange={kanbanColumnFormik.handleChange}
          value={kanbanColumnFormik.values.name}
        />
      </div>
      <div>
        <FormLabel className="text-sm m-0 text-gray-500">
          Task Percentage
        </FormLabel>
        <InputNumber
          className="h-8 rounded-sm mt-0"
          name="percentage"
          min={0}
          max={100}
          onChange={kanbanColumnFormik.handleChange}
          value={kanbanColumnFormik.values.percentage}
        />
      </div>
      {/* <div>
      <FormLabel className="text-sm m-0 text-gray-500">
        Auto move tasks
      </FormLabel>
      <div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            name="autoMove"
            className="sr-only peer"
            onChange={kanbanColumnTaksFormik.handleChange}
          />
          <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-2  peer-focus:ring-primary-600 dark:peer-focus:ring-primary-400 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:bg-primary-400"></div>
        </label>
      </div>
    </div> */}
      <div className="w-full">
        <Button
          variant={"primary_outline"}
          size={"sm"}
          className="w-full"
          onClick={() => handleSave()}
        >
          Save
        </Button>
      </div>
    </div>
  );
}

export default RulesForm;
