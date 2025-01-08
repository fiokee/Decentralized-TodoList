'use client'
import { useEffect, useState } from 'react';
import Web3 from 'web3';
import { Contract } from 'web3';
import { TASK_CONTRACT_ABI, TASK_CONTRACT_ADDRESS } from '../../../constants/TaskContract';
import TaskItem from './TaskItem';
import { ContractAbi } from 'web3';

interface Task {
    id: string;
    title: string;
    description: string;
    completed: boolean;
}

declare global {
    interface Window {
        ethereum?: any;
    }
}

const TaskList = () => {
    const [tasks, setTasks] = useState<Task[]>([]);

    const fetchTasks = async () => {
        try {
            if (!window.ethereum) {
                throw new Error("Please install MetaMask");
            }

            const web3 = new Web3(window.ethereum);
            const accounts = await web3.eth.requestAccounts();
            
            // Create contract instance with correct typing
            const taskContract = new Contract(
                TASK_CONTRACT_ABI as ContractAbi,
                TASK_CONTRACT_ADDRESS,
                web3.eth
            );

            const fetchedTasks: Task[] = await taskContract.methods
                .getMyTasks()
                .call({ from: accounts[0] });

            setTasks(Array.isArray(fetchedTasks) ? fetchedTasks : []);

        } catch (error) {
            console.error("Error fetching tasks:", error);
            setTasks([]);
        }
    };

    const handleTaskUpdate = () => {
        fetchTasks();
    };

    useEffect(() => {
        fetchTasks();
    }, []);

    return (
        <div className='p-4'>
            <h2 className="text-xl font-bold mb-4">My Tasks</h2>
            <div className="space-y-2">
                {tasks.length ? (
                    tasks.map((task, idx) => (
                        <TaskItem 
                            key={`${task.id || idx}`} 
                            task={task} 
                            onTaskUpdated={handleTaskUpdate}
                        />
                    ))
                ) : (
                    <p>No Tasks found!</p>
                )}
            </div>
        </div>
    );
};

export default TaskList;