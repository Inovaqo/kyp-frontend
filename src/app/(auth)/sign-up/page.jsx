"use client";
import { useState,useEffect } from 'react';
import SignUpForm from '../../../components/auth/SignUpForm';
import { AuthApi } from '../AuthApi';
export default function page(){
  const [instituteloading,setInstituteLoading] = useState(false);
  const [institute,setInstitute] = useState([]);

  const getAllInstitute = async () =>{
    try{
      setInstituteLoading(true);
      let institute = await AuthApi.getInstitute();
      console.log("institute ",institute);
      institute?.data?.institute?.map((univerty,index)=>{
        setInstitute((prev)=>[...prev ,{
          value:index,
          label:univerty.name,
        }])
      })
      setInstituteLoading(false);
    } catch (e){
      setInstituteLoading(false);
      console.log("error: ",e)
      // setPopup({show:true,type:'error',message:error.message,timeout:3000});
    }
  }
  console.log("institute ---- : ",institute)
  useEffect(()=>{
    getAllInstitute();
  },[])

  return<>
    <div className="bg-ffffff px-40 py-20 border-radius-8 mobile-px-20" style={{width:'650px',minHeight:'650px'}}>
    {
    instituteloading ? 
    <div style={{width:'100%',height:'100%',display: 'flex',alignItems: 'center',justifyContent: 'center'}} height={380} width={380}> 
            <span className="loader"></span>
            </div> 
    : <>
      <h2 className="text-24 text-1F1F1F text-center text-xl-start text-weight-500 mb-2">Sign Up</h2>
      <p className="text-434343 text-16 text-center text-xl-start text-weight-400 mb-4">Enter details to create an account</p>
      <SignUpForm institute={institute}/>
      </>
    }
    </div>
  </>
}

