import { toast } from 'react-toastify';
import { useState } from 'react';
import Dialog from '../common/Dialog';
import { Button } from '../ui/button';
import TrashCanSvg from '../../assets/svg/TrashCan.svg';
import PapperClip from '../../assets/svg/Paperclip.svg';
import FileIcon from '../../assets/svg/FileIcon.svg';
import DownloadSvg from '../../assets/svg/DownLoad.svg';
import TopRightArrow from '../../assets/svg/TopRightArrow.svg';
import calculateTimeDifference from '../shared/TimeDifferenceCalculate';
import { Task } from '@/api/mutation/useTaskCreateMutation';
import useRemoveTaskAttachmentMutation from '@/api/mutation/useTaskAttechmentRemoveMutation';

type Props = {
  task: Task | undefined;
  refetch: () => void;
};

function TaskAttachment(props: Props) {
  const removeTaskAttachmentMutation = useRemoveTaskAttachmentMutation();
  const [showAllAttachment, setShowAllAttachment] = useState<boolean>(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState<string | null>(
    null,
  );

  const removeConfirm = () => {
    if (showConfirmDelete) {
      removeTaskAttachmentMutation.mutate(showConfirmDelete, {
        onError(error) {
          toast.error(error.response?.data.message);
          setShowConfirmDelete(null);
        },
        onSuccess(data) {
          props.refetch();
          toast.success(data.data.message);
          setShowConfirmDelete(null);
        },
      });
    }
  };

  return (
    <>
      <div className="flex items-center gap-2.5 mt-4">
        <img src={PapperClip} width={20} height={20} />
        <div>
          <div className="text-xl font-medium">Attachments</div>
        </div>
      </div>
      {props.task?.documentAttachments
        .slice(
          0,
          showAllAttachment ? props.task?.documentAttachments.length : 2,
        )
        .map((item, index) => {
          return (
            <div key={index} className="flex gap-2 mt-2 group">
              <div className="w-10 h-11">
                <img
                  className="rounded object-fill aspect-square w-full h-full"
                  src={FileIcon}
                />
              </div>
              <div className="text-sm font-semibold w-full">
                <div className="flex items-center gap-3">
                  {item.name}
                  <div>
                    <img src={TopRightArrow} className="h-2 w-2" />
                  </div>
                </div>
                <div className="text-gray-400 flex justify-between">
                  <div className="flex gap-3 items-start">
                    {calculateTimeDifference(item.createdAt)}
                    <a
                      href={item.url}
                      className="opacity-0 group-hover:opacity-90 "
                    >
                      <img src={DownloadSvg} className="w-3.5" />
                    </a>
                  </div>
                  <div className="opacity-0 group-hover:opacity-90">
                    <Button
                      variant={'none'}
                      className="px-3"
                      onClick={() => setShowConfirmDelete(item.attachmentId)}
                    >
                      <img src={TrashCanSvg} />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      {props.task?.documentAttachments &&
        props.task?.documentAttachments.length > 2 && (
          <div>
            <hr className="h-px my-3 bg-gray-200 border-0 dark:bg-gray-700"></hr>
            <div
              className="text-center cursor-pointer"
              onClick={() => setShowAllAttachment((prev) => !prev)}
            >
              {!showAllAttachment ? 'Show all' : 'Less'}
            </div>
          </div>
        )}
      <Dialog
        isOpen={Boolean(showConfirmDelete)}
        onClose={() => {}}
        modalClass="rounded-lg"
      >
        <div className="flex flex-col gap-2 p-6 ">
          <img src={TrashCanSvg} className="w-12 m-auto" /> Are you sure you
          want to delete ?
          <div className="flex gap-2 ml-auto">
            <Button
              variant={'outline'}
              isLoading={removeTaskAttachmentMutation.isPending}
              disabled={removeTaskAttachmentMutation.isPending}
              onClick={() => setShowConfirmDelete(null)}
            >
              Cancel
            </Button>
            <Button variant={'primary'} onClick={removeConfirm}>
              Delete
            </Button>
          </div>
        </div>
      </Dialog>
    </>
  );
}

export default TaskAttachment;
