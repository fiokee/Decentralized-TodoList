'use client'
import { useState } from 'react';
import Web3 from 'web3';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Add this import

// Add ethereum window type
declare global {
  interface Window {
    ethereum?: any;
  }
}

const ConnectWallet = () => {
    const [account, setAccount] = useState<string | null>(null);

    const connectWallet = async () => {
        if (typeof window.ethereum !== "undefined") {
            try {
                const web3 = new Web3(window.ethereum);
                const accounts = await web3.eth.requestAccounts();
                
                if (accounts.length > 0) {
                    setAccount(accounts[0]);
                    toast.success("Wallet connected successfully!");
                } else {
                    toast.error("No accounts found.");
                }
            } catch (error) {
                console.error("Error connecting wallet:", error);
                toast.error(
                    error instanceof Error 
                        ? error.message 
                        : "Failed to connect wallet. Please try again."
                );
            }
        } else {
            toast.error(
                "MetaMask is not installed. Please install it to use this feature.",
                {
                    onClick: () => {
                        window.open('https://metamask.io/download/', '_blank');
                    },
                }
            );
        }
    };

    return (
        <div className='text-center p-5 text-right'>
            <ToastContainer position="top-right" />
            {!account ? (
                <button 
                    onClick={connectWallet}
                    className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-[#FFAC1C] transition bg-orange-500"
                >
                    Connect Wallet
                </button>   
            ) : (
                <p className="text-gray-700 text-white">
                    Connected Wallet: {account.slice(0, 6)}...{account.slice(-4)}
                </p>
            )}
        </div>
    );
};

export default ConnectWallet;