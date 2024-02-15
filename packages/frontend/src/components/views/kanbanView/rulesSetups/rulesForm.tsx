import { createKanbanSchema } from '@backend/src/schemas/projectSchema';
import { useFormik } from 'formik';
import { toast } from 'react-toastify';
import { z } from 'zod';
import { toFormikValidationSchema } from 'zod-formik-adapter';
import useKanbanColumnMutation, {
  KanbanColumnType,
} from '@/api/mutation/useKanbanCreateColumn';
import ErrorMessage from '@/components/common/ErrorMessage';
import FormLabel from '@/components/common/FormLabel';
import InputText from '@/components/common/InputText';
import InputNumber from '@/components/common/InputNumber';
import { Button } from '@/components/ui/button';

type Props = {
  projectId: string;
  refetch?: () => void;
  close?: () => void;
  rules?: KanbanColumnType[];
};

function RulesForm(props: Props) {
  const kanbanColumnMutation = useKanbanColumnMutation(props.projectId);
  const kanbanColumnFormik = useFormik<z.infer<typeof createKanbanSchema>>({
    initialValues: {
      name: '',
      percentage: 0,
    },
    onSubmit: (values) => {
      if (setPercentage(values.percentage)) {
        kanbanColumnMutation.mutate(values, {
          onError(err) {
            toast.error(err.response?.data.message);
          },
          onSuccess() {
            kanbanColumnFormik.resetForm();
            if (props?.close) {
              props?.close();
            }
            if (props.refetch) {
              props.refetch();
            }
          },
        });
      }
    },
    validationSchema: toFormikValidationSchema(createKanbanSchema),
  });
  const handleSave = () => {
    kanbanColumnFormik.submitForm();
  };
  const setPercentage = (value: number) => {
    if (props.rules?.some((d) => d.percentage === Number(value))) {
      kanbanColumnFormik.setErrors({
        percentage: 'Rule already exists. Choose a unique one.',
      });
      return false;
    }
    return true;
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
          onChange={(e) => {
            kanbanColumnFormik.handleChange(e);
          }}
          value={kanbanColumnFormik.values.percentage}
        />
        <ErrorMessage>{kanbanColumnFormik.errors.percentage}</ErrorMessage>
      </div>
      <div className="w-full">
        <Button
          variant={'primary_outline'}
          size={'sm'}
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
