import React from "react";
import {  useWallet,  InputTransactionData, } from "@aptos-labs/wallet-adapter-react";
import { useState,useEffect } from 'react';
import { Aptos, AptosConfig, Network } from "@aptos-labs/ts-sdk";
import Web3 from "web3";


 
const OTP = () =>{
  // const web3 = new Web3();
 

    const aptosConfig = new AptosConfig({ network: Network.DEVNET });
    const aptos = new Aptos(aptosConfig);
    const { account , signAndSubmitTransaction } = useWallet();
    const moduleAddress = "0x750e3394f4551dcf9d61b5152260ddf6c0cdf781064874bb27a66c330072d31d";

    const [otp, setotp] = useState<string>('');
    const [hex1, setHex] = useState<string>('');

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const inputValue = event.target.value;
        setotp(inputValue)
        const hex = Web3.utils.utf8ToHex(otp);
        setHex(hex)
        // Check if the input is a valid number
        // if (isNaN(Number(inputValue))) {
        //     setotp(Number(inputValue));
            
        //     console.log("The Ph Number :" , otp)
            
        // } else {
        //   // Handle non-numeric input (e.g., show an error message)
        //   console.error('Invalid input. Please enter a number.');
        // }
      };


    
    const verify = async () =>{
      if (!account) return [];
      
      // const hexInt = parseInt(hex) 
      // console.log(hexInt)
      console.log(hex1)
      const transaction:InputTransactionData = {
        data: {
          function:`${moduleAddress}::DNuVModuleTest2::verify`,
          functionArguments:[otp]
        }
      }
      console.log(transaction)
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
        <>
            <input
                type="text"
                className="h-10 w-60 rounded-md border-separate"
                placeholder="Enter OTP"
                onChange={handleInputChange}/>
                <button
                    onClick={verify}
                    className='bg-green-500 text-white px-3 py-2 rounded-xl hover:bg-red-500'
                    type="submit"
                    style={{ height: "40px", backgroundColor: "#3f67ff" }}
                    >
                    Verify
                </button>
             
        </>
    )
}

export default OTP