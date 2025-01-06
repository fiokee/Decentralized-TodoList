import { expect } from "chai";
import { ethers } from "hardhat";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { Contract, ContractFactory } from "ethers";

interface Task {
  taskText: string;
  isDeleted: boolean;
}

describe("Task Contract", function () {
  let TaskContract: ContractFactory;
  let taskContract: Contract;
  let owner: SignerWithAddress;
  let addr1: SignerWithAddress;
  let addr2: SignerWithAddress;

  const NUM_TOTAL_TASKS: number = 5;
  let totalTasks: Task[];

  beforeEach(async function () {
    // Get contract factory and signers
    TaskContract = await ethers.getContractFactory("TaskContract");
    [owner, addr1, addr2] = await ethers.getSigners();

    // Deploy contract and wait for deployment
    taskContract = await TaskContract.deploy();

    totalTasks = [];
    // Create initial tasks
    for (let i = 0; i < NUM_TOTAL_TASKS; i++) {
      let task: Task = {
        taskText: 'Task number: ' + i,
        isDeleted: false
      };
      await taskContract.addTask(task.taskText, task.isDeleted);
      totalTasks.push(task);
    }
  });

  describe("Add Task", function () {
    it("should emit taskAdd event", async function () {
      const task: Task = {
        taskText: 'New Task',
        isDeleted: false
      };
      
      await expect(taskContract.addTask(task.taskText, task.isDeleted))
        .to.emit(taskContract, 'taskAdd')
        .withArgs(owner.address, NUM_TOTAL_TASKS);
    });

    it("should store task with correct data", async function () {
      const newTaskText: string = "Test Task";
      await taskContract.addTask(newTaskText, false);
      
      const tasks = await taskContract.getMyTasks();
      const lastTask = tasks[tasks.length - 1];
      
      expect(lastTask.description).to.equal(newTaskText);
      expect(lastTask.isDeleted).to.be.false;
      expect(lastTask.owner).to.equal(owner.address);
    });
  });

  describe("Get My Tasks", function () {
    it("should return the correct number of total tasks", async function () {
      const tasksFromChain = await taskContract.getMyTasks();
      expect(tasksFromChain.length).to.equal(NUM_TOTAL_TASKS);
    });

    it("should only return tasks from the caller", async function () {
      await taskContract.connect(addr1).addTask("Task from addr1", false);
      
      const ownerTasks = await taskContract.getMyTasks();
      expect(ownerTasks.length).to.equal(NUM_TOTAL_TASKS);
      
      const addr1Tasks = await taskContract.connect(addr1).getMyTasks();
      expect(addr1Tasks.length).to.equal(1);
    });

    it("should not return deleted tasks", async function () {
      await taskContract.deleteTask(0, true);
      const tasks = await taskContract.getMyTasks();
      expect(tasks.length).to.equal(NUM_TOTAL_TASKS - 1);
    });
  });

  describe("Delete Task", function () {
    it("should emit deletedTask event", async function () {
      const TASK_ID: number = 0;
      const TASK_DELETED: boolean = true;

      await expect(taskContract.deleteTask(TASK_ID, TASK_DELETED))
        .to.emit(taskContract, 'deletedTask')
        .withArgs(TASK_ID, TASK_DELETED);
    });

    it("should prevent non-owners from deleting tasks", async function () {
      await expect(
        taskContract.connect(addr1).deleteTask(0, true)
      ).to.be.revertedWith("you are not the task owner");
    });
  });

  describe("Update Task", function () {
    it("should update task description", async function () {
      const newDescription: string = "Updated Task";
      await taskContract.updateTask(0, newDescription);
      
      const tasks = await taskContract.getMyTasks();
      expect(tasks[0].description).to.equal(newDescription);
    });

    it("should prevent non-owners from updating tasks", async function () {
      await expect(
        taskContract.connect(addr1).updateTask(0, "Unauthorized update")
      ).to.be.revertedWith("You are not the task owner");
    });

    it("should maintain task ownership after update", async function () {
      await taskContract.updateTask(0, "Updated description");
      const tasks = await taskContract.getMyTasks();
      expect(tasks[0].owner).to.equal(owner.address);
    });
  });
});