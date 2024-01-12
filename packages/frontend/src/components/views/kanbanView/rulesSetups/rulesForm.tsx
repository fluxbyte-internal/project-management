import useKanbanColumnMutation, {
  KanbanColumnType,
} from "@/api/mutation/useKanbanCreateColumn";
import ErrorMessage from "@/components/common/ErrorMessage";
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
  reules?: KanbanColumnType[];
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
  const setError = (value:string) =>{
    console.log(props.reules?.find(d=> d.percentage === Number(value)));
    console.log(kanbanColumnFormik.errors);
    
    // if (Boolean(props.reules?.find(d=> d.percentage === Number(value)))) {
    //   kanbanColumnFormik.setFieldError("percentage","Rule already exists. Choose a unique one.");
    // }
  }
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
        <ErrorMessage>{kanbanColumnFormik.errors.name}</ErrorMessage>
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
          onChange={(e)=>{kanbanColumnFormik.handleChange(e),setError(e.target.value)}}
          value={kanbanColumnFormik.values.percentage}
        />
        <ErrorMessage>{kanbanColumnFormik.errors.percentage}</ErrorMessage>
      </div>
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
