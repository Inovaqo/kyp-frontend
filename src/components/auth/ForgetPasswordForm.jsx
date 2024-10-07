'use client';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import {AuthApi} from '../../app/(auth)/AuthApi';
import { useState } from 'react';
import PopUp from '../PopUp';

export default function ForgetPasswordForm() {
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
  });
  const handleSubmit = async (values) => {
    try {
      setLoading(true);
      await AuthApi.forgetPassword({ email: values.email })
      setLoading(false)
      setPopup({
        show: true,
        type: 'success',
        message: 'Instructions delivered successfully.',
        timeout: 3000,
      });
    } catch (error) {
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
      initialValues={{ email: '' }}
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
            <div className="col-12">
              <button
                disabled={loading}
                style={{height:'44px'}}
                className={`full-width bg-763FF9 border-none border-radius-4 text-ffffff text-weight-500 text-16 ${loading ? "cursor-not-allowed " : "cursor-pointer"}`}
                type="submit">
                  {loading ? <span className='submitloader'></span> : "Send Reset Instructions" }
              </button>
            </div>
          </div>
          <PopUp props={popup} />
        </Form>
      )}
    </Formik>
  </>
}
