import React, { useEffect, useState } from "react";
import { Button, Input, Textarea, Card, CardBody } from "@nextui-org/react";
import { ArrowLeft } from "lucide-react";
import { useAppContext } from "../AppProvider";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";

const CreateUpdateTaskListScreen: React.FC = () => {
  const { state, api } = useAppContext();
  const { listId } = useParams();

  const [isUpdate, setIsUpdate] = useState(false);
  const [error, setError] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("" as string | undefined);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const findTaskList = (taskListId: string) => {
    const filteredTaskLists = state.taskLists.filter((tl) => taskListId === tl.id);
    if (filteredTaskLists.length === 1) {
      return filteredTaskLists[0];
    }
    return null;
  };

  const populateTaskList = (taskListId: string) => {
    const taskList = findTaskList(taskListId);
    if (null != taskList) {
      setTitle(taskList.title);
      setDescription(taskList.description);
      setIsUpdate(true);
    }
  };

  useEffect(() => {
    if (null != listId) {
      if (!state.taskLists || state.taskLists.length === 0) {
        api.fetchTaskLists().then(() => populateTaskList(listId));
      } else {
        populateTaskList(listId);
      }
    }
  }, [listId]);

  const createUpdateTaskList = async () => {
    try {
      setIsLoading(true);
      if (isUpdate && null != listId) {
        await api.updateTaskList(listId, {
          id: listId,
          title: title,
          description: description,
          count: undefined,
          progress: undefined,
          tasks: undefined,
        });
      } else {
        await api.createTaskList({
          title: title,
          description: description,
          count: undefined,
          progress: undefined,
          tasks: undefined,
        });
      }
      navigate("/");
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || err.message);
      } else {
        setError("An unknown error occurred");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createUpdateTaskList();
  };

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
          onClick={() => navigate("/")}
        >
          <ArrowLeft size={20} />
        </Button>
        <h1 className="text-2xl font-bold tracking-tight text-default-900">
          {isUpdate ? "Edit Project" : "New Project"}
        </h1>
      </div>

      {error.length > 0 && <Card className="mb-6 bg-danger-50 border border-danger-200 shadow-none text-danger text-sm"><CardBody>{error}</CardBody></Card>}

      <Card className="border border-default-200 bg-content1 shadow-sm" radius="md">
        <CardBody className="p-6">
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <Input
              label="Project Title"
              placeholder="E.g., Website Redesign"
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
              placeholder="What is this project about?"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              variant="faded"
              minRows={4}
              classNames={{
                inputWrapper: "border-default-200 hover:border-default-400 bg-default-50",
              }}
            />

            <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-default-100">
              <Button
                variant="flat"
                className="font-medium"
                onClick={() => navigate("/")}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                color="primary"
                className="font-medium"
                isLoading={isLoading}
              >
                {isUpdate ? "Save Changes" : "Create Project"}
              </Button>
            </div>
          </form>
        </CardBody>
      </Card>
    </motion.div>
  );
};

export default CreateUpdateTaskListScreen;
