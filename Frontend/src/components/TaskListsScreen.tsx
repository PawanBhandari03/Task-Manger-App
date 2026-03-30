import { Button, Card, CardBody, Progress } from "@nextui-org/react";
import { List, Plus } from "lucide-react";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../AppProvider";
import { motion } from "framer-motion";

const TaskListScreen: React.FC = () => {
  const { state, api } = useAppContext();

  useEffect(() => {
    api.fetchTaskLists();
  }, []);

  const navigate = useNavigate();

  const handleCreateTaskList = () => {
    navigate("/new-task-list");
  };

  const handleSelectTaskList = (taskListId: string | undefined) => {
    navigate(`/task-lists/${taskListId}`);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="max-w-5xl w-full mx-auto"
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-default-900">Projects</h1>
          <p className="text-sm text-default-500 mt-1">Manage your task lists</p>
        </div>

        <Button
          onPress={handleCreateTaskList}
          color="primary"
          variant="flat"
          startContent={<Plus size={18} />}
          className="font-medium px-4 h-10 w-full md:w-auto bg-primary/10 hover:bg-primary/20 text-primary-500"
          aria-label="Create New Task List"
        >
          New Project
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {state.taskLists.map((list) => {
          return (
            <motion.div key={list.id} variants={itemVariants}>
              <Card
                isPressable
                onPress={() => handleSelectTaskList(list.id)}
                className="w-full h-full border-1 border-default-100 bg-content1/50 hover:bg-content1 hover:border-default-200 transition-colors shadow-none hover:shadow-sm"
                radius="md"
                role="button"
                aria-label={`Select task list: ${list.title}`}
              >
                <CardBody className="p-5 flex flex-col justify-between h-full gap-4">
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <div className="p-2 rounded-lg bg-default-100 text-default-600">
                        <List size={18} strokeWidth={2} />
                      </div>
                      <h2 className="text-lg font-semibold text-default-800 line-clamp-1">{list.title}</h2>
                    </div>
                    {list.description && (
                      <p className="text-sm text-default-500 line-clamp-2 mt-2">{list.description}</p>
                    )}
                  </div>

                  <div className="mt-auto pt-4 border-t border-default-100/50">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs font-medium text-default-400">{list.count || 0} tasks</span>
                      <span className="text-xs font-medium text-default-400">{Math.round((list.progress || 0) * 100)}%</span>
                    </div>
                    <Progress
                      size="sm"
                      value={list.progress ? list.progress * 100 : 0}
                      classNames={{
                        indicator: "bg-default-800",
                        track: "bg-default-100"
                      }}
                      aria-label={`Progress for ${list.title}: ${list.progress}%`}
                    />
                  </div>
                </CardBody>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {state.taskLists.length === 0 && (
        <motion.div variants={itemVariants} className="flex flex-col items-center justify-center p-12 text-center border border-dashed border-default-200 rounded-xl bg-default-50/20">
          <List size={40} className="text-default-300 mb-4" />
          <h3 className="text-lg font-medium text-default-700">No projects yet</h3>
          <p className="text-sm text-default-500 mt-1 max-w-sm">Create your first project to start organizing your tasks.</p>
          <Button
            onPress={handleCreateTaskList}
            color="primary"
            variant="flat"
            startContent={<Plus size={16} />}
            className="mt-6 font-medium"
          >
            Create Project
          </Button>
        </motion.div>
      )}
    </motion.div>
  );
};

export default TaskListScreen;
