import React from "react";
import {  useWallet,  InputTransactionData, } from "@aptos-labs/wallet-adapter-react";
import { useState,useEffect } from 'react';
import { APTOS_COIN, Account, Aptos, AptosConfig, InputGenerateTransactionOptions, MoveStructId, Network } from "@aptos-labs/ts-sdk";
import { accounts } from "web3/lib/commonjs/eth.exports";

type value ={
    otp_hash: string;
    phone: string;
    verified: boolean;
} 

type Task = {
    key: string;
    value: value; // Assuming value is a string, adjust the type accordingly
    
}


type Task1 ={
    key: string;
    value:string;
}



type SingleSignerTransaction = {
    hash: string;
    // other properties of a transaction...
};


const MakePaymets = () => {


const aptosConfig = new AptosConfig({ network: Network.DEVNET });
const aptos = new Aptos(aptosConfig);


const [accountHasList, setAccountHasList] = useState<boolean>(false);

const { account , signAndSubmitTransaction } = useWallet();

const moduleAddress = "0x750e3394f4551dcf9d61b5152260ddf6c0cdf781064874bb27a66c330072d31d";

const [maps, setMaps] = useState<Task1[]>([]);

const [flag , setFlag] = useState<boolean>(false);

const [response , setResponse] = useState<string>('')


const [amount, setAmount] = useState<string>();
const [reciver, setReciver] = useState<string>();
const [phNumber, setPhNumber] = useState<string>();
const [balance, setBalance] = useState<string>();


const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = event.target.value;

    // Check if the input is a valid number
    if (!isNaN(Number(inputValue))) {
        setAmount(inputValue);
        console.log("The Ph Number :" , amount)
    } else {
      // Handle non-numeric input (e.g., show an error message)
      console.error('Invalid input. Please enter a number.');
    }
  };

  const handleAddressInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = event.target.value;

        setPhNumber(inputValue);
        console.log("The Ph Number :" , phNumber)
     
    }

const getAccountWithNumber = async () => {
    if (!account) return [];
    // change this to be your module account address
    
    try {
        const mapings = await aptos.getAccountResource(
            {
                accountAddress:moduleAddress,
                resourceType:`${moduleAddress}::DNuVModuleTest2::DNuVMap`
            }
        );

        //   console.log(mapings)
        console.log("The mapping of number to account :",mapings)
        const data = (mapings as any).map.data
        console.log('the data is :',data)
        setMaps(data)
        setFlag(true)
        console.log(maps)
        const targetKey = phNumber
        const foundItem = maps.find((item) => item.key === targetKey);
        console.log("the address value of get value pair:",maps)
        
        if (foundItem) {
            setReciver(foundItem.value)
            // If the key is found, you can access the corresponding value
            const targetValue = foundItem.value;
            console.log(`Value for key ${targetKey}: ${targetValue}`);
        } else {
            console.log(`Key ${targetKey} not found in maps`);
        }
        setAccountHasList(true);
        
        } catch (e: any) {
        setAccountHasList(false);
        }
    }


    useEffect(() => {
        if (reciver) {
          makeTnx(reciver);
        }
      }, [reciver]);

    const Balance = async (
         
        accountAddress: string,
        ): Promise<number> => {
            const amount = await aptos.getAccountAPTAmount({
            accountAddress,
        });
        console.log(`balance is: ${amount}`);
        return amount;
    };

    useEffect(() => {
        // Fetch initial balance
        getBalance();
    
        // Set up polling interval
        // const intervalId = setInterval(getBalance, 5000); // Poll every 5 seconds (adjust as needed)
    
        // Clean up the interval when the component unmounts
        // return () => clearInterval(intervalId);
      }, [balance]);
    


    const getBalance = async() =>{
        let amount
        if (!account) {
            return []
        } else {
            amount = await Balance(account?.address);
            setBalance(amount.toString())
        }

        console.log('the balance is :',Balance)
    }


     

    const makeTnx = async (reciver:string | undefined) => {

        if (reciver === undefined) {
            console.log("Reciver is undefined. Cannot proceed with the transaction.");
            return;
        }
        const rev = reciver
        console.log("the amount is :",amount)
        const transaction:InputTransactionData = {
            data: {
              function:`0x1::aptos_account::transfer`,
              functionArguments:[rev,amount]
            }
          }

          try {
            // sign and submit transaction to chain
            const response = await signAndSubmitTransaction(transaction);
            console.log(response)
            // wait for transaction
            await aptos.waitForTransaction({transactionHash:response.hash});
          
          } catch (error: any) {
                  console.log(error.message)
            }
    }
     

    return (
        <div>
            <nav className="flex justify-between px-4 mt-2">
            <div>
                <h1 className="text-gray-200 text-2xl"><strong>The Account Balance is : {balance}</strong></h1>
            </div>
            <button
            onClick={getBalance}
            className='bg-blue-500 text-white px-3 py-2 rounded-xl hover:bg-green-500'
            type="submit"
             
            >
                Check Balance
            </button>
            
            </nav>
            <div >
            <input
                type="text"
                className="mr-4 h-10 w-60 rounded-md border-separate"
                placeholder="Enter Phone Number"
                onChange={handleAddressInputChange}
                />
            </div>
            <div className="mt-2">
            <input
                type="text"
                className="h-10 rounded-md border-separate"
                placeholder="Enter Amount"
                onChange={handleInputChange}
                />
                <button
                    onClick={getAccountWithNumber}
                    className='bg-blue-500 text-white px-3 py-2 rounded-xl hover:bg-green-500'
                    type="submit"
                    >
                    CrySPay
                </button>
           
             
            </div>
        </div>
    )

}
  

export default MakePaymets