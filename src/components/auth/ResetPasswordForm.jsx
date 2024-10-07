'use client';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import {AuthApi} from '../../app/(auth)/AuthApi';
import { useState } from 'react';
import PopUp from '../PopUp';
import { useParams } from 'next/navigation';

export default function ResetPasswordForm() {
const [loading,setLoading] = useState(false);
 const {slug} = useParams();
//  console.log("slug : ",slug)
  const [popup, setPopup] = useState({
    show: false,
    type: '',
    message: '',
    timeout: 0,
  });
  const validationSchema = Yup.object({
    password: Yup.string()
      .required('Required'),
    confirmPassword: Yup.string()
      .required('Required'),
  });
  const handleSubmit = async (values) => {
    // console.log("-----------INSIDE------------")
    // console.log("Values: ",values)

    try {
      setLoading(true);
      if(values.password==values.confirmPassword){
      await AuthApi.resetPassword({newPassword: values.confirmPassword, token: slug});
      setPopup({
        show: true,
        type: 'success',
        message: 'Password reset successfully.',
        timeout: 3000,
      });
      } else {
        setPopup({
          show: true,
          type: 'error',
          message: 'Passwords do not match.',
          timeout: 3000,
        });
      }
      setLoading(false)
    
    } catch (error) {
      console.log("error: ",error)
      setLoading(false)
      setPopup({
        show: true,
        type: 'error',
        message: 'Something went wrong. Please try again later.',
        timeout: 3000,
      });
    }
  };
  return<>
    <Formik
      initialValues={{ password:'',confirmPassword: '' }}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ errors, touched }) => (
        <Form>
          <div className="row">
            <div className="col-12 pl-15 mb-2">
              <label className="text-141414 text-weight-400 text-14 mb-2">Password</label>
              <Field type="password" name="password"
                     style={{ height: '46px' }}
                     className="px-10 full-width bg-transparent text-14 text-394560 border-color-D9D9D9 border-radius-4"
              />
              <ErrorMessage className="error-message" name="password" component="div" />
            </div>
            <div className="mb-2">
              <ul style={{paddingLeft:'16px',marginBottom:'0'}}>
                <li className="text-weight-400 text-434343 text-12">At least one upper case, lower case, special character and numeric character is required</li>
                <li className="text-weight-400 text-434343 text-12">Password should be from 6 to 20 character long</li>
              </ul>
            </div>
            <div className="col-12 pl-15 mb-32">
              <label className="text-141414 text-weight-400 text-14 mb-2">Confirm Password</label>
              <Field type="password" name="confirmPassword"
                     style={{ height: '46px' }}
                     className="px-10 full-width bg-transparent text-14 text-394560 border-color-D9D9D9 border-radius-4"
              />
              <ErrorMessage className="error-message" name="confirmPassword" component="div" />
            </div>
            <div className="col-12">
              <button
                disabled={loading}
                style={{ height: '44px' }}
                className={`full-width bg-763FF9 border-none border-radius-4 text-ffffff text-weight-500 text-16 ${loading ? "cursor-not-allowed " : "cursor-pointer"}`}
                type="submit">
                   {loading ? <span className='submitloader'></span> : "Reset" }
              </button>
            </div>
          </div>
          <PopUp props={popup} />
        </Form>
      )}
    </Formik>
  </>
}
