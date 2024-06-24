import {
  Badge,
  Box,
  Button,
  FormControl,
  HStack,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Tag,
  TagLabel,
  Text,
  VStack,
  useDisclosure,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  Checkbox,
  useBreakpointValue,
} from "@chakra-ui/react";
import React, { useState, useRef } from "react";
import { Pie } from "react-chartjs-2";
import { Chart, ArcElement, Tooltip, Legend } from 'chart.js';

Chart.register(ArcElement, Tooltip, Legend);

const statusOptions = ["Pending", "In Progress", "Completed"];

export interface Props {
  tasks: Task[];
}

interface Task {
  id: string;
  title: string;
  description: string;
  due_date: string;
  status: "Pending" | "In Progress" | "Completed";
  category: string;
  frequency: string;
  completed_date?: string;
}

const defaultTasks: Task[] = [
  {
    id: "1",
    title: "Check HVAC System",
    description:
      "Inspect and clean the HVAC system to ensure it is operating efficiently.",
    due_date: "2023-10-01",
    status: "Pending",
    category: "Maintenance",
    frequency: "Monthly",
  },
  {
    id: "2",
    title: "Replace Air Filters",
    description: "Replace air filters in all units to maintain air quality.",
    due_date: "2023-10-05",
    status: "In Progress",
    category: "Maintenance",
    frequency: "Quarterly",
  },
  {
    id: "3",
    title: "Inspect Fire Extinguishers",
    description:
      "Ensure all fire extinguishers are in good condition and not expired.",
    due_date: "2023-10-10",
    status: "Completed",
    category: "Safety",
    frequency: "Yearly",
    completed_date: "2023-10-09",
  },
  {
    id: "4",
    title: "Test Emergency Lights",
    description:
      "Test all emergency lights to ensure they are functioning properly.",
    due_date: "2023-10-15",
    status: "Pending",
    category: "Safety",
    frequency: "Monthly",
  },
  // Add the rest of the tasks...
];

const ScheduledMaintenanceTaskList: React.FC<Props> = ({ tasks = defaultTasks }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isOpen: isCreateOpen, onOpen: onCreateOpen, onClose: onCreateClose } = useDisclosure();
  const [currentTask, setCurrentTask] = useState<Task | null>(null);
  const [taskList, setTaskList] = useState<Task[]>(tasks);

  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);
  const cancelRef = useRef<HTMLButtonElement>(null);

  const onDeleteOpen = (task: Task) => {
    setTaskToDelete(task);
    setIsDeleteOpen(true);
  };

  const onDeleteClose = () => {
    setIsDeleteOpen(false);
    setTaskToDelete(null);
  };

  const handleDelete = () => {
    if (taskToDelete) {
      setTaskList((prevTasks) => prevTasks.filter((task) => task.id !== taskToDelete.id));
      onDeleteClose();
    }
  };

  const handleEditClick = (task: Task) => {
    setCurrentTask(task);
    onOpen();
  };

  const toggleStatus = (task: Task) => {
    const currentIndex = statusOptions.indexOf(task.status);
    const nextIndex = (currentIndex + 1) % statusOptions.length;
    const updatedTask = { ...task, status: statusOptions[nextIndex] };
    setTaskList((prevTasks) =>
      prevTasks.map((t) => (t.id === task.id ? updatedTask : t)),
    );
  };

  const handleSave = () => {
    if (currentTask) {
      setTaskList((prevTasks) =>
        prevTasks.map((task) =>
          task.id === currentTask.id ? currentTask : task,
        ),
      );
    }
    onClose();
  };

  const handleBadgeClick = (task: Task) => {
    toggleStatus(task);
  };

  const handleCompleteChange = (task: Task) => {
    const today = new Date().toISOString().split('T')[0];
    const updatedTask = { ...task, status: "Completed", completed_date: today };
    setTaskList((prevTasks) =>
      prevTasks.map((t) => (t.id === task.id ? updatedTask : t)),
    );
  };

  const handleCreateTask = () => {
    const newTask: Task = {
      id: (taskList.length + 1).toString(),
      title: "",
      description: "",
      due_date: "",
      status: "Pending",
      category: "",
      frequency: "",
    };
    setCurrentTask(newTask);
    onCreateOpen();
  };

  const handleCreateSave = () => {
    if (currentTask) {
      setTaskList((prevTasks) => [...prevTasks, currentTask]);
    }
    onCreateClose();
  };

  const getStatusData = () => {
    const pendingCount = taskList.filter(task => task.status === "Pending").length;
    const inProgressCount = taskList.filter(task => task.status === "In Progress").length;
    const completedCount = taskList.filter(task => task.status === "Completed").length;
    return {
      labels: ['Pending', 'In Progress', 'Completed'],
      datasets: [
        {
          data: [pendingCount, inProgressCount, completedCount],
          backgroundColor: ['#fbd38d', '#63b3ed', '#68d391'],
        },
      ],
    };
  };

  return (
    <Box p={4} borderWidth={1} borderRadius="lg" overflow="hidden">
      <HStack justifyContent="space-between" mb={4}>
        <Text fontSize="2xl" fontWeight="bold">
          Scheduled Maintenance Tasks
        </Text>
        <Button colorScheme="teal" onClick={handleCreateTask}>
          + Create
        </Button>
      </HStack>
      <VStack spacing={4} align="stretch">
        {taskList.map((task) => (
          <Box
            key={task.id}
            p={4}
            borderWidth={1}
            borderRadius="md"
            boxShadow="sm"
          >
            <HStack justifyContent="space-between" alignItems="center">
              <Text fontSize="xl" fontWeight="bold">
                {task.title}
              </Text>
              <Badge
                colorScheme={
                  task.status === "Pending"
                    ? "yellow"
                    : task.status === "In Progress"
                    ? "blue"
                    : "green"
                }
                onClick={() => handleBadgeClick(task)}
                cursor="pointer"
              >
                {task.status}
              </Badge>
              <HStack>
                <Button
                  size="sm"
                  colorScheme="blue"
                  onClick={() => handleEditClick(task)}
                >
                  Edit
                </Button>
                <Button
                  size="sm"
                  colorScheme="red"
                  onClick={() => onDeleteOpen(task)}
                >
                  Delete
                </Button>
              </HStack>
            </HStack>
            <Text mt={2}>{task.description}</Text>
            <HStack mt={2} spacing={4} alignItems="center">
              <Tag size="md" variant="solid" colorScheme="teal">
                <TagLabel>{task.category}</TagLabel>
              </Tag>
              <Text fontSize="sm" color="gray.500">
                Frequency: {task.frequency}
              </Text>
            </HStack>
            <Text mt={2} fontSize="sm" color="gray.500">
              Due Date: {task.due_date}
            </Text>
            {task.completed_date && (
              <Text mt={2} fontSize="sm" color="gray.500">
                Completed Date: {task.completed_date}
              </Text>
            )}
            <Checkbox
              isChecked={task.status === "Completed"}
              onChange={() => handleCompleteChange(task)}
              mt={2}
            >
              Mark as Completed
            </Checkbox>
          </Box>
        ))}
      </VStack>
      <Box mt={8}>
        <Text fontSize="2xl" fontWeight="bold" mb={4}>
          Task Status Overview
        </Text>
        <Box maxWidth="500px" mx="auto">
          <Pie data={getStatusData()} />
        </Box>
      </Box>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit Task</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl>
              <Input
                placeholder="Title"
                value={currentTask?.title || ""}
                onChange={(e) =>
                  setCurrentTask((prev) =>
                    prev ? { ...prev, title: e.target.value } : null,
                  )
                }
              />
            </FormControl>
            <FormControl mt={4}>
              <Input
                placeholder="Description"
                value={currentTask?.description || ""}
                onChange={(e) =>
                  setCurrentTask((prev) =>
                    prev ? { ...prev, description: e.target.value } : null,
                  )
                }
              />
            </FormControl>
            <FormControl mt={4}>
              <Input
                placeholder="Due Date"
                value={currentTask?.due_date || ""}
                onChange={(e) =>
                  setCurrentTask((prev) =>
                    prev ? { ...prev, due_date: e.target.value } : null,
                  )
                }
              />
            </FormControl>
            <FormControl mt={4}>
              <Input
                placeholder="Category"
                value={currentTask?.category || ""}
                onChange={(e) =>
                  setCurrentTask((prev) =>
                    prev ? { ...prev, category: e.target.value } : null,
                  )
                }
              />
            </FormControl>
            <FormControl mt={4}>
              <Input
                placeholder="Frequency"
                value={currentTask?.frequency || ""}
                onChange={(e) =>
                  setCurrentTask((prev) =>
                    prev ? { ...prev, frequency: e.target.value } : null,
                  )
                }
              />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleSave}>
              Save
            </Button>
            <Button variant="ghost" onClick={onClose}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <Modal isOpen={isCreateOpen} onClose={onCreateClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create Task</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl>
              <Input
                placeholder="Title"
                value={currentTask?.title || ""}
                onChange={(e) =>
                  setCurrentTask((prev) =>
                    prev ? { ...prev, title: e.target.value } : null,
                  )
                }
              />
            </FormControl>
            <FormControl mt={4}>
              <Input
                placeholder="Description"
                value={currentTask?.description || ""}
                onChange={(e) =>
                  setCurrentTask((prev) =>
                    prev ? { ...prev, description: e.target.value } : null,
                  )
                }
              />
            </FormControl>
            <FormControl mt={4}>
              <Input
                placeholder="Due Date"
                value={currentTask?.due_date || ""}
                onChange={(e) =>
                  setCurrentTask((prev) =>
                    prev ? { ...prev, due_date: e.target.value } : null,
                  )
                }
              />
            </FormControl>
            <FormControl mt={4}>
              <Input
                placeholder="Category"
                value={currentTask?.category || ""}
                onChange={(e) =>
                  setCurrentTask((prev) =>
                    prev ? { ...prev, category: e.target.value } : null,
                  )
                }
              />
            </FormControl>
            <FormControl mt={4}>
              <Input
                placeholder="Frequency"
                value={currentTask?.frequency || ""}
                onChange={(e) =>
                  setCurrentTask((prev) =>
                    prev ? { ...prev, frequency: e.target.value } : null,
                  )
                }
              />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleCreateSave}>
              Save
            </Button>
            <Button variant="ghost" onClick={onCreateClose}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <AlertDialog
        isOpen={isDeleteOpen}
        leastDestructiveRef={cancelRef}
        onClose={onDeleteClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Delete Task
            </AlertDialogHeader>
            <AlertDialogBody>
              Are you sure you want to delete this task? This action cannot be undone.
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onDeleteClose}>
                Cancel
              </Button>
              <Button colorScheme="red" onClick={handleDelete} ml={3}>
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Box>
  );
};

export default ScheduledMaintenanceTaskList;
