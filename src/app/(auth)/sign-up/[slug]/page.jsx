"use client";
import { useState,useEffect, Suspense } from 'react';
import SignUpForm from '../../../../components/auth/SignUpForm';
import { AuthApi } from '../../AuthApi';
import { useRouter, useParams} from 'next/navigation';


export default function page(){
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [instituteloading,setInstituteLoading] = useState(false);
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [institute,setInstitute] = useState([]);
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { slug } = useParams(); 
  // console.log(router.query.slug)
  const code =slug;

  const getAllInstitute = async () =>{
    try{
      setInstituteLoading(true);
      let institute = await AuthApi.getInstitute();
      institute?.data?.institute?.map((univerty,index)=>{
        setInstitute((prev)=>[...prev ,{
          value:index,
          label:univerty.name,
        }])
      })
      setInstituteLoading(false);
    } catch (e){
      setInstituteLoading(false);
      // setPopup({show:true,type:'error',message:error.message,timeout:3000});
    }
  }
  // eslint-disable-next-line react-hooks/rules-of-hooks
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
      <Suspense>
      <SignUpForm institute={institute} code={code}/>
      </Suspense>
      </>
    }
    </div>
  </>
}

