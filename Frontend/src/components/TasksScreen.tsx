import {
  Button,
  Checkbox,
  Progress,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Spinner,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@nextui-org/react";
import { ArrowLeft, Edit, MoreVertical, Plus, Trash } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAppContext } from "../AppProvider";
import Task from "../domain/Task";
import { TaskStatus } from "../domain/TaskStatus";
import { motion } from "framer-motion";

const TaskListScreen: React.FC = () => {
  const { state, api } = useAppContext();
  const { listId } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const taskList = state.taskLists.find((tl) => listId === tl.id);

  useEffect(() => {
    const loadInitialData = async () => {
      if (!listId) return;

      setIsLoading(true);
      try {
        if (!taskList) {
          await api.getTaskList(listId);
        }
        try {
          await api.fetchTasks(listId);
        } catch (error) {
          console.log("Tasks not available yet");
        }
      } catch (error) {
        console.error("Error loading task list:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadInitialData();
  }, [listId]);

  const completionPercentage = React.useMemo(() => {
    if (listId && state.tasks[listId]) {
      const tasks = state.tasks[listId];
      const closeTaskCount = tasks.filter(
        (task) => task.status === TaskStatus.CLOSED
      ).length;
      return tasks.length > 0 ? (closeTaskCount / tasks.length) * 100 : 0;
    }
    return 0;
  }, [state.tasks, listId]);

  const toggleStatus = (task: Task) => {
    if (listId) {
      const updatedTask = { ...task };
      updatedTask.status =
        task.status === TaskStatus.CLOSED ? TaskStatus.OPEN : TaskStatus.CLOSED;

      api
        .updateTask(listId!, task.id, updatedTask)
        .then(() => {
          if (listId) api.fetchTasks(listId);
        });
    }
  };

  const deleteTaskList = async () => {
    if (null != listId) {
      await api.deleteTaskList(listId);
      navigate("/");
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority.toUpperCase()) {
      case 'HIGH': return 'text-danger-500 bg-danger-50';
      case 'MEDIUM': return 'text-warning-600 bg-warning-50';
      case 'LOW': return 'text-success-600 bg-success-50';
      default: return 'text-default-500 bg-default-100';
    }
  };

  const tableRows = () => {
    if (null != listId && null != state.tasks[listId]) {
      return state.tasks[listId].map((task) => {
        const isClosed = TaskStatus.CLOSED === task.status;
        return (
          <TableRow key={task.id} className="border-b border-default-100 last:border-none group">
            <TableCell className="w-10">
              <Checkbox
                isSelected={isClosed}
                onValueChange={() => toggleStatus(task)}
                color="default"
                radius="full"
                size="md"
                className={isClosed ? "opacity-50" : ""}
                aria-label={`Mark task "${task.title}" as ${isClosed ? "open" : "closed"
                  }`}
              />
            </TableCell>
            <TableCell>
              <span className={`text-sm ${isClosed ? 'line-through text-default-400' : 'text-default-800 font-medium'}`}>
                {task.title}
              </span>
            </TableCell>
            <TableCell>
              <span className={`text-xs px-2 py-1 rounded-md font-medium ${getPriorityColor(task.priority)} ${isClosed ? 'opacity-50 grayscale' : ''}`}>
                {task.priority || "MEDIUM"}
              </span>
            </TableCell>
            <TableCell>
              {task.dueDate ? (
                <span className={`text-xs text-default-500 ${isClosed ? 'opacity-50' : ''}`}>
                  {new Date(task.dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                </span>
              ) : (
                <span className="text-xs text-default-300">-</span>
              )}
            </TableCell>
            <TableCell className="w-20">
              <div className="flex justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                  isIconOnly
                  size="sm"
                  variant="light"
                  className="text-default-400 hover:text-default-800"
                  aria-label={`Edit task "${task.title}"`}
                  onClick={() =>
                    navigate(`/task-lists/${listId}/edit-task/${task.id}`)
                  }
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  isIconOnly
                  size="sm"
                  variant="light"
                  className="text-danger-400 hover:text-danger-500"
                  onClick={() => api.deleteTask(listId, task.id)}
                  aria-label={`Delete task "${task.title}"`}
                >
                  <Trash className="h-4 w-4" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        );
      });
    }
    return [];
  };

  if (isLoading) {
    return (
      <div className="flex justify-center flex-col items-center mt-32 space-y-4">
        <Spinner size="lg" color="default" />
        <p className="text-default-500 text-sm">Loading project...</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="p-4 max-w-4xl w-full mx-auto"
    >
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
        <div className="flex items-center gap-3">
          <Button
            isIconOnly
            variant="light"
            className="text-default-500 hover:text-default-900"
            aria-label="Go back to Task Lists"
            onClick={() => navigate("/")}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold text-default-900 tracking-tight">
            {taskList ? taskList.title : "Unknown Project"}
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <Button
            onClick={() => navigate(`/task-lists/${listId}/new-task`)}
            color="primary"
            variant="flat"
            className="font-medium bg-primary/10 text-primary hover:bg-primary/20"
            startContent={<Plus className="h-4 w-4" />}
          >
            Add Task
          </Button>

          <Dropdown placement="bottom-end">
            <DropdownTrigger>
              <Button isIconOnly variant="light" aria-label="Project actions">
                <MoreVertical className="h-5 w-5 text-default-500" />
              </Button>
            </DropdownTrigger>
            <DropdownMenu aria-label="Project Actions" variant="flat">
              <DropdownItem
                key="edit"
                startContent={<Edit className="w-4 h-4" />}
                onClick={() => navigate(`/edit-task-list/${listId!}`)}
              >
                Edit Project Info
              </DropdownItem>
              <DropdownItem
                key="delete"
                className="text-danger"
                color="danger"
                startContent={<Trash className="w-4 h-4" />}
                onClick={deleteTaskList}
              >
                Delete Project
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>
      </div>

      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-default-500">Project Progress</span>
          <span className="text-sm font-medium text-default-500">{Math.round(completionPercentage)}%</span>
        </div>
        <Progress
          size="sm"
          value={completionPercentage}
          classNames={{
            indicator: "bg-default-900",
            track: "bg-default-100"
          }}
          aria-label="Task completion progress"
        />
      </div>

      <div className="mt-8 border border-default-200 rounded-xl overflow-hidden bg-content1/30">
        <Table
          aria-label="Tasks list"
          removeWrapper
          classNames={{
            th: "bg-default-50/50 text-default-500 text-xs uppercase tracking-wider font-semibold border-b border-default-200",
            td: "py-3",
          }}
        >
          <TableHeader>
            <TableColumn className="w-10">Done</TableColumn>
            <TableColumn>Task</TableColumn>
            <TableColumn>Priority</TableColumn>
            <TableColumn>Due Date</TableColumn>
            <TableColumn align="center">Actions</TableColumn>
          </TableHeader>
          <TableBody emptyContent={<div className="p-8 text-default-400 text-sm">No tasks found. Click "Add Task" to create one.</div>}>
            {tableRows()}
          </TableBody>
        </Table>
      </div>

    </motion.div>
  );
};

export default TaskListScreen;
