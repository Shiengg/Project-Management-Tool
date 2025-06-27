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
import { getPriorityColorHex, renderTaskPriority } from "../TaskCard/TaskCard";
import { useSession } from "next-auth/react";
import Loader from "@/components/loader/Loader";

export default function TaskDetail({ taskId }: { taskId: string }) {
  const { handleUpdateTask } = useContext(DNDContext);
  const { setOpenTaskId } = useContext(TaskDetailContext);
  const { project } = useContext(ProjectContext);
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(false);

  const [task, setTask] = useState<Task | null>(null);
  const isAdmin = project?.admin === session?.user._id;
  const isMyTask =
    session?.user._id && task?.member?.includes(session?.user._id);
  const [isAssigning, setIsAssigning] = useState(false);

  useEffect(() => {
    setTask(
      project?.list
        .flatMap((list) => list.list)
        .find((t) => t._id === taskId) as Task
    );
  }, [taskId]);

  const parentList = project?.list.find((list) =>
    list.list.some((t) => t._id === taskId)
  );

  if (!task) return null;

  const handleSave = async () => {
    setIsLoading(true);
    await handleUpdateTask({
      _id: task._id,
      name: task.name,
      description: task.description,
      due: task.due,
      priority: task.priority,
      member: task.member,
      theme: task.theme,
    });
    setTimeout(() => setIsLoading(false), 1000);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 ">
      <div className="bg-gray-800 rounded-lg max-w-2xl w-full h-fit max-h-screen ">
        {/* control */}
        <div className="relative ">
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
            {(isAdmin || isMyTask) && (
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
                          <h2 className=" font-semibold mb-2">
                            {category.name}
                          </h2>
                          <div className="flex flex-wrap gap-3">
                            {category.background.map((bg) => (
                              <button
                                onClick={() =>
                                  setTask(
                                    (prev) => ({ ...prev, theme: bg } as Task)
                                  )
                                }
                                key={bg}
                                className={`rounded-xl aspect-[2/1] max-w-[70px] grow min-w-[70px]  shadow-md background-base  background-${bg}  ${
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
            )}

            <button onClick={() => setOpenTaskId(null)} className="button-5">
              <X size={18} />
            </button>
          </div>
        </div>

        <div className="space-y-4 p-4">
          <div className="flex flex-row gap-2 items-center">
            <input
              type="checkbox"
              disabled={!isMyTask && !isAdmin}
              checked={task.status}
              onChange={(e) => {
                handleUpdateTask({ _id: task._id, status: e.target.checked });
              }}
              title="mark complete"
              className={`appearance-none size-4 outline-2  outline-inherit rounded-full checked:outline-none checked:bg-green-600 cursor-pointer `}
            ></input>
            <input
              type="text"
              readOnly={!isMyTask && !isAdmin}
              value={task.name}
              className="text-2xl font-bold font-mono w-full input-box "
              style={{ color: getPriorityColorHex(task.priority) }}
              onChange={(e) =>
                setTask((prev) => ({ ...prev, name: e.target.value } as Task))
              }
            />
          </div>

          {/* Task Priority */}

          <div>
            <label className="text-sm text-gray-400">Priority</label>
            <div className="grid grid-cols-5 ">
              {[1, 2, 3, 4, 5].map((p) => (
                <button
                  key={p}
                  disabled={!isAdmin}
                  onClick={(e) =>
                    setTask((prev) => ({ ...prev, priority: p } as Task))
                  }
                  className={`grow p-1 text-sm ${
                    task.priority === p ? "" : "opacity-50"
                  } cursor-pointer`}
                  style={{
                    color: getPriorityColorHex(p),
                    backgroundColor: getPriorityColorHex(p) + "50",
                    outline:
                      task.priority === p
                        ? `2px solid ${getPriorityColorHex(p)}`
                        : "none",
                  }}
                >
                  {renderTaskPriority(p)}
                </button>
              ))}
            </div>
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
                disabled={!isAdmin}
                type="datetime-local"
                value={formatDateTimeLocal(task.due)}
                onChange={(e) =>
                  setTask((prev) => ({ ...prev, due: e.target.value } as Task))
                }
                className={`p-2 rounded text-black ${
                  task.status
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
              readOnly={!isAdmin}
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

              {isAdmin && (
                <button
                  className="flex gap-1 text-sm button-3"
                  onClick={() => setIsAssigning((prev) => !prev)}
                >
                  {isAssigning ? "Stop" : "Assign"}
                </button>
              )}
            </div>

            <div className="flex flex-wrap gap-2 mt-1">
              {isAssigning && isAdmin
                ? project?.member.map((mb) => (
                    <div
                      key={mb._id}
                      onClick={() =>
                        setTask((prev) => {
                          if (!prev) return prev;

                          const isAssigned = prev.member?.includes(mb._id);
                          const updatedMembers = isAssigned
                            ? prev.member.filter((id) => id !== mb._id)
                            : [...(prev.member || []), mb._id];

                          return {
                            ...prev,
                            member: updatedMembers,
                          };
                        })
                      }
                      className={`flex flex-row gap-1 items-center p-1 px-2 rounded  ${
                        task.member.includes(mb._id)
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
                          project?.member.find((mb) => mb._id === memberId)
                            ?.image || ""
                        }
                        size={24}
                      />
                      <span className="text-xs ">
                        {
                          project?.member.find((mb) => mb._id === memberId)
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

          {isAdmin && (
            <button
              disabled={isLoading}
              className="button ml-auto"
              onClick={handleSave}
            >
              {isLoading ? <Loader /> : "Save change"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
