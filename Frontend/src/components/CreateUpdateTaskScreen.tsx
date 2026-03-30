import React, { useEffect, useState } from "react";
import { Button, Input, Textarea, Card, CardBody } from "@nextui-org/react";
import { ArrowLeft } from "lucide-react";
import { useAppContext } from "../AppProvider";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { TaskPriority } from "../domain/TaskPriority";
import { DatePicker } from "@nextui-org/date-picker";
import { TaskStatus } from "../domain/TaskStatus";
import { parseDate } from "@internationalized/date";
import { motion } from "framer-motion";

const CreateUpdateTaskScreen: React.FC = () => {
  const { state, api } = useAppContext();
  const { listId, taskId } = useParams();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUpdate, setIsUpdate] = useState(false);
  const [error, setError] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState<Date | undefined>(undefined);
  const [priority, setPriority] = useState(TaskPriority.MEDIUM);
  const [status, setStatus] = useState<TaskStatus | undefined>(undefined);

  useEffect(() => {
    const loadInitialData = async () => {
      if (!listId) {
        setIsLoading(false);
        return;
      }

      if (!taskId) {
        // We're creating a new task, no need to fetch task data
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        if (!state.taskLists.find(tl => tl.id === listId)) {
          await api.getTaskList(listId);
        }

        await api.getTask(listId, taskId);

        setIsUpdate(true);
      } catch (error) {
        if (axios.isAxiosError(error)) {
          setError(error.response?.data?.message || "Failed to load task");
        } else {
          setError("An unknown error occurred");
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadInitialData();
  }, [listId, taskId]);

  useEffect(() => {
    if (listId && taskId && state.tasks[listId]) {
      const task = state.tasks[listId].find(t => t.id === taskId);

      if (task) {
        setTitle(task.title);
        setDescription(task.description || "");
        setDueDate(task.dueDate ? new Date(task.dueDate) : undefined);
        setPriority(task.priority || TaskPriority.MEDIUM);
        setStatus(task.status);
      }
    }
  }, [listId, taskId, state.tasks]);

  const createUpdateTask = async () => {
    try {
      if (!listId || !title.trim()) return;
      setIsSubmitting(true);

      if (isUpdate && taskId) {
        await api.updateTask(listId, taskId, {
          id: taskId,
          title,
          description,
          dueDate,
          priority,
          status,
        });
      } else {
        await api.createTask(listId, {
          title,
          description,
          dueDate,
          priority,
          status: undefined,
        });
      }

      navigate(`/task-lists/${listId}`);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || err.message);
      } else {
        setError("An unknown error occurred");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDateChange = (date: Date | null | undefined) => {
    setDueDate(date || undefined);
  };

  const formatDateForPicker = (date: Date | undefined) => {
    if (!date) return undefined;
    const offset = date.getTimezoneOffset()
    const result = new Date(date.getTime() - (offset * 60 * 1000))
    return result.toISOString().split('T')[0]
  };

  if (isLoading) {
    return <div className="p-12 text-center text-default-500">Loading form...</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className="p-4 w-full max-w-lg mx-auto"
    >
      <div className="flex items-center gap-3 mb-8">
        <Button
          isIconOnly
          variant="light"
          className="text-default-500 hover:text-default-900"
          onClick={() => navigate(`/task-lists/${listId}`)}
        >
          <ArrowLeft size={20} />
        </Button>
        <h1 className="text-2xl font-bold tracking-tight text-default-900">
          {isUpdate ? "Edit Task" : "New Task"}
        </h1>
      </div>

      {error && <Card className="mb-6 bg-danger-50 border border-danger-200 shadow-none text-danger text-sm"><CardBody>{error}</CardBody></Card>}

      <Card className="border border-default-200 bg-content1 shadow-sm" radius="md">
        <CardBody className="p-6">
          <form onSubmit={(e) => { e.preventDefault(); createUpdateTask(); }} className="flex flex-col gap-6">
            <Input
              label="Task Title"
              placeholder="What needs to be done?"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              autoFocus
              variant="faded"
              classNames={{
                inputWrapper: "border-default-200 hover:border-default-400 bg-default-50",
              }}
            />

            <Textarea
              label="Description (optional)"
              placeholder="Add details, links, or context..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              variant="faded"
              minRows={4}
              classNames={{
                inputWrapper: "border-default-200 hover:border-default-400 bg-default-50",
              }}
            />

            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-default-700">Priority</label>
              <div className="flex flex-wrap gap-2">
                {Object.values(TaskPriority).map((p) => {
                  const isSelected = priority === p;
                  let colorClass = "bg-default-100 text-default-600 border-default-200 hover:bg-default-200";
                  if (isSelected) {
                    if (p === 'HIGH') colorClass = "bg-danger-100 text-danger-700 border-danger-300";
                    else if (p === 'MEDIUM') colorClass = "bg-warning-100 text-warning-800 border-warning-300";
                    else if (p === 'LOW') colorClass = "bg-success-100 text-success-700 border-success-300";
                  }

                  return (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setPriority(p)}
                      className={`px-4 py-1.5 rounded-full text-xs font-medium border transition-colors ${colorClass}`}
                    >
                      {p}
                    </button>
                  );
                })}
              </div>
            </div>

            <DatePicker
              label="Due Date (optional)"
              variant="faded"
              defaultValue={dueDate ? parseDate(formatDateForPicker(dueDate)!) : undefined}
              onChange={(newDate) => handleDateChange(newDate ? new Date(newDate.toString()) : null)}
            />

            <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-default-100">
              <Button
                variant="flat"
                className="font-medium"
                onClick={() => navigate(`/task-lists/${listId}`)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                color="primary"
                className="font-medium"
                isLoading={isSubmitting}
                isDisabled={!title.trim()}
              >
                {isUpdate ? "Save Changes" : "Create Task"}
              </Button>
            </div>
          </form>
        </CardBody>
      </Card>
    </motion.div>
  );
};

export default CreateUpdateTaskScreen;