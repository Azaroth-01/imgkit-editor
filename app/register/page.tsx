'use client'

import { useRouter } from "next/navigation";
import React, { useState } from "react";
 const RegisterPage=()=>{

    const [email,setEmail]=useState("");
    const [password,setPassword]=useState("");
    const [confirmPassword,setConfirmPassword]=useState("");
    const router=useRouter();       //to route our page

    const handleSubmit=async (e:React.FormEvent)=>{
        e.preventDefault();
        if(password!=confirmPassword){
            alert("passwords do not match")
            return ;
        }

        try {
            const res=await fetch("api/auth/register",
                {
                    method:"POST",
                    headers:{
                        "Content-Type":"application/json",
                    },
                    body:JSON.stringify({           //convert it to string as data can be in any format
                        email,
                        password
                    })
                }
            )
        const data= await res.json();   //convert the response to json
        
        if(!res.ok){
            throw new Error(data.error || "registration failed")
        }

        console.log(data);
        router.push("/login")
    
    } catch (error) {
            console.log("Error");
        }
    }
    
    return(

        <div>
            <h1>Register</h1>
            <form onSubmit={handleSubmit}>
                <input 
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e)=>setEmail(e.target.value)}
                />

                <input 
                type="text"
                placeholder="Password"
                value={password}
                onChange={(e)=>setPassword(e.target.value)}
                />

                <input 
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e)=>setConfirmPassword(e.target.value)}
                />

                <button type="submit">Register</button>
                              
            </form>

            <div>
                <p>Already have an account? <a href="/login">Login </a></p>
            </div>
        </div>
    )
}

export default RegisterPage;