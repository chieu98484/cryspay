import React from "react";
import {  useWallet,  InputTransactionData, } from "@aptos-labs/wallet-adapter-react";
import { useState,useEffect } from 'react';
import { Aptos, AptosConfig, Network } from "@aptos-labs/ts-sdk";

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

const GetMappings = () => {


const aptosConfig = new AptosConfig({ network: Network.DEVNET });
const aptos = new Aptos(aptosConfig);


const [accountHasList, setAccountHasList] = useState<boolean>(false);

const { account , signAndSubmitTransaction } = useWallet();

const moduleAddress = "0x750e3394f4551dcf9d61b5152260ddf6c0cdf781064874bb27a66c330072d31d";

const [maps, setMaps] = useState<Task1[]>([]);

const [flag , setFlag] = useState<boolean>(false);



const fetchBalance = async () => {
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
    setAccountHasList(true);
    } catch (e: any) {
      setAccountHasList(false);
    }
    }

    return (
        <div>
            <button
            onClick={fetchBalance}
            className='bg-green-500 text-white px-3 py-2 rounded-xl hover:bg-red-500'
            type="submit"
            >
                Verifications
            </button>

            <div>
            <h2>Verified Numbers:</h2>
             
                <ul>
                    {maps.map((task,index) => (
                        <li key={index}>
                        <strong> User {index + 1} :</strong>
                        <p>Number: {task.key}</p>
                        <p>account: {task.value}</p>
                        </li>
                    ))}  
                </ul>
            </div>
        </div>
    )

}
  

export default GetMappings