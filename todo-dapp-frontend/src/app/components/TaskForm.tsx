'use client'
import { useState } from 'react';
import Web3 from 'web3';
import { Contract, ContractAbi } from 'web3';
import { TASK_CONTRACT_ABI, TASK_CONTRACT_ADDRESS } from '../../../constants/TaskContract';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import TaskList from './TaskList';

interface TaskFormProps {
    onTaskAdded: () => void;
}

const TaskForm: React.FC<TaskFormProps> = ({ onTaskAdded }) => {
    const [description, setDescription] = useState<string>('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const addTask = async () => {
        if (!description.trim()) {
            toast.error('Task Description is required!');
            return;
        }
        
        const MAX_DESCRIPTION_LENGTH = 100;
    
        if (description.trim().length > MAX_DESCRIPTION_LENGTH) {
            toast.error(`Task description must be less than ${MAX_DESCRIPTION_LENGTH} characters`);
            return;
        }
        setIsSubmitting(true);
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
                .addTask(description.trim(), false)
                .send({ from: accounts[0] });

            setDescription('');
            onTaskAdded();
            toast.success('Task Added Successfully');
            
        } catch (error) {
            console.error("Error adding task:", error);
            toast.error(
                error instanceof Error 
                    ? error.message 
                    : 'Failed to add task'
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        addTask();
    };

    return (
        <div className='p-4 bg-white shadow rounded-lg'>
            <h2 className="text-xl font-bold mb-4 text-black">Add New Task</h2>
            <ToastContainer position="top-right" />
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <input
                        type='text'
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder='Enter Task description'
                        className='w-full p-2 border rounded mb-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black font-bold'
                        disabled={isSubmitting}
                    />
                </div>
                <button 
                    type="submit"
                    disabled={isSubmitting || !description.trim()}
                    className={`w-full bg-orange-500 text-white px-4 py-2 rounded 
                        ${isSubmitting || !description.trim() 
                            ? 'opacity-50 cursor-not-allowed' 
                            : 'hover:bg-orange-600'}`}
                >
                    {isSubmitting ? 'Adding Task...' : 'Add Task'}
                </button>
            </form>
            <div className="mt-8">
                <TaskList />
            </div>
        </div>
    );
};

export default TaskForm;
