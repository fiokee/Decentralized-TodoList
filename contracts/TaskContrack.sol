//SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

contract TaskContract{

    event taskAdd(address indexed owner, uint indexed taskId);
    event deletedTask(uint indexed taskId, bool isDeleted);

struct Task{
    uint id;
    address owner;
    string description;
    bool isDeleted;
}
//array to store tasks
Task[]private tasks;

//mapping task Id with creator address
mapping (uint256 => address) taskOwner;

function addTask(string memory description, bool isDeleted)external {
    uint taskId = tasks.length;
    tasks.push(Task(taskId, msg.sender, description, isDeleted)); //adding task
    taskOwner[taskId] = msg.sender; //mapping task id with the owner address
    
    emit taskAdd(msg.sender, taskId);// emit events for task creation
}

 /**
     * @notice Retrieves all tasks created by the caller that are not deleted.
     * @return Array of tasks belonging to the caller.
     */
     function getMyTasks() external view returns (Task[] memory){
        uint totalTasks = tasks.length;

        uint count = 0; //counter for tasks belonging to caller

        //temporary array to hold tasks belonging to caller
        Task[] memory tempTasks = new Task[](totalTasks);

        for(uint i = 0; i < totalTasks; i++){
        //check if the caller is the owner and the task is not deleted
        if(taskOwner[i] == msg.sender && !tasks[i].isDeleted){
            tempTasks[count] = tasks[i];
            count++;
        }
        }
    // Create a final array of exact size to hold the caller's tasks
        Task[] memory myTasks = new Task[](count);
        for(uint i = 0; i < count; i++){
            myTasks[i] = tempTasks[i];
        }
        return myTasks; //return the caller's task
     }

     //update
     function updateTask(uint taskId, string memory newDescription) external {
    require(taskOwner[taskId] == msg.sender, "You are not the task owner");
    tasks[taskId].description = newDescription;
}


      /**
     * @notice Marks a task as deleted if the caller is the owner.
     * @param taskId The ID of the task to delete.
     * @param isDeleted The deletion status to set (true for deletion).
     */
     function deleteTask(uint taskId, bool isDeleted)external {
        require(taskOwner[taskId] == msg.sender, "you are not the task owner");
    //update the task deletion status
        tasks[taskId].isDeleted = isDeleted;

        emit deletedTask(taskId, isDeleted);
     }
}