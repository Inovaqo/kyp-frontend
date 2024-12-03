'use client';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import Link from 'next/link';
import { useState, useEffect,useRef } from 'react';
import {AuthApi} from '@/app/(auth)/AuthApi';
import PopUp from '../PopUp';
import { useRouter, useSearchParams } from 'next/navigation';
import {  GoogleLogin } from '@react-oauth/google';
import {jwtDecode} from 'jwt-decode';
import { MdArrowDropDown } from "react-icons/md";
import { Modal } from 'antd';
import { privacyPolicy, termsOfService } from '@/utlis/constant';
import { Switch } from "antd";


export default function SignUpForm(props) {
  const router = useRouter();
  const [loading,setLoading] = useState(false);
  const [institute,setInstitute] = useState(props.institute);
  const [department,setDeparment] = useState([])
  const [selectedDepartment,setSelectedDepartment] = useState({});
  const [selectedInstitute,setSelectedInstitute] = useState({});
  const [DropdownOpen, setDropdownOpen] = useState(false);
  const [checkInstituteSelected,setCheckInstituteSelected] = useState(false)
  const [departmentLoader,setDeparmentLoader] = useState(false);
  const [departmentDropdownOpen, setDepartmentDropdownOpen] = useState(false);
  const [toggleCheck, setToggleCheck] = useState(false);
  const [popup, setPopup] = useState({show:false,type:'',message:'',timeout:0});
  const [activeText, setActiveText] = useState(privacyPolicy);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isActive, setIsActive] = useState(false);

  const dropdownRef = useRef(null);
  const departmentdropdownRef = useRef(null);
  const search = useSearchParams();

  const validationSchema = Yup.object({
    firstName: Yup.string()
      .min(2, 'Too Short!')
      .max(50, 'Too Long!')
      .required('Required'),
    lastName: Yup.string()
      .min(2, 'Too Short!')
      .max(50, 'Too Long!')
      .required('Required'),
    email: Yup.string()
      .email('Invalid email')
      .required('Required'),
    school: Yup.string()
      .required('Required'),
    field: Yup.string()
    .required('Required'),
    password: Yup.string()
      .required('Required'),
  });

  const handleToggle = (checked) => {
    setIsActive(checked);
  };

  const getDepartments = async () =>{
    try{
      setDeparmentLoader(true);
      let department = await AuthApi.getDepartment(selectedInstitute.label);
      setDeparment(department.data)
      setDeparmentLoader(false);
    } catch (e){
      setDeparmentLoader(false);
      setDeparment([])
      setPopup({show:true,type:'error',message:error.message,timeout:3000});
    }
  }
  useEffect(()=>{
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
      if (departmentdropdownRef.current && !departmentdropdownRef.current.contains(event.target)) {
        setDepartmentDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  },[])

  useEffect(()=>{
    if(selectedInstitute?.label){
      setCheckInstituteSelected(false)
      getDepartments()
    }
  },[selectedInstitute])

  const handleSubmit = async (values) => {
    try {
      setLoading(true);
      await AuthApi.signup({
        first_name:values.firstName,
        last_name: values.lastName,
        instituteName: values.school,
        department:values.field,
        email: values.email,
        password: values.password
       })
        .then(()=>{
        setLoading(false)
          setPopup({show:true,type:'success',message:'Congratulations! you are registered.',timeout:3000});
          router.push('/');
        })
    } catch (error) {
      setLoading(false)
      setPopup({show:true,type:'error',message:error.message,timeout:3000});
    }
  };
  const handleToggleChange = (event) => {
    setToggleCheck(event.target.checked);
  };


  const handleGoogleLoginSuccess = async (res) => {

    try {
      const decoded = jwtDecode(res.credential);
      const email = decoded.email;
      const first_name=decoded.given_name;
      const last_name=decoded.family_name;
      const image_url = decoded.picture;
      
      await AuthApi.signup({ email,first_name, last_name, image_url, isGmail:true  }).then(() => {
        setPopup({
          show: true,
          type: 'success',
          message: 'Congratulations! you are registered.',
          timeout: 3000,
        });
        router.push('/');
      });
    } catch (error) {
      setPopup({
        show: true,
        type: 'error',
        message: error.message,
        timeout: 3000,
      });
    }
  };

  const handleGoogleLoginError = () => {
    setPopup({
      show: true,
      type: 'error',
      message: 'Google login failed. Please try again.',
      timeout: 3000,
    });
  };

  useEffect(() => {
    if(props.code){
      setIsActive(true)
    }

  }, [props.code])
  

  return<>
    <Formik
      initialValues={{ firstName:'',lastName:'',school:'',field:'',email: '',password:'', field:'' }}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ errors, touched,setFieldValue }) => (
        <Form>
          <div className="row  ">
            <div className="col-md-6 col-12 pl-15 mb-20">
              <label className="text-141414 text-weight-400 text-14 mb-2">First Name</label>
              <Field type="text" name="firstName"
                     style={{ height: '46px' }}
                     className="px-10 full-width bg-transparent text-14 text-394560 border-color-D9D9D9 border-radius-4"
              />
              <ErrorMessage className="error-message" name="firstName" component="div" />
            </div>
            <div className="col-md-6 col-12 pl-15 mb-20">
              <label className="text-141414 text-weight-400 text-14 mb-2">Last Name</label>
              <Field type="text" name="lastName"
                     style={{ height: '46px' }}
                     className="px-10 full-width bg-transparent text-14 text-394560 border-color-D9D9D9 border-radius-4"
              />
              <ErrorMessage className="error-message" name="lastName" component="div" />
            </div>
            <div className="col-md-6 col-12 pl-15 mb-20 " ref={dropdownRef}>
              <label className="text-141414 text-weight-400 text-14 mb-2">University</label>
                <div
                  onClick={() => setDropdownOpen(!DropdownOpen)
                  }
                  style={{
                    height: '46px',
                    width: '270px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                  className={`position-relative px-20 border-radius-4 bg-transparent text-394560 border-color-D9D9D9 full-width-responsive ${institute.length>0 ? 'cursor-pointer' : ''}`}
                >
                  <div style={{display:"flex", justifyContent:"space-between",width: "100%"}} className="text-14">
                      <div className="text-14">
                        {institute.find((option) => option === selectedInstitute)?.label||
                          'Select University'}
                      </div>
                      <div style={{display:"flex",justifyContent:"center", alignItems:"center"}} >
                        <MdArrowDropDown  size={20} />
                      </div>
                  </div>
                  {DropdownOpen && (
              <div
                style={{
                  position: 'absolute',
                  marginTop: '4px',
                  width: '100%',
                  borderRadius: '4px',
                  border: '1px solid #D9D9D9',
                  backgroundColor: '#ffffff',
                  zIndex: 10,
                  maxHeight: '200px',
                  overflow:"auto",
                  top:"46px",
                  left:"0",
                }}
                className="px-10 text-14 border-color-D9D9D9"
              >
                {institute.map((option) => (
                  <div
                    key={option.value}
                    onClick={() => {
                      setFieldValue('school', option.label);
                      setSelectedInstitute(option);
                      setDropdownOpen(false);
                    }}
                    style={{
                      cursor: 'pointer',
                    }}
                    className="px-10 py-12"
                  >
                    {option.label}
                  </div>
                ))}
              </div>
            )}
                </div>
                
              <ErrorMessage name="school" component="div" />
            </div>
            <div className="col-md-6 col-12 pl-15 mb-20" ref={departmentdropdownRef} >
              <label className="text-141414 text-weight-400 text-14 mb-2">Field of study</label>
               <div
                  onClick={() => {
                    // setDepartmentDropdownOpen(!departmentDropdownOpen)
                    if(department.length<0){
                      setDepartmentDropdownOpen(false)
                    }
                    if(!selectedInstitute?.label){
                      setCheckInstituteSelected(true)
                    } else if (selectedInstitute?.label && department.length>0) {
                    setDepartmentDropdownOpen(!departmentDropdownOpen)
                    }
                  }
                  }
                  style={{
                    height: '46px',
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                  className={`px-20 border-radius-4 bg-transparent text-394560 border-color-D9D9D9 full-width-responsive  ${department.length>0 ? 'cursor-pointer' : ''}`}
                >
                  <div style={{display:"flex", justifyContent:"space-between",width: "100%"}} className="text-14">
                     <div> {department?.find((option) => option === selectedDepartment)?.label ?  selectedDepartment?.label?.length>30 ?  selectedDepartment?.label?.slice(0,30)+ "..." : selectedDepartment?.label : 'Select Field of study' ||
                      'Select Field of study'}
                      </div>
                      <div style={{display:"flex",justifyContent:"center", alignItems:"center"}} >
                      {
                        departmentLoader ? <span className='fieldloader' ></span> : <MdArrowDropDown  size={20} />
                      }
                      </div>
                  </div>
                </div>
                {departmentDropdownOpen && (
              <div
                style={{
                  position: 'absolute',
                  marginTop: '4px',
                  width: '270px',
                  borderRadius: '4px',
                  border: '1px solid #D9D9D9',
                  backgroundColor: '#ffffff',
                  zIndex: 10,
                  maxHeight: '200px',
                  overflow:"auto",
                }}
                className="px-10 text-14 border-color-D9D9D9"
              >
                {department?.map((option) => (
                  <div
                    key={option.value}
                    onClick={() => {
                      setFieldValue('field', option.label);
                      setSelectedDepartment(option);
                      setDepartmentDropdownOpen(false);
                    }}
                    style={{
                      cursor: 'pointer',
                    }}
                    className="px-10 py-12"
                  >
                    {option.label}
                  </div>
                ))}
              </div>
            )}
            { checkInstituteSelected && <div className='text-warning text-12' style={{height:'0'}}>First, select a University.</div>}
              <ErrorMessage name="field" component="div" />
              {/* <ErrorMessage name="field" component="div" /> */}
            </div>
            <div className="col-md-6 col-12 pl-15 mb-20">
              <label className="text-141414 text-weight-400 text-14 mb-2">Email</label>
              <Field type="text" name="email"
                     style={{ height: '46px' }}
                     className="px-10 full-width bg-transparent text-14 text-394560 border-color-D9D9D9 border-radius-4"
              />
              <ErrorMessage className="error-message" name="email" component="div" />
            </div>
            <div className="col-md-6 col-12 pl-15 mb-20">
              <label className="text-141414 text-weight-400 text-14 mb-2">Password</label>
              <Field style={{ height: '46px' }} type="password" name="password"
                     className="px-10 full-width bg-transparent text-14 text-394560 border-color-D9D9D9 border-radius-4"
              >
              </Field>
              <ErrorMessage className="error-message" name="password" component="div" />
            </div>
            <div className=" col-12 separator-x mt-3 mb-3"></div>
            <div className="col-md-6 col-12 pl-15 mb-20">
              <div> <label className="text-141414 text-weight-400 text-14 mb-2">Referal Code</label>    <Switch
                    checked={isActive}
                    onChange={handleToggle}
                    className="ml-10"
                    checkedChildren="On"
                    unCheckedChildren="Off"
                /></div>
              
              <Field style={{ height: '46px' }} type="texxt" name="referred_by" value={props.code} readOnly={!isActive}
                     className="px-10 full-width bg-transparent text-14 text-394560 border-color-D9D9D9 border-radius-4"
              >
              </Field>
              <ErrorMessage className="error-message" name="referred_by" component="div" />
        
            </div>
           

            <div className="flex col-12 mb-32">
              <input className="cursor-pointer" style={{ width: '16px', height: '16px' }} type="checkbox"
                     name="toggleCheck" checked={toggleCheck} onChange={handleToggleChange} />
              <label className="ml-8 text-weight-400 text-1F1F1F text-12">I agree to&nbsp;<span
                className="text-0378A6" onClick={()=>{setActiveText(termsOfService);setIsModalOpen(true)}}>Terms of Services</span>&nbsp;and&nbsp;<span className="text-0378A6" onClick={()=>{setActiveText(privacyPolicy);setIsModalOpen(true)}}>Privacy Policy</span>.</label>
            </div>
            <div className="col-12">
              <button
                disabled={!toggleCheck || loading}
                style={{ height: '44px' }}
                className={`full-width bg-763FF9 border-none border-radius-4 text-ffffff text-weight-500 text-16 ${loading ? "cursor-not-allowed " : "cursor-pointer"} ${toggleCheck ?'opacity-100 ':'opacity-75 cursor-not-allowed'}`}
                type="submit">
              {loading ? <span className='submitloader'></span> : "Sign up" }
              </button>
            </div>
          </div>
        </Form>
      )}
    </Formik>
    <div className="separator-x mt-3 mb-3"></div>
    <div className="flex column items-center">
        <GoogleLogin
          onSuccess={handleGoogleLoginSuccess}
          onError={handleGoogleLoginError}
        />

      <p className="text-weight-400 text-14 text-262626 mt-3">Already have an account? &nbsp;
        <Link href="/login" className="mt-3 text-14 text-weight-400 text-0378A6 text-decoration-none">
         Sign In
        </Link>
      </p>
    </div>
    <PopUp props={popup}/>
    <Modal className="tour-popup" open={isModalOpen} footer={[]}  width={500} onCancel={()=>{setIsModalOpen(false)}} title={activeText.title}>
          <div className="overflowy-auto term-privicy-popup mt-24" >
            <div  style={{height: '400px', overflowY:"auto"}}  dangerouslySetInnerHTML={{__html: activeText.html}}/>
          </div>
        </Modal>
    </>
}
