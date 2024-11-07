'use client';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import Link from 'next/link';
import {AuthApi} from '../../app/(auth)/AuthApi';
import { useRouter } from 'next/navigation';
import { GoogleLogin } from '@react-oauth/google';
import {jwtDecode} from 'jwt-decode';
import { useState } from 'react';
import PopUp from '../../components/PopUp';



export default function LoginForm() {
  const router = useRouter();
  const [loading,setLoading] = useState(false);
  const [popup, setPopup] = useState({
    show: false,
    type: '',
    message: '',
    timeout: 0,
  });
  const validationSchema = Yup.object({
    email: Yup.string()
      .email('Invalid email')
      .required('Required'),
    password: Yup.string()
      .required('Required'),
  });
  const handleSubmit = async (values) => {
    setLoading(true)

    try {
      await AuthApi.login({ email: values.email,password: values.password }).then(()=>{
        router.push('/')
      })
    } catch (error) {
      if(error?.response?.data?.message?.includes("Invalid")){
        setPopup({
          show: true,
          type: 'error',
          message: error?.response?.data?.message,
          timeout: 3000,
        });
      } else {
        setPopup({
          show: true,
          type: 'error',
          message: 'Something went wrong. Please try again later.',
          timeout: 3000,
        });
      }
    }finally{
      setLoading(false)
    }
  };

  const handleGoogleLoginSuccess = async (res) => {

    try {
      const decoded = jwtDecode(res.credential);
      const email = decoded.email;


      await AuthApi.login({ email, isGmail:true  }).then(() => {
        router.push('/');
      });
    } catch (error) {
      alert('Something went wrong. Please try again later.'+error);
    }
  };

  const handleGoogleLoginError = (error) => {
    alert('Something went wrong. Please try again later.'+error);
  };
  return<>
    <Formik
      initialValues={{ email: '',password:'' }}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ errors, touched }) => (
        <Form>
          <div className="row">
            <div className="col-12 pl-15 mb-32">
              <label className="text-141414 text-weight-400 text-14 mb-2">Email</label>
              <Field  type="text" name="email"
                      style={{height: '46px'}}
                      className="px-10 full-width bg-transparent text-14 text-394560 border-color-D9D9D9 border-radius-4"
              />
              <ErrorMessage className="error-message" name="email" component="div"/>
            </div>
            <div className="col-12 pl-15 mb-32">
              <label className="text-141414 text-weight-400 text-14 mb-2">Password</label>
              <Field style={{ height: '46px' }} type="password" name="password"
                     className="px-10 full-width bg-transparent text-14 text-394560 border-color-D9D9D9 border-radius-4"
              >
              </Field>
              <ErrorMessage className="error-message" name="password" component="div" />
            </div>
            <div className="col-12 pl-15 mb-4 flex justify-end">
              <Link href="/forget-password" className="text-14 text-weight-400 text-0378A6 text-decoration-none">Forgot password?</Link>
            </div>
            <div className="col-12">
              <button
              disabled={loading}
                style={{height:'44px'}}
                className={`full-width bg-763FF9 border-none border-radius-4 text-ffffff text-weight-500 text-16 ${loading ? "cursor-not-allowed " : "cursor-pointer"}`}
                type="submit">
                  {loading ? <span className='submitloader'></span> : "Login" }
              </button>
            </div>
          </div>
        </Form>
      )}
    </Formik>
    <div className="separator-x mt-3 mb-3"></div>
    <div className="d-flex flex-column items-center ">
    <GoogleLogin
          onSuccess={handleGoogleLoginSuccess}
          onError={handleGoogleLoginError}
          ux_mode="popup"
        />
      <div className='d-flex flex-sm-row flex-column'>
      <p className="  text-weight-400 text-14 text-262626 mr-6 mt-3 ">Don&#39;t have an account? </p>
        <Link href="/sign-up" className="text-14  mt-3 text-weight-400 text-0378A6 text-decoration-none text-center mobile-margin-top">
          Create Account
        </Link>
      </div>


    </div>
    <PopUp props={popup} />
  </>
}
