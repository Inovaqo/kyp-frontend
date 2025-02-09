'use client'

import { privacyPolicy, termsOfService } from '@/utlis/constant';
import { Modal, Form, Input, Button, message } from 'antd';
import Image from 'next/image';
import { useState } from 'react';
import PopUp from './PopUp';
import { AuthApiService } from '@/app/(auth)/AuthApiService';



export default function Footer() {
  const [form] = Form.useForm()
  const [activeText, setActiveText] = useState(privacyPolicy);
  const [popup, setPopup] = useState({
    show: false,
    type: '',
    message: '',
    timeout: 0,
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContact, setModalContact] = useState(false);

 
  const handleSendEmail = async (values) => {
    console.log('Form values:', values); 

    try {
      const response = await AuthApiService.sendemail(values)
      if(response.status === 200) {
        setPopup({
          show: true,
          type: 'success',
          message: 'Successfully send your request.',
          timeout: 5000,
        });
    } 
  }catch (error) {
      setPopup({
        show: true,
        type: 'error',
        message: 'Something went wrong. Please try later.',
        timeout: 5000,
      });
    }

    form.resetFields(); 
    setModalContact(false); 
  };

  // Function to handle cancel
  const handleCancel = () => {
    setModalContact(false);
    form.resetFields();
  };

  return <>
    <footer >
      <div className="px-80 py-40 mobile-px-20">
        <div className="flex items-center column">
          <Image className="mb-46"  height={54} width={108} src="/KYP.png" alt="KYPIcon"/>
          <div className="flex mb-40">
            <a target="_blank" href="https://www.instagram.com/knowyourprofessor">
              <Image className="mr-24" height={46} width={46} src="/instagramIcon.png" alt="instagramIcon"/>
            </a>
            <a target="_blank" href="https://www.linkedin.com/company/knowyourprofessors">
              <Image className="mr-24" height={46} width={46} src="/linkedinIcon.png" alt="linkedinIcon"/>
            </a>
            <a target="_blank" className="flex items-center" href="https://www.tiktok.com/@kypcontact">
              <Image className="mr-24" height={36} width={36} src="/tiktok.png" alt="twitterIcon"/>
            </a>
          </div>
        </div>
        <div className="full-width">
          <div className="separator-x mb-32"></div>
          <div className="flex justify-between professor-profile-mobile-center">
            <div>
              <p className="text-16 text-weight-400 text-262626">© 2024 Know Your Professor, LLC. All Rights
                Reserved</p>
            </div>
            <div className="flex mobile-justify-center mobile-py-20">
              <p className="mr-24 text-16 text-weight-400 text-262626 cursor-pointer" onClick={() => {
                setActiveText(termsOfService);
                setIsModalOpen(true)
              }}>Terms of Service</p>
              <p className="text-16 text-weight-400 text-262626 cursor-pointer mr-24" onClick={()=>{setActiveText(privacyPolicy);setIsModalOpen(true)}}>Privacy Policy</p>
              <p className="text-16 text-weight-400 text-262626 cursor-pointer" onClick={()=>{setModalContact(true)}} >Contact us</p>
              
            </div>
          </div>
        </div>
      </div>
    </footer>
    <Modal className="tour-popup" open={isModalOpen} footer={[]}  width={500} onCancel={()=>{setIsModalOpen(false)}} title={activeText.title}>
          <div className="overflowy-auto term-privicy-popup mt-24" >
            <div  style={{height: '400px', overflowY:"auto"}}  dangerouslySetInnerHTML={{__html: activeText.html}}/>
          </div>
        </Modal>

       <Modal open={modalContact} footer={[]}  width={500} onCancel={handleCancel}>
        <h3>Contact us</h3>
       <Form
          form={form}
          layout="vertical"
          onFinish={handleSendEmail}
        >
          <Form.Item
            label="Name"
            name="name"
            rules={[
              { required: true, message: 'Please enter your name!' },
            ]}
          >
            <Input className="pxy-10-15 " placeholder="Enter your name" />
          </Form.Item>

          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: 'Please enter your email!' },
              { type: 'email', message: 'Please enter a valid email!' },
            ]}
          >
            <Input className="pxy-10-15 " placeholder="Enter your email" />
          </Form.Item>
          <Form.Item
            label="Phone"
            name="phone"
            rules={[
              { required: true, message: 'Please enter your phone number!' },
              { pattern: /^((\+92)|(92)|(0))3[0-9]{9}$/,
                message: 'Please enter a valid Pakistani mobile number!',}
            ]}
          >
            <Input className="pxy-10-15 " placeholder="Enter your phone number" />
          </Form.Item>

          <Form.Item
            label="Message"
            name="message"
            rules={[{ required: true, message: 'Please enter your message!' }]}
          >
            <Input.TextArea
            className="pxy-10-15 "
              placeholder="Enter your message"
              rows={4}
            />
          </Form.Item>

          {/* Submit Button */}
          <Form.Item>
            <Button style={{padding:"20px",backgroundColor:"#5F32CA" }}  type="primary" htmlType="submit" block>
              Send Message
            </Button>
          </Form.Item>
        </Form>
      </Modal> 
      <PopUp props={popup} />
  </>
}
