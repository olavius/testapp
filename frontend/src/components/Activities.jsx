import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  VStack,
  Text,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  FormControl,
  Input,
  useDisclosure,
} from "@chakra-ui/react";
import axios from "axios";

const Activities = ({ workOrder }) => {
  const [activities, setActivities] = useState([]);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [currentActivity, setCurrentActivity] = useState(null);

  useEffect(() => {
    if (workOrder) {
      fetchActivities();
    }
  }, [workOrder]);

  const fetchActivities = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/workorders/${workOrder.id}/activities`,
      );
      if (Array.isArray(response.data)) {
        setActivities(response.data);
      } else {
        setActivities([]);
      }
    } catch (error) {
      console.error("Error fetching activities:", error);
      setActivities([]);
    }
  };

  const handleCreate = () => {
    setCurrentActivity({
      title: "",
      description: "",
      workorder_id: workOrder.id,
    });
    onOpen();
  };

  const handleSave = async () => {
    if (currentActivity.id) {
      await axios.put(
        `http://localhost:5000/api/activities/${currentActivity.id}`,
        currentActivity,
      );
    } else {
      const response = await axios.post(
        "http://localhost:5000/api/activities",
        currentActivity,
      );
      setActivities([...activities, response.data]);
    }
    onClose();
    fetchActivities();
  };

  const handleEdit = (activity) => {
    setCurrentActivity(activity);
    onOpen();
  };

  return (
    <Box>
      {workOrder ? (
        <>
          <Button colorScheme="teal" onClick={handleCreate}>
            Create Activity
          </Button>
          <VStack spacing={4} align="stretch" mt={4}>
            {Array.isArray(activities) &&
              activities.map((activity) => (
                <Box key={activity.id} className="card">
                  <Text fontSize="xl" fontWeight="bold">
                    {activity.title}
                  </Text>
                  <Text>{activity.description}</Text>
                  <Button
                    size="sm"
                    colorScheme="blue"
                    onClick={() => handleEdit(activity)}
                  >
                    Edit
                  </Button>
                </Box>
              ))}
          </VStack>
          <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>
                {currentActivity?.id ? "Edit Activity" : "Create Activity"}
              </ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <FormControl>
                  <Input
                    placeholder="Title"
                    value={currentActivity?.title}
                    onChange={(e) =>
                      setCurrentActivity({
                        ...currentActivity,
                        title: e.target.value,
                      })
                    }
                  />
                </FormControl>
                <FormControl mt={4}>
                  <Input
                    placeholder="Description"
                    value={currentActivity?.description}
                    onChange={(e) =>
                      setCurrentActivity({
                        ...currentActivity,
                        description: e.target.value,
                      })
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
        </>
      ) : (
        <Text>Select a work order to view activities.</Text>
      )}
    </Box>
  );
};

export default Activities;
