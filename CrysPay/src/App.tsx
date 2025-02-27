import React from 'react';
import logo from './logo.svg';
import logo1 from './logoCrySPay.png'
import aptbg from './aptbg.png'
import './App.css';
import { Layout, Row, Col } from "antd";
import { WalletSelector } from "@aptos-labs/wallet-adapter-ant-design";
import "@aptos-labs/wallet-adapter-ant-design/dist/index.css";
// import { Aptos } from "@aptos-labs/ts-sdk";
// import { useWallet } from "@aptos-labs/wallet-adapter-react";
import {  useWallet,  InputTransactionData, } from "@aptos-labs/wallet-adapter-react";
import { useState,useEffect } from 'react';
import { Aptos, AptosConfig, Network } from "@aptos-labs/ts-sdk";

import GetMappings from './components/getMappings';
import Apply from './components/apply';
import OTP from './components/verifyOTP';
import MakePaymets from './components/payments';

const aptosConfig = new AptosConfig({ network: Network.DEVNET });
const aptos = new Aptos(aptosConfig);



type Task1 ={
  key: string;
  value:string;
}

// const aptos = new Aptos();
 
function App() {
  const [accountHasList, setAccountHasList] = useState<boolean>(false);
  const [maps, setMaps] = useState<Task1[]>([]);
  const [address1, setAddress1] = useState<string>('');
  const [reciver, setReciver] = useState<string>();

  const { account , signAndSubmitTransaction } = useWallet();
  const moduleAddress = "0x750e3394f4551dcf9d61b5152260ddf6c0cdf781064874bb27a66c330072d31d";

  const [flag,setFlag] = useState<boolean>(false)
  const [flag1,setFlag1] = useState<boolean>(false)

  const numberAndOtpHandles = () =>{
    setFlag(true)
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
        // console.log("The mapping of number to account :",mapings)
        const data = (mapings as any).map.data
        // console.log('the data is :',data)
        setMaps(data)
        console.log(maps)
        check(data)
        setFlag1(true)
        setAccountHasList(true);
        
        } catch (e: any) {
        setAccountHasList(false);
        }
    }

    

     const check = (data:Task1[]) =>{
      if (!account) return [];
      const targetKey = account?.address

      const foundItem = data.find((item) => item.value === targetKey);
      console.log("the address value of get value pair:",maps)
      
      if (foundItem) {
          setReciver(foundItem.value)
          // If the key is found, you can access the corresponding value
          const targetValue = foundItem.value;
          console.log(`Value for key ${targetKey}: ${targetValue}`);
      } else {
          console.log(`Key ${targetKey} not found in maps`);
      }
     }

     useEffect(() => {
      getAccountWithNumber();
    }, [account]);
    
     

    
    console.log('Rendering with reciver:', reciver);

     

  return (
    <>
    {/* <Layout>
      <Row align="middle" className='bg-red-200 '>
        <Col span={10} offset={2}>
          <h1>CrySPay</h1>
        </Col>
        <Col span={12} style={{ textAlign: "right", paddingRight: "200px" }}>
          <WalletSelector />
        </Col>
      </Row>
      <div className='m-12'>
        {!reciver===undefined ?
        (<Col span={12} style={{textAlign: "right", paddingRight: "200px" }}>
          {flag ? <OTP/> : <Apply numberAndOtpHandles={numberAndOtpHandles} />}
        </Col>) : (
          <>
        <MakePaymets/>
        <GetMappings />
        </>)}
      </div>
    </Layout> */}
    <div className="h-screen mx-auto text-center justify-center bg-gradient-to-r from-purple-500 to-pink-500">
      <nav className='flex bg-black text-blue-500 justify-between px-4'>
        <div className='flex'>
        
        <img src={logo1} alt="Logo" className='w-12 h-12' />
        <h1 className='font-bold mt-1 text-3xl'><strong>CrysPay</strong></h1>
        </div>
           <WalletSelector />
       </nav>
          
      <div className=''>
          {reciver===undefined ?
          ( 
            <>{flag ? <OTP/> : <Apply numberAndOtpHandles={numberAndOtpHandles} />}</>
            ) : (
          <>
          <MakePaymets/>
          {/* <GetMappings /> */}
        </>)}
      </div>
    </div>
  </>
  );
}

export default App;
