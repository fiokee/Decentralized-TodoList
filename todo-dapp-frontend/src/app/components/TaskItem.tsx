'use client'
import { useState } from 'react';
import Web3 from 'web3';
import { Contract, ContractAbi } from 'web3';
import {toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { TASK_CONTRACT_ABI, TASK_CONTRACT_ADDRESS } from '../../../constants/TaskContract';

interface Task {
    id: string;
    description: string;
    completed: boolean;
    // Add other task properties if any
}

interface TaskItemProps {
    task: Task;
    onTaskUpdated: () => void;
}

const TaskItem: React.FC<TaskItemProps> = ({ task, onTaskUpdated }) => {
    const [isDeleting, setIsDeleting] = useState(false);

    const deleteTask = async () => {
        if (!window.confirm('Are you sure you want to delete this task?')) {
            return;
        }

        setIsDeleting(true);
        try {
            if (!window.ethereum) {
                throw new Error("Please install MetaMask");
            }

            const web3 = new Web3(window.ethereum);
            const accounts = await web3.eth.requestAccounts();

            if (!accounts || accounts.length === 0) {
                throw new Error("No accounts found. Please connect your wallet");
            }

            const taskContract = new Contract(
                TASK_CONTRACT_ABI as ContractAbi,
                TASK_CONTRACT_ADDRESS,
                web3.eth
            );

            await taskContract.methods
                .deleteTask(task.id, true)
                .send({ from: accounts[0] });

            onTaskUpdated();
            toast.success("Task deleted successfully!");
        } catch (error) {
            console.error("Error deleting task:", error);
            toast.error(
                error instanceof Error 
                    ? error.message 
                    : "Failed to delete task."
            );
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <div className="flex justify-between items-center bg-gray-100 p-4 rounded hover:bg-gray-200 transition-colors">
            <div className="flex items-center space-x-4 flex-1">
                <p className="break-word flex-1" title={task.description}>
                    {task.description}
                </p>
                {task.completed && (
                    <span className="text-green-500 text-sm">
                        Completed
                    </span>
                )}
            </div>
            <div className="flex items-center space-x-2">
                <button
                    onClick={deleteTask}
                    disabled={isDeleting}
                    className={`
                        px-4 py-2 rounded
                        ${isDeleting 
                            ? 'bg-gray-400 cursor-not-allowed' 
                            : 'bg-red-500 hover:bg-red-600'}
                        text-white transition-colors
                    `}
                >
                    {isDeleting ? 'Deleting...' : 'Delete'}
                </button>
            </div>
            {/* <ToastContainer 
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop
            /> */}
        </div>
    );
};

export default TaskItem;