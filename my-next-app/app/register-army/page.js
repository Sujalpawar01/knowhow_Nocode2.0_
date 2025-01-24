'use client'

import React, { useState } from 'react'

const page = () => {
    const [form, setform] = useState({ ic: "", adhar: "" });

    const submitdata=(e)=>{
        // e.preventDefault();
        const formData = new FormData(e.target);

        // await 
    }



    return (
        <div className='bg-slate-800 min-h-screen'>
            <form onSubmit={submitdata} className='flex flex-col pt-[10%]'>
                <div className='bg-slate-800 ml-10 flex flex-col items-center gap-5'>
                    <input type="number" placeholder='IC no' className='w-[40%] h-12 pl-3 text-black' required />
                    <input type="text" placeholder='adhar no' className='w-[40%] h-12 pl-3 text-black' required />
                    <button type='button' className='text-white'>Submit</button>
                </div>
            </form>
        </div>
    )
}

export default page
