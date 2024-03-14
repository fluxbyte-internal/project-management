import InputText from "../common/InputText";
import UserAvatar from "../ui/userAvatar";
import ScaleSvg from "../../assets/svg/ScaleSvg.svg";
import Send from "../../assets/svg/Send.svg";
import { Task } from "@/api/mutation/useTaskCreateMutation";
import { useUser } from "@/hooks/useUser";
import calculateTimeDifference from "../shared/TimeDifferenceCalculate";
import { Button } from "../ui/button";
import { useFormik } from "formik";
import { createCommentTaskSchema } from "@backend/src/schemas/taskSchema";
import { z } from "zod";
import { toFormikValidationSchema } from "zod-formik-adapter";
import useCreateTaskCommentMutation, {
  Comment,
} from "@/api/mutation/useTaskAddCommentMutation";
import { toast } from "react-toastify";
import { useState } from "react";
import useUpdateTaskCommentMutation from "@/api/mutation/useTaskUpdateCommentMutation";
import useRemoveTaskCommentMutation from "@/api/mutation/useTaskRemoveCommentMutation";
type Props = {
  task: Task | undefined;
  refetch: () => void;
};
function TaskComment(props: Props) {
  const { task, refetch } = props;
  const currantUser = useUser();
  const [commentId, setCommentId] = useState<string | null>();
  const [showAllShow, setShowAllShow] = useState<boolean>(false);

  const createTaskCommentMutation = useCreateTaskCommentMutation(task?.taskId);
  const updateTaskCommentMutation = useUpdateTaskCommentMutation(
    commentId ?? undefined
  );
  const removeTaskCommentMutation = useRemoveTaskCommentMutation();
  const commentFormik = useFormik<z.infer<typeof createCommentTaskSchema>>({
    initialValues: {
      commentText: "",
    },
    validationSchema: toFormikValidationSchema(createCommentTaskSchema),
    onSubmit: (values) => {
      createTaskCommentMutation.mutate(values, {
        onSuccess(data) {
          refetch();
          commentFormik.resetForm();
          toast.success(data.data.message);
        },
        onError(error) {
          toast.error(error.response?.data.message == "Unauthorized" ? "You are not authorized to edit tasks which are not assigned to you":error.response?.data.message);
        },
      });
    },
  });

  const updateCommentFormik = useFormik<
    z.infer<typeof createCommentTaskSchema>
  >({
    initialValues: {
      commentText: "",
    },
    validationSchema: toFormikValidationSchema(createCommentTaskSchema),
    onSubmit: (values) => {
      updateTaskCommentMutation.mutate(values, {
        onSuccess(data) {
          refetch();
          updateCommentFormik.resetForm();
          toast.success(data.data.message);
          setCommentId(null);
        },
        onError(error) {
          toast.error(error.response?.data.message == "Unauthorized" ? "You are not authorized to edit tasks which are not assigned to you":error.response?.data.message);
        },
      });
    },
  });

  const handleEdit = (comment: Comment) => {
    setCommentId(comment.commentId);
    updateCommentFormik.setFieldValue("commentText", comment.commentText);
  };
  const handleBlur = () => {
    const val = task?.comments.find((c) => c.commentId == commentId);
    if (val?.commentText != updateCommentFormik.values.commentText) {
      updateCommentFormik.submitForm();
    } else {
      setCommentId(null);
    }
  };
  const handleRemove = (comment: Comment) => {
    removeTaskCommentMutation.mutate(comment.commentId, {
      onSuccess(data) {
        refetch();
        toast.success(data.data.message);
        setCommentId(null);
      },
      onError(error) {
        toast.error(error.response?.data.message == "Unauthorized" ? "You are not authorized to edit tasks which are not assigned to you":error.response?.data.message);
      },
    });
  };
  function isDateSevenDaysOld(inputDate: Date): boolean {
    const currentDate: Date = new Date();
    const sevenDaysAgo: Date = new Date(currentDate);
    sevenDaysAgo.setDate(currentDate.getDate() - 7);
    return new Date(inputDate) <= sevenDaysAgo;
  }
  const visibleComments = showAllShow
    ? props.task?.comments ?? []
    : (props.task?.comments ?? []).filter(
      (comment) => !isDateSevenDaysOld(new Date(comment.createdAt))
    );
  return (
    <>
      <div className="flex items-center gap-2.5 mt-4">
        <img src={ScaleSvg} width={20} height={20} />
        <div>
          <div className="text-xl font-medium">Activity</div>
        </div>
      </div>
      <div className="w-full mt-2">
        <div className="flex gap-x-2 items-center">
          <UserAvatar user={currantUser.user}></UserAvatar>
          <div className="relative w-full">
            <InputText
              placeholder="Write a comment"
              className="mt-0 w-full"
              name="commentText"
              onChange={commentFormik.handleChange}
              value={commentFormik.values.commentText}
            ></InputText>
            {commentFormik.values.commentText && (
              <Button
                variant={"ghost"}
                size={"icon"}
                className="absolute top-1/2 right-1 -translate-y-1/2 mt-[1px] p-0 "
                onClick={commentFormik.submitForm}
              >
                <img src={Send} />
              </Button>
            )}
          </div>
        </div>
        <div className="mt-2 flex flex-col gap-2">
          {visibleComments.map((comment, index) => {
            return (
              <div className="flex gap-2 items-start" key={index}>
                <div>
                  <UserAvatar user={comment.commentByUser}></UserAvatar>
                </div>
                <div className="flex flex-col gap-1 w-full">
                  <div className="flex items-center gap-2">
                    <div className={`text-sm font-semibold ${comment.commentByUser.deletedAt ? "!line-through !decoration-pink-500" : ''}`}>
                      {comment.commentByUser.firstName &&
                      comment.commentByUser.lastName
                        ? comment.commentByUser.firstName +
                          " " +
                          comment.commentByUser.lastName
                        : comment.commentByUser.email}
                    </div>
                    <div className="text-xs text-gray-400">
                      {calculateTimeDifference(new Date(comment.createdAt))} {comment.commentByUser.deletedAt ?" (Deleted)":''}
                    </div>
                  </div>

                  {commentId && commentId == comment.commentId ? (
                    <InputText
                      placeholder="Write a comment"
                      className="mt-0 w-full p-1 h-fit"
                      name="commentText"
                      onChange={updateCommentFormik.handleChange}
                      onBlur={handleBlur}
                      value={updateCommentFormik.values.commentText}
                    ></InputText>
                  ) : (
                    <div className="text-xs text-gray-400 font-normal">
                      {comment.commentText}
                      {comment.createdAt !== comment.updatedAt && (
                        <span>
                          (edited&nbsp;
                          {calculateTimeDifference(new Date(comment.updatedAt))}
                          )
                        </span>
                      )}
                    </div>
                  )}
                  <ul className="inline-flex gap-7 ml-6 list-[circle] justify-start w-3/5">
                    <li className="">
                      <Button
                        variant={"none"}
                        onClick={() => {
                          handleEdit(comment);
                        }}
                        className="p-0 underline font-normal h-fit"
                      >
                        <span className="relative -left-2">edit</span>
                      </Button>
                    </li>
                    <li className="">
                      <Button
                        variant={"none"}
                        onClick={() => {
                          handleRemove(comment);
                        }}
                        className="p-0 underline font-normal h-fit"
                      >
                        <span className="relative -left-2">remove</span>
                      </Button>
                    </li>
                  </ul>
                </div>
              </div>
            );
          })}
          {(props.task?.comments.length !== visibleComments.length&&props.task?.comments.length) && (
            <div>
              <hr className="h-px my-3 bg-gray-200 border-0 dark:bg-gray-700"></hr>
              <div
                className="text-center cursor-pointer"
                onClick={() => setShowAllShow((prev) => !prev)}
              >
                {!showAllShow ? "Show all" : "Less"}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default TaskComment;
