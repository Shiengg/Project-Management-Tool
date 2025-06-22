import { Task, User } from "@/lib/types";
import React, {
  useContext,
  useEffect,
  useState,
  useSyncExternalStore,
} from "react";
import { ProjectContext } from "../TaskTable/TaskTable";
import { X, Clock, MessageSquare, Edit, Image } from "lucide-react";
import ProfileIcon from "@/components/UI/ProfileIcon";
import Menu from "@/components/UI/Menu";
import { theme } from "@/components/theme/ThemeManager";
import { toastSuccess } from "@/components/toast/toaster";
import { formatDate, formatDateTimeLocal } from "@/lib/format";
import { DNDContext, TaskDetailContext } from "./TaskBoard/TaskBoard";

export default function TaskDetail({ taskId }: { taskId: string }) {
  const { handleUpdateTask } = useContext(DNDContext);
  const { setOpenTaskId } = useContext(TaskDetailContext);
  const { project } = useContext(ProjectContext);
  const [task, setTask] = useState<Task | null>(null);
  const [isAssigning, setIsAssigning] = useState(false);

  useEffect(() => {
    setTask(
      project?.list
        .flatMap((list) => list.list)
        .find((t) => t.id === taskId) as Task
    );
  }, [taskId]);

  const parentList = project?.list.find((list) =>
    list.list.some((t) => t.id === taskId)
  );

  if (!task) return null;

  const handleSave = () => {
    handleUpdateTask(task);
    toastSuccess("Task updated!!!");
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg max-w-2xl w-full h-fit max-h-screen ">
        {/* control */}
        <div className="relative size-full">
          {/* Theme Image */}

          {task.theme && (
            <div
              className={`background-base background-${task.theme} h-[200px] w-full flex items-center justify-center rounded-t-lg `}
            ></div>
          )}

          <div
            className={`${
              task.theme ? "absolute" : ""
            } right-0 top-0 flex justify-end gap-2 p-2 `}
          >
            <Menu
              name="Backgrounds"
              icon={
                <button title="toggle background" className="button-5">
                  <Image size={18} />
                </button>
              }
              menu={
                <div>
                  <div
                    className="button-3"
                    onClick={() =>
                      setTask((prev) => ({ ...prev, theme: "" } as Task))
                    }
                  >
                    Clear
                  </div>
                  <ul className="flex flex-col gap-2 p-2">
                    {theme.map((category) => (
                      <div key={category.name} className="pb-4">
                        <hr />
                        <h2 className=" font-semibold mb-2">{category.name}</h2>
                        <div className="flex flex-wrap gap-3">
                          {category.background.map((bg) => (
                            <button
                              onClick={() =>
                                setTask(
                                  (prev) => ({ ...prev, theme: bg } as Task)
                                )
                              }
                              key={bg}
                              className={`rounded-xl aspect-[2/1] max-w-[150px] grow min-w-[100px]  shadow-md background-base  background-${bg}  ${
                                task?.theme === bg
                                  ? "outline-2 outline-gray-500"
                                  : ""
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                    ))}
                  </ul>
                </div>
              }
            />

            <button onClick={() => setOpenTaskId(null)} className="button-5">
              <X size={18} />
            </button>
          </div>
        </div>

        <div className="space-y-4 p-4">
          <div className="flex flex-row gap-2 items-center">
            <input
              type="checkbox"
              checked={task.state}
              onChange={(e) => {
                setTask((prev) => ({ ...prev, state: !prev?.state } as Task));
                handleUpdateTask({ ...task, state: e.target.checked });
              }}
              title="mark complete"
              className={`appearance-none size-4 outline-2  outline-inherit rounded-full checked:outline-none checked:bg-green-600 cursor-pointer `}
            ></input>
            <input
              type="text"
              value={task.name}
              className="text-2xl font-bold font-mono w-full  outline-none border-b-2"
              onChange={(e) =>
                setTask((prev) => ({ ...prev, name: e.target.value } as Task))
              }
            />
          </div>

          {/* List Location */}
          <div>
            <label className="text-sm text-gray-400">In List</label>
            <p className="font-medium">{parentList?.name}</p>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-gray-400 flex items-center gap-2">
                <Clock size={14} /> Created At
              </label>
              <p>{formatDate(task.createdAt)}</p>
            </div>

            <div>
              <label className="text-sm text-gray-400 flex items-center gap-2">
                <Clock size={14} /> Due Date
              </label>
              <input
                type="datetime-local"
                value={formatDateTimeLocal(task.due)}
                onChange={(e) =>
                  setTask((prev) => ({ ...prev, due: e.target.value } as Task))
                }
                className={`p-2 rounded text-black ${
                  task.state
                    ? "bg-green-500"
                    : new Date(task.due) < new Date()
                    ? "bg-red-500"
                    : "bg-white"
                }`}
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="text-sm text-gray-400">Description</label>
            <textarea
              placeholder="Add a description for task"
              value={task.description}
              onChange={(e) =>
                setTask(
                  (prev) => ({ ...prev, description: e.target.value } as Task)
                )
              }
              className="mt-1 text-area"
            ></textarea>
          </div>

          {/* Assigned Members */}
          <div>
            <div className="flex items-center justify-between">
              <label className="text-sm text-gray-400">Assigned Members </label>

              <button
                className="flex gap-1 text-sm button-3"
                onClick={() => setIsAssigning((prev) => !prev)}
              >
                {isAssigning ? "Stop" : "Assign"}
              </button>
            </div>

            <div className="flex flex-wrap gap-2 mt-1">
              {isAssigning
                ? project?.member.map((mb) => (
                    <div
                      key={mb.id}
                      onClick={() =>
                        setTask((prev) => {
                          if (!prev) return prev;

                          const isAssigned = prev.member?.includes(mb.id);
                          const updatedMembers = isAssigned
                            ? prev.member.filter((id) => id !== mb.id)
                            : [...(prev.member || []), mb.id];

                          return {
                            ...prev,
                            member: updatedMembers,
                          };
                        })
                      }
                      className={`flex flex-row gap-1 items-center p-1 px-2 rounded  ${
                        task.member.includes(mb.id)
                          ? "bg-gray-600"
                          : "bg-gray-700/50"
                      } cursor-pointer`}
                    >
                      <ProfileIcon src={mb.image || ""} size={24} />
                      <span className="text-xs ">{mb.email}</span>
                    </div>
                  ))
                : task.member?.map((memberId) => (
                    <div
                      key={memberId}
                      className="flex flex-row gap-1 items-center p-1 px-2 rounded bg-gray-700/50"
                    >
                      <ProfileIcon
                        src={
                          project?.member.find((mb) => mb.id === memberId)
                            ?.image || ""
                        }
                        size={24}
                      />
                      <span className="text-xs ">
                        {
                          project?.member.find((mb) => mb.id === memberId)
                            ?.email
                        }
                      </span>
                    </div>
                  ))}
              {(!task.member || task.member.length === 0) && !isAssigning && (
                <p className="text-gray-500">No members assigned</p>
              )}
            </div>
          </div>

          {/* Comments
                    <div>
                        <label className="text-sm text-gray-400 flex items-center gap-2">
                            <MessageSquare size={14} /> Comments ({task.comment.length})
                        </label>
                        <div className="mt-2 space-y-2">
                            {task.comment.map((comment, index) => (
                                <div key={comment.id || index} className="bg-gray-700/50 p-2 rounded-lg">
                                    <div className="flex items-center gap-2 mb-1">
                                        <ProfileIcon
                                            src={comment.member.image || ""}
                                            size={20}
                                        />
                                        <span className="text-sm text-gray-300">
                                            {comment.member.fullname || comment.member.username}
                                        </span>
                                        <span className="text-xs text-gray-500">
                                            {formatDate(comment.createdAt)}
                                        </span>
                                    </div>
                                    <p className="text-sm">{comment.text}</p>
                                </div>
                            ))}
                            {task.comment.length === 0 && (
                                <p className="text-gray-500">No comments yet</p>
                            )}
                        </div>
                    </div> */}

          <button className="button ml-auto" onClick={handleSave}>
            Save change
          </button>
        </div>
      </div>
    </div>
  );
}
