import React, { useState } from 'react'
import loginbg from "@/assets/login2.png"
import victory from '@/assets/victory.svg'
import { Tabs, TabsTrigger,TabsList,TabsContent} from '@radix-ui/react-tabs'
import { Input } from "@/components/ui/input"
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import {apiClient} from "@/lib/api-client"
import { LOGIN_ROUTE, SIGNUP_ROUTE } from '@/utils/constants'
import {  useNavigate } from 'react-router-dom'
import { useAppStore } from '@/store'

function Auth() {
      const navigate=useNavigate();
      const { setUserInfo }=useAppStore();
      const [email,setEmail] = useState("");
      const [password,setPassword] = useState("");
      const [confirmPassword,setConfirmPassword] = useState("");

      const validateSignup=()=>{
        if(!email.length){
          toast.error("Email is required.");
          return false;
        }
        if(!password.length){
          toast.error("Password is required.");
          return false;
        }
        if(password!==confirmPassword){
          toast.error("Password and confirm password should be same.");
          return false;
        }
        return true;
      }
      const validateLogin=()=>{
        if(!email.length){
          toast.error("Email is required.");
          return false;
        }
        if(!password.length){
          toast.error("Password is required.");
          return false;
        }
        return true;
      }
      const handleLogin =async ()=>{
        if(validateLogin()){
          const response = await apiClient.post(LOGIN_ROUTE,{email,password},{withCredentials:true});
          console.log({response});
          if(response.data.user.id){
            setUserInfo(response.data.user);
            if(response.data.user.profileSetup) navigate("/chat");
            else navigate('/profile');
          
            }
        }
       setPassword("");
       setEmail("");
      setConfirmPassword("");
      };
      const handleSignup =async ()=>{
        if(validateSignup()){
          const response = await apiClient.post(SIGNUP_ROUTE ,{email,password},{withCredentials:true});
          console.log({response});
        }
        if(response.status===201){
          setUserInfo(response.data.user);
          navigate("/profile");
        }
        setPassword("");
        setEmail("");
         
      };
      
  return (
    <div className='h-[100vh] w-[100vw] flex items-center justify-center bg-[#1b1b33]'>
        <div className='h-[80vh] bg-[#25253c] border-2 border-white text-opacity-90 shadow-2xl w-[80vw] md:w-[90vw] lg:w-[70vw] xl:w-[60vw] rounded-3xl grid xl:grid-cols-2 p-6'>
            <div className='flex flex-col gap-10 items-center justify-center'>
                <div className='flex items-center justify-center flex-col'>
                  <div className='flex items-center justify-center flex-col'>
                    <div className='flex flex-row items-center justify-center'>
                      <h1 className='text-5xl font-bold md:text-6xl text-white/90'>Welcome</h1>
                      <img src={victory} alt="Victory Emoji" className='h-[100px]' />
                    </div>
                    <p className='font-medium text-center text-xl text-white/90'>Fill in the details to get started with the best chat app!</p> 
                  </div>
                  <div className='flex items-center justify-center w-full font-bold text-xl text-white'>
                      <Tabs className='w-full font-bold text-xl ' defaultValue='login'>
                        <TabsList className='bg-transparent rounded-full w-full flex justify-around mt-3'>
                          <TabsTrigger value='login' className='data-[state=active]:bg-blue-800/40 text-white text-opacity-90 border-b-2 rounded-1xl w-full data-[state=active]:text-white data-[state=active]:font-semibold data-[state=active]:border-b-blue-700 p-3 transition-all duration-300 '> Login</TabsTrigger>
                          <TabsTrigger value='signup' className='data-[state=active]:bg-blue-800/40 text-white text-opacity-90 border-b-2 rounded-1xl w-full data-[state=active]:text-white data-[state=active]:font-semibold data-[state=active]:border-b-blue-700 p-3 transition-all duration-300 '> Sign Up</TabsTrigger>
                        </TabsList>
                        <TabsContent className='flex flex-col gap-5 mt-10' value='login' >
                          <Input placeholder="Email" type="email" className="rounded-full p-6 " value={email} onChange={(e)=>setEmail(e.target.value)} ></Input>
                          <Input placeholder="Password" type="password" className="rounded-full p-6 " value={password} onChange={(e)=>setPassword(e.target.value)}></Input>
                          <Button className="rounded-full p-6 text-xl bg-blue-500 hover:bg-blue-300 transition-all duration-300" onClick={handleLogin}>Login</Button>
                        </TabsContent>
                        <TabsContent className='flex flex-col gap-5 mt-10' value='signup' >
                        <Input placeholder="Email" type="email" className="rounded-full p-6 " value={email} onChange={(e)=>setEmail(e.target.value)}></Input>
                        <Input placeholder="Password" type="password" className="rounded-full p-6 " value={password} onChange={(e)=>setPassword(e.target.value)}></Input>
                        <Input placeholder="Confirm Password" type="password" className="rounded-full p-6  " value={confirmPassword} onChange={(e)=>setConfirmPassword(e.target.value)}></Input>
                        <Button className="rounded-full p-6 text-xl bg-blue-500 hover:bg-blue-300 transition-all duration-300" onClick={handleSignup}>Sign Up</Button>
                        </TabsContent>
                      </Tabs>
                  </div>
                </div>
            </div>
            <div className='hidden xl:flex justify-center items-center'>
              <img src={loginbg} alt="background login"  className='h-[600px]'/>
            </div>
        </div>
    </div>
  )
}

export default Auth
