import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const TaskContractModule = buildModule("TaskContractModule", (m) => {
  // Deploy the TaskContract without constructor arguments
  const taskContract = m.contract("TaskContract", []);

  // Return the deployed contract future
  return { taskContract };
});

// Print the deployed contract address after deployment
TaskContractModule.finalize = async (deployment) => {
  try {
    const deployedContract = await deployment.deployedContracts.taskContract;
    console.log("TaskContract deployed to:", deployedContract.address);
  } catch (error) {
    console.error("Error retrieving the deployed contract address:", error);
  }
};

export default TaskContractModule;
