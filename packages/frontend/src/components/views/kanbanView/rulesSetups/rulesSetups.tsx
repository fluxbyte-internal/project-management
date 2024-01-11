import FormLabel from "@/components/common/FormLabel";
import InputText from "@/components/common/InputText";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useFormik } from "formik";
import { toFormikValidationSchema } from "zod-formik-adapter";
import z from "zod";
import InputNumber from "@/components/common/inputNumber";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import ThreeDoteIcon from "../../../../assets/svg/ThreeDotsVertical.svg";
import TrashCan from "../../../../assets/svg/TrashCan.svg";
import EditPen from "../../../../assets/svg/EditPen.svg";
import { updateKanbanSchema } from "@backend/src/schemas/projectSchema";
import { KanbanColumnType } from "@/api/mutation/useKanbanCreateColumn";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";
import useAllKanbanColumnQuery from "@/api/query/useAllKanbanColumn";
import Dialog from "@/components/common/Dialog";
import useRemoveKanbanColumnsMutation from "@/api/mutation/useKanbanColumnRemove";
import useKanbanUpdateColumnMutation from "@/api/mutation/useKanbanUpdateColumn";
import RulesForm from "./rulesForm";

type Props = {
  setColumes: (column: KanbanColumnType[]) => void;
  close: () => void;
};
function RulesSetups(props: Props) {
  const { projectId } = useParams();
  const allKanbanColumn = useAllKanbanColumnQuery(projectId);
  const removeKanbanColumnsMutation = useRemoveKanbanColumnsMutation();
  const kanbanUpdateColumnMutation = useKanbanUpdateColumnMutation();
  const [rules, setRules] = useState<KanbanColumnType[]>([]);
  const [ruleEditData, setRuleEditData] = useState<KanbanColumnType>();
  const [ruleRemoveId, setRuleRemoveId] = useState<string>();

  const updateKanbanColumnFormik = useFormik<
    z.infer<typeof updateKanbanSchema>
  >({
    initialValues: {
      name: ruleEditData?.name || "",
      percentage: ruleEditData?.percentage || 0,
    },
    validationSchema: toFormikValidationSchema(updateKanbanSchema),
    onSubmit: (values) => {
      const data = {
        ...values,
        id: ruleEditData?.kanbanColumnId,
      };
      kanbanUpdateColumnMutation.mutate(data, {
        onSuccess() {
          updateKanbanColumnFormik.setValues({
            name: "",
            percentage: 0,
          });
          setRuleEditData(undefined);
          allKanbanColumn.refetch();
        },
        onError(err) {
          toast.error(err.response?.data.message);
        },
      });
    },
  });
  const handleEdit = (data: KanbanColumnType) => {
    setRuleEditData(data);
    updateKanbanColumnFormik.setValues({
      name: data.name,
      percentage: data.percentage || 0,
    });
  };
  const handleRemove = (id: string) => {
    setRuleRemoveId(id);
  };
  useEffect(() => {
    if (allKanbanColumn.data?.data.data) {
      if (allKanbanColumn.data?.data.data.length > 0) {
        allKanbanColumn.data?.data.data.sort(
          (a, b) => (a.percentage ?? 0) - (b.percentage ?? 0)
        );
      }

      setRules(allKanbanColumn.data?.data.data);
      props.setColumes(allKanbanColumn.data?.data.data);
    }
  }, [allKanbanColumn.data?.data.data]);

  const remove = () => {
    removeKanbanColumnsMutation.mutate(String(ruleRemoveId), {
      onSuccess() {
        setRuleRemoveId("");
        allKanbanColumn.refetch();
      },
      onError(err) {
        toast.error(err.response?.data.message);
      },
    });
  };

  const close = () => {
    props.close();
  };

  return (
    <>
      <div className="w-full h-full flex flex-col p-9 border rounded-xl border-gray-300/30">
        <div className="text-2xl font-semibold mb-5">Create kanban rules</div>
        <div className="@container grow">
          <div className="grid @4xl:grid-cols-6 @3xl:grid-cols-5 @2xl:grid-cols-4 @xl:grid-cols-3 @md:grid-cols-2 @sm:grid-cols-1 gap-3">
            {rules.map((r, index) => {
              return (
                <div
                  key={index}
                  className="border rounded-lg flex flex-col justify-between px-2.5 py-2 bg-white"
                >
                  <div>
                    <DropdownMenu>
                      <DropdownMenuTrigger className="w-full">
                        <div className="flex justify-between items-center">
                          <div className="text-lg font-semibold">{r.name}</div>
                          <img src={ThreeDoteIcon} className="h-4 w-4" />
                        </div>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="">
                        <DropdownMenuSeparator className="mx-1" />
                        <DropdownMenuItem
                          onClick={() => handleRemove(r.kanbanColumnId)}
                          className="flex items-center gap-2"
                        >
                          <img src={TrashCan} />
                          <span className="p-0 font-normal h-auto">Remove</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleEdit(r)}
                          className="flex items-center gap-2"
                        >
                          <img src={EditPen} />
                          <span className="p-0 font-normal h-auto">Edit</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <div>
                    <FormLabel className="text-sm m-0 text-gray-500">
                      Column Name
                    </FormLabel>
                    <InputText
                      disabled={
                        ruleEditData?.kanbanColumnId !== r.kanbanColumnId
                      }
                      value={
                        ruleEditData?.kanbanColumnId == r.kanbanColumnId
                          ? updateKanbanColumnFormik.values.name
                          : r.name
                      }
                      name="name"
                      className="h-8 rounded-sm mt-0"
                      onChange={updateKanbanColumnFormik.handleChange}
                    />
                  </div>
                  <div>
                    <FormLabel className="text-sm m-0 text-gray-500">
                      Task Percentage
                    </FormLabel>
                    <InputNumber
                      disabled={
                        ruleEditData?.kanbanColumnId !== r.kanbanColumnId
                      }
                      value={
                        ruleEditData?.kanbanColumnId == r.kanbanColumnId
                          ? updateKanbanColumnFormik.values.percentage
                          : r.percentage ?? 0
                      }
                      className="h-8 rounded-sm mt-0"
                      name="percentage"
                      min={0}
                      max={100}
                      onChange={updateKanbanColumnFormik.handleChange}
                    />
                  </div>
                  {ruleEditData?.kanbanColumnId == r.kanbanColumnId && (
                    <div className="flex justify-between mt-3">
                      <Button
                        variant={"outline"}
                        size={"sm"}
                        onClick={() => setRuleEditData(undefined)}
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={() => {
                          updateKanbanColumnFormik.submitForm();
                        }}
                        variant={"primary_outline"}
                        size={"sm"}
                      >
                        Update
                      </Button>
                    </div>
                  )}
                </div>
              );
            })}
            <RulesForm
              projectId={projectId ?? ""}
              refatch={() => allKanbanColumn.refetch()}
            />
          </div>
        </div>
        <div className="flex justify-end mt-4">
          <Button
            onClick={() => close()}
            disabled={rules.length <= 0}
            variant={"primary"}
          >
            Go To Kanban
          </Button>
        </div>
      </div>
      <Dialog
        isOpen={Boolean(ruleRemoveId)}
        onClose={() => {}}
        modalClass="rounded-lg"
      >
        <div className="flex flex-col gap-2 p-6 ">
          <img src={TrashCan} className="w-12 m-auto" /> Are you sure you want
          to delete ?
          <div className="flex gap-2 ml-auto">
            <Button
              variant={"outline"}
              isLoading={removeKanbanColumnsMutation.isPending}
              disabled={removeKanbanColumnsMutation.isPending}
              onClick={() => setRuleRemoveId("")}
            >
              Cancel
            </Button>
            <Button variant={"primary"} onClick={remove}>
              Delete
            </Button>
          </div>
        </div>
      </Dialog>
    </>
  );
}

export default RulesSetups;
