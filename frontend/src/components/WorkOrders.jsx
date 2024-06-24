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

const WorkOrders = ({ onSelectWorkOrder }) => {
  const [workOrders, setWorkOrders] = useState([]);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [currentWorkOrder, setCurrentWorkOrder] = useState(null);

  useEffect(() => {
    fetchWorkOrders();
  }, []);

  const fetchWorkOrders = async () => {
    try {
      const response = await axios.get("/api/workorders");
      setWorkOrders(response.data);
    } catch (error) {
      console.error("Error fetching work orders:", error);
    }
  };

  const handleCreate = () => {
    setCurrentWorkOrder({ title: "", description: "" });
    onOpen();
  };

  const handleSave = async () => {
    if (currentWorkOrder.id) {
      await axios.put(
        `/api/workorders/${currentWorkOrder.id}`,
        currentWorkOrder,
      );
    } else {
      const response = await axios.post("/api/workorders", currentWorkOrder);
      setWorkOrders([...workOrders, response.data]);
    }
    onClose();
    fetchWorkOrders();
  };

  const handleEdit = (workOrder) => {
    setCurrentWorkOrder(workOrder);
    onOpen();
  };

  return (
    <Box>
      <Button colorScheme="teal" onClick={handleCreate}>
        Create Work Order
      </Button>
      <VStack spacing={4} align="stretch" mt={4}>
        {workOrders.map((workOrder) => (
          <Box
            key={workOrder.id}
            className="card"
            onClick={() => onSelectWorkOrder(workOrder)}
          >
            <Text fontSize="xl" fontWeight="bold">
              {workOrder.title}
            </Text>
            <Text>{workOrder.description}</Text>
            <Button
              size="sm"
              colorScheme="blue"
              onClick={() => handleEdit(workOrder)}
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
            {currentWorkOrder?.id ? "Edit Work Order" : "Create Work Order"}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl>
              <Input
                placeholder="Title"
                value={currentWorkOrder?.title}
                onChange={(e) =>
                  setCurrentWorkOrder({
                    ...currentWorkOrder,
                    title: e.target.value,
                  })
                }
              />
            </FormControl>
            <FormControl mt={4}>
              <Input
                placeholder="Description"
                value={currentWorkOrder?.description}
                onChange={(e) =>
                  setCurrentWorkOrder({
                    ...currentWorkOrder,
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
    </Box>
  );
};

export default WorkOrders;
