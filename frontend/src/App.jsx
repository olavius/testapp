import React, { useState } from "react";
import {
  ChakraProvider,
  Box,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
} from "@chakra-ui/react";
import WorkOrders from "./components/WorkOrders";
import Activities from "./components/Activities";
import "./styles.css";

function App() {
  const [selectedWorkOrder, setSelectedWorkOrder] = useState(null);

  return (
    <ChakraProvider>
      <Box className="app-container">
        <Tabs isFitted variant="enclosed">
          <TabList mb="1em">
            <Tab>Work Orders</Tab>
            <Tab>Activities</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <WorkOrders onSelectWorkOrder={setSelectedWorkOrder} />
            </TabPanel>
            <TabPanel>
              <Activities workOrder={selectedWorkOrder} />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </ChakraProvider>
  );
}

export default App;
