import { Task, Comment, User } from "@/lib/types";
import React, { useContext } from "react";
import { ProjectContext, TaskDetailContext } from "../TaskTable/TaskTable";
import { X, Clock, MessageSquare } from "lucide-react";
import ProfileIcon from "@/components/UI/ProfileIcon";

export default function TaskDetail({ taskId }: { taskId: string }) {
    const { setOpenTaskId } = useContext(TaskDetailContext);
    const project = useContext(ProjectContext);

    const task = project?.list
        .flatMap((list) => list.list)
        .find((t) => t.id === taskId);

    const parentList = project?.list.find((list) =>
        list.list.some((t) => t.id === taskId)
    );

    if (!task) return null;

    const formatDate = (date: Date | string) => {
        const dateObject = typeof date === 'string' ? new Date(date) : date;
        return dateObject.toLocaleString("en-GB", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-gray-800 rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">{task.name}</h2>
                    <button
                        onClick={() => setOpenTaskId(null)}
                        className="p-2 hover:bg-gray-700 rounded"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Theme Image */}
                {task.theme && (
                    <div
                        className={`background-base background-${task.theme} h-[200px] w-full rounded-lg mb-4`}
                    ></div>
                )}

                <div className="space-y-4">
                    {/* List Location */}
                    <div>
                        <label className="text-sm text-gray-400">In List</label>
                        <p className="font-medium">{parentList?.name}</p>
                    </div>

                    {/* Status */}
                    <div>
                        <label className="text-sm text-gray-400">Status</label>
                        <div className={`inline-flex items-center px-2 py-1 rounded ${task.state ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'
                            }`}>
                            <span>{task.state ? "Completed" : "In Progress"}</span>
                        </div>
                    </div>

                    {/* Dates */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-sm text-gray-400 flex items-center gap-2">
                                <Clock size={14} /> Created At
                            </label>
                            <p>{formatDate(task.createdAt)}</p>
                        </div>

                        {task.due && (
                            <div>
                                <label className="text-sm text-gray-400 flex items-center gap-2">
                                    <Clock size={14} /> Due Date
                                </label>
                                <p className={`${task.state
                                    ? "text-green-400"
                                    : new Date(task.due) < new Date()
                                        ? "text-red-400"
                                        : "text-white"
                                    }`}>
                                    {formatDate(task.due)}
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Description */}
                    <div>
                        <label className="text-sm text-gray-400">Description</label>
                        <p className="mt-1 p-2 bg-gray-700/50 rounded-lg whitespace-pre-wrap min-h-[100px]">
                            {task.description || "No description provided"}
                        </p>
                    </div>

                    {/* Assigned Members */}
                    <div>
                        <label className="text-sm text-gray-400">Assigned Members</label>
                        <div className="flex flex-wrap gap-2 mt-1">
                            {task.member?.map((memberId) => (
                                <ProfileIcon
                                    key={memberId}
                                    src={project?.member.find((mb) => mb.id === memberId)?.image || ""}
                                    size={24}
                                />
                            ))}
                            {(!task.member || task.member.length === 0) && (
                                <p className="text-gray-500">No members assigned</p>
                            )}
                        </div>
                    </div>

                    {/* Comments */}
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
                    </div>
                </div>
            </div>
        </div>
    );
}