"use client";
import Image from "next/image";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useEffect, useRef, useState } from "react";
import { BaseApi } from "../../app/(base)/BaseApi";
import PopUp from "../PopUp";
import { getToken, setUserInfo } from "../../services/JwtService";
import { useRouter } from "next/navigation";
import { AuthApi } from "../../app/(auth)/AuthApi";
import { MdArrowDropDown } from "react-icons/md";

export default function Profile({ userInfo, setUserProfileInfo }) {
  let token = getToken();
  const router = useRouter;

  const [popup, setPopup] = useState({
    show: false,
    type: "",
    message: "",
    timeout: 0,
  });
  const validationUserInfo = Yup.object({
    firstName: Yup.string().required("Required"),
    lastName: Yup.string().required("Required"),
    email: Yup.string().email("Invalid email").required("Required"),
    university: Yup.string().required("Required"),
    field: Yup.string().required("Required"),
  });
  const validationPasswords = Yup.object({
    currentPassword: Yup.string().required("Required"),
    newPassword: Yup.string().required("Required"),
    confirmPassword: Yup.string().required("Required"),
  });
  const [preview, setPreview] = useState(userInfo.image_url);

  const [loading, setLoading] = useState(false);
  const [institute, setInstitute] = useState([]);
  const [selectedInstitute, setSelectedInstitute] = useState({});
  const [DropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const [department, setDeparment] = useState([]);
  const [checkInstituteSelected, setCheckInstituteSelected] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState({});
  const [departmentLoader, setDeparmentLoader] = useState(false);
  const [departmentDropdownOpen, setDepartmentDropdownOpen] = useState(false);
  const departmentdropdownRef = useRef(null);

  const [image, setImage] = useState(
    userInfo.image_url ? userInfo.image_url : "/student.png"
  );

  const [saveprofileLoader, setSaveProfileLoader] = useState(false);
  const [savePasswordLoader, setSavePasswordLoader] = useState(false);
  const [imageLoader, setImageLoader] = useState(false);

  const [error, setError] = useState("");
  const fileInputRef = useRef(null);

  const getDepartments = async (option) => {
    try {
      setDeparmentLoader(true);
      let department = await AuthApi.getDepartment(option.label);
      let selecteddepartment ;
      if (department.data) {
          selecteddepartment = department.data.filter(
          (depart) => depart.label === userInfo.department
        );
        if (selecteddepartment.length === 1) {
          setSelectedDepartment(selecteddepartment[0]);
        } else {
          setSelectedDepartment({})
        }
        setDeparment(department.data);
      }
      setDeparmentLoader(false);
      return selecteddepartment
    } catch (e) {
      setDeparmentLoader(false);
      setDeparment([]);
      setPopup({
        show: true,
        type: "error",
        message: error.message,
        timeout: 3000,
      });
    }
  };

  const handleSubmit = async (values) => {
    try {
      setSaveProfileLoader(true);
      await BaseApi.updateProfile({
        first_name: values.firstName,
        last_name: values.lastName,
        email: values.email,
        institute_name: values.university,
        image_url: image,
        department: values.field,
      }).then(() => {
        setUserProfileInfo({
          first_name: values.firstName,
          last_name: values.lastName,
          email: values.email,
          institute: { name: values.university },
          image_url: image,
          department: values.field,
        });
        setUserInfo(
          JSON.stringify({
            first_name: values.firstName,
            last_name: values.lastName,
            email: values.email,
            institute: { name: values.university },
            image_url: image,
            department: values.field,
          })
        );
        setSaveProfileLoader(false);
        setPopup({
          show: true,
          type: "success",
          message: "Saved Successfully",
          timeout: 3000,
        });
      });
    } catch (e) {
      setSaveProfileLoader(false);
      if (e?.message?.includes("Network")) {
        setPopup({
          show: true,
          type: "error",
          message: e.message,
          timeout: 3000,
        });
      } else {
        setPopup({
          show: true,
          type: "error",
          message: e.response.data.message,
          timeout: 3000,
        });
      }
    }
  };
  const handleChangePassword = async (values) => {
    if (values.newPassword !== values.confirmPassword) {
      setPopup({
        show: true,
        type: "warning",
        message: "New Password and Confirm Password must be same",
        timeout: 3000,
      });
    } else {
      try {
        setSavePasswordLoader(true);
        await BaseApi.updatePassword({
          oldPassword: values.currentPassword,
          newPassword: values.newPassword,
          confirmPassword: values.confirmPassword,
          id: userInfo.id,
        }).then(() => {
          setSavePasswordLoader(false);
          setPopup({
            show: true,
            type: "success",
            message: "Password Updated Successfully",
            timeout: 3000,
          });
        });
      } catch (e) {
        setSavePasswordLoader(false);
        if (e?.message?.includes("Network")) {
          setPopup({
            show: true,
            type: "error",
            message: e.message,
            timeout: 3000,
          });
        } else {
          setPopup({
            show: true,
            type: "error",
            message: e.response.data.message,
            timeout: 3000,
          });
        }
      }
    }
  };

  const getAllInstitute = async () => {
    try {
      setLoading(true);
      let institutes = await AuthApi.getInstitute();
      let instituteOption = institutes?.data?.institute?.map(
        (university, index) => {
          return {
            value: index,
            label: university.name,
          };
        }
      );
      if (instituteOption) {
        let selectedinstitute = instituteOption.filter(
          (inst) => inst.label === userInfo?.institute?.name
        );
        if (selectedinstitute.length === 1) {
          setSelectedInstitute(selectedinstitute[0]);
          setCheckInstituteSelected(false);
          getDepartments(selectedinstitute[0]);
        }
        setInstitute(instituteOption);
      }
      setLoading(false);
    } catch (e) {
      setLoading(false);
      setPopup({
        show: true,
        type: "error",
        message: error.message,
        timeout: 3000,
      });
    }
  };

  useEffect(() => {
    if (!token) {
      router.push("/");
    }
     getAllInstitute();

    const handleClickOutside = (event) => {
      if (
        departmentdropdownRef.current &&
        !departmentdropdownRef.current.contains(event.target)
      ) {
        setDepartmentDropdownOpen(false);
      }
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <>
      <div className="mt-30">
        <div className=" mb-60 professor-profile-mobile-center">
          <div className="row">
            <div className="col-md-8 col-12">
              <div className="mobile-mt-28 flex-1">
                <p className="text-weight-600 text-24 text-1F1F1F mb-32">
                  Account settings
                </p>
                <Formik
                  initialValues={{
                    firstName: userInfo?.first_name,
                    lastName: userInfo?.last_name,
                    email: userInfo?.email,
                    university: userInfo?.institute?.name,
                    field: userInfo?.department,
                  }}
                  validationSchema={validationUserInfo}
                  onSubmit={handleSubmit}
                >
                  {({ errors, touched, setFieldValue }) => (
                    <Form className="flex column justify-between ">
                      <div className="row full-width ">
                        <div className="mb-20 col-12 mobile-padding-right-0 ">
                          <label className="text-141414 text-weight-400 text-14 mb-2">
                            Full Name
                          </label>
                          <div className="row ">
                            <div className="col-md-12 col-lg-6  mobile-padding-right-0  ">
                              <Field
                                type="text"
                                name="firstName"
                                style={{ height: "46px" }}
                                className="px-10 full-width bg-transparent text-14 text-394560 border-color-D9D9D9 border-radius-8 first-name-mb-12"
                                placeholder="Enter First Name"
                              />
                              <ErrorMessage
                                className="error-message"
                                name="firstName"
                                component="div"
                              />
                            </div>
                            <div className="col-md-12 col-lg-6 mt-md-2 mt-lg-0 mobile-padding-right-0 ">
                              <Field
                                type="text"
                                name="lastName"
                                style={{ height: "46px" }}
                                className="px-10 full-width bg-transparent text-14 text-394560 border-color-D9D9D9 border-radius-8"
                                placeholder="Enter Last Name"
                              />
                              <ErrorMessage
                                className="error-message"
                                name="lastName"
                                component="div"
                              />
                            </div>
                          </div>
                        </div>
                        <div className="mb-20 col-12 mobile-padding-right-0 ">
                          <div className="row ">
                            <div
                              className="col-md-12 col-lg-6 position-relative  mobile-padding-right-0  "
                              ref={dropdownRef}
                            >
                              <label className="text-141414 text-weight-400 text-14 mb-2">
                                University
                              </label>
                              <div
                                onClick={() => setDropdownOpen(!DropdownOpen)}
                                style={{
                                  height: "46px",
                                  width: "100%",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "space-between",
                                }}
                                className={`px-10 border-radius-8 bg-transparent text-394560 border-color-D9D9D9 full-width-responsive ${
                                  institute.length > 0 ? "cursor-pointer" : ""
                                }`}
                              >
                                <div
                                  style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    width: "100%",
                                  }}
                                  className="text-14"
                                >
                                  <div className="text-14">
                                    {institute.find(
                                      (option) => option === selectedInstitute
                                    )?.label || "Select University"}
                                  </div>
                                  <div
                                    style={{
                                      display: "flex",
                                      justifyContent: "center",
                                      alignItems: "center",
                                    }}
                                  >
                                    {loading ? (
                                      <span className="fieldloader"></span>
                                    ) : (
                                      <MdArrowDropDown size={20} />
                                    )}
                                  </div>
                                </div>
                              </div>
                              <div className="position-relative">
                              {DropdownOpen && (
                                <div
                                  style={{
                                    position: "absolute",
                                    marginTop: "4px",
                                    width: "100%",
                                    borderRadius: "12px",
                                    border: "1px solid #D9D9D9",
                                    backgroundColor: "#ffffff",
                                    zIndex: 10,
                                    maxHeight: "200px",
                                    overflow: "auto",
                                  }}
                                  className="px-10 text-14 border-color-D9D9D9"
                                >
                                  {institute.map((option) => (
                                    <div
                                      key={option.value}
                                      onClick={async () => {
                                        setFieldValue(
                                          "university",
                                          option.label
                                        );
                                        setSelectedInstitute(option);
                                          setCheckInstituteSelected(false);
                                         const selected_department = await getDepartments(option);
                                        if(selected_department.length>0){
                                          setFieldValue('field',selected_department[0].label)
                                        } else {
                                          setFieldValue('field',"")
                                        }
                                        setDropdownOpen(false);
                                      }}
                                      style={{
                                        cursor: "pointer",
                                      }}
                                      className="px-10 py-12"
                                    >
                                      {option.label}
                                    </div>
                                  ))}
                                </div>
                              )}
                              </div>
                              <ErrorMessage
                                className="error-message"
                                name="university"
                                component="div"
                              />
                            </div>


                            <div
                              className="col-md-12 col-lg-6 mt-md-2 mt-lg-0 mobile-padding-right-0 mobile-mt-20"
                              ref={departmentdropdownRef}
                            >
                              <label className="text-141414 text-weight-400 text-14 mb-2">
                                Field of study
                              </label>
                              <div
                                onClick={() => {
                                  if (department.length < 0) {
                                    setDepartmentDropdownOpen(false);
                                  }
                                  if (!selectedInstitute?.label) {
                                    setCheckInstituteSelected(true);
                                  } else if (
                                    selectedInstitute?.label &&
                                    department.length > 0
                                  ) {
                                    setDepartmentDropdownOpen(
                                      !departmentDropdownOpen
                                    );
                                  }
                                }}
                                style={{
                                  height: "46px",
                                  width: "100%",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "space-between",
                                }}
                                className={`px-10 border-radius-8 bg-transparent text-394560 border-color-D9D9D9 full-width-responsive  ${
                                  department.length > 0 ? "cursor-pointer" : ""
                                }`}
                              >
                                <div
                                  style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    width: "100%",
                                  }}
                                  className="text-14"
                                >
                                  <div>
                                    {department?.find(
                                      (option) => option.label === selectedDepartment.label
                                    )?.label || "Select Field of study"}
                                  </div>
                                  <div
                                    style={{
                                      display: "flex",
                                      justifyContent: "center",
                                      alignItems: "center",
                                    }}
                                  >
                                    {departmentLoader ? (
                                      <span className="fieldloader"></span>
                                    ) : (
                                      <MdArrowDropDown size={20} />
                                    )}
                                  </div>
                                </div>
                              </div>
                              <div className="position-relative">
                              {departmentDropdownOpen && (
                                <div
                                  style={{
                                    position: "absolute",
                                    marginTop: "4px",
                                    width: "100%",
                                    borderRadius: "12px",
                                    border: "1px solid #D9D9D9",
                                    backgroundColor: "#ffffff",
                                    zIndex: 10,
                                    maxHeight: "200px",
                                    overflow: "auto",
                                  }}
                                  className="px-10 text-14 border-color-D9D9D9"
                                >
                                  {department?.map((option) => (
                                    <div
                                      key={option.value}
                                      onClick={() => {
                                        setFieldValue("field", option.label);
                                        setSelectedDepartment(option);
                                        setDepartmentDropdownOpen(false);
                                      }}
                                      style={{
                                        cursor: "pointer",
                                      }}
                                      className="px-10 py-12"
                                    >
                                      {option.label}
                                    </div>
                                  ))}
                                </div>
                              )}
                              </div>
                              {checkInstituteSelected && (
                                <div
                                  className="text-warning text-12"
                                  style={{ height: "0" }}
                                >
                                  First, select a University.
                                </div>
                              )}
                              <ErrorMessage className="error-message" name="field" component="div" />
                            </div>
                          </div>
                        </div>

                        <div className=" col-12 mobile-padding-right-0 ">
                          <div className="row ">
                            <div className="col-12 mb-32 mobile-padding-right-0 ">
                              <label className="text-141414 text-weight-400 text-14 mb-2">
                                Email
                              </label>
                              <Field
                                style={{ height: "46px" }}
                                type="text"
                                name="email"
                                className="px-10 full-width bg-transparent text-14 text-394560 border-color-D9D9D9 border-radius-8"
                                placeholder="Enter Email"
                              ></Field>
                              <ErrorMessage
                                className="error-message"
                                name="email"
                                component="div"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="">
                        {
                          saveprofileLoader ? (
                            <button
                              style={{
                                height: "44px",
                                width: "180px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                backgroundColor: "#763FF9",
                                color: "#ffffff",
                                borderRadius: "4px",
                                fontWeight: 500,
                                fontSize: "16px",
                                border: "none",
                                cursor: "not-allowed",
                              }}
                              disabled={true}
                            >
                              <span className="submitloader"></span>
                              {/* <span className="ms-2">Saving Changes</span> */}
                            </button>
                          ) : (
                            <button
                              style={{ height: "44px", width: "180px" }}
                              className="mt-10 px-20 bg-763FF9 border-none border-radius-4 text-ffffff text-weight-500 text-16 full-width-responsive"
                              type="submit"
                            >
                              Save changes
                            </button>
                          )
                          // <button
                          //   style={{ height: '44px', width: '180px' }}
                          //   className="px-20 bg-763FF9 border-none border-radius-4 text-ffffff text-weight-500 text-16 full-width-responsive"
                          //   type="submit">Save changes
                          // </button>
                        }
                      </div>
                    </Form>
                  )}
                </Formik>
              </div>
            </div>

          
              <div className="col-md-4 col-12 mobile-mt-60">
                <p className="text-weight-600 text-24 text-1F1F1F mb-32">
                  Change Password
                </p>

                <Formik
                  initialValues={{
                    currentPassword: "",
                    newPassword: "",
                    confirmPassword: "",
                  }}
                  validationSchema={validationPasswords}
                  onSubmit={handleChangePassword}
                >
                  {({ errors, touched }) => (
                    <Form
                      className=" flex column justify-between full-width-responsive "
                    >
                      <div>
                        <div className="full-width mb-20">
                          <label className="text-141414 text-weight-400 text-14 mb-2">
                            Current Password
                          </label>
                          <Field
                            type="password"
                            name="currentPassword"
                            style={{ height: "46px" }}
                            className="px-10 full-width bg-transparent text-14 text-394560 border-color-D9D9D9 border-radius-8"
                          />
                          <ErrorMessage
                            className="error-message"
                            name="currentPassword"
                            component="div"
                          />
                        </div>
                        <div className="full-width mb-20">
                          <label className="text-141414 text-weight-400 text-14 mb-2">
                            New Password
                          </label>
                          <Field
                            style={{ height: "46px" }}
                            type="password"
                            name="newPassword"
                            className="px-10 full-width bg-transparent text-14 text-394560 border-color-D9D9D9 border-radius-8"
                          ></Field>
                          <ErrorMessage
                            className="error-message"
                            name="newPassword"
                            component="div"
                          />
                        </div>
                        <div className="full-width mb-32">
                          <label className="text-141414 text-weight-400 text-14 mb-2">
                            Confirm Password
                          </label>
                          <Field
                            style={{ height: "46px" }}
                            type="password"
                            name="confirmPassword"
                            className="px-10 full-width bg-transparent text-14 text-394560 border-color-D9D9D9 border-radius-8"
                          ></Field>
                          <ErrorMessage
                            className="error-message"
                            name="confirmPassword"
                            component="div"
                          />
                        </div>
                      </div>
                      <div className="">
                        {savePasswordLoader ? (
                          <button
                            style={{
                              height: "44px",
                              width: "180px",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              backgroundColor: "#763FF9",
                              color: "#ffffff",
                              borderRadius: "4px",
                              fontWeight: 500,
                              fontSize: "16px",
                              border: "none",
                              cursor: "not-allowed",
                            }}
                            disabled={true}
                          >
                            <span className="submitloader"></span>
                            {/* <span className="ms-2">Saving Changes</span> */}
                          </button>
                        ) : (
                          <button
                            style={{ height: "44px", width: "180px" }}
                            className="mt-10 px-20 bg-763FF9 border-none border-radius-4 text-ffffff text-weight-500 text-16 full-width-responsive"
                            type="submit"
                          >
                            Change Password
                          </button>
                        )}
                      </div>
                    </Form>
                  )}
                </Formik>
              </div>
          
          </div>
        </div>
        <div className="separator-x mb-60"></div>
        {/* <p className="text-weight-600 text-24 text-1F1F1F mb-32">Change Password</p> */}
        {/* <Formik
        initialValues={{ currentPassword: '', newPassword: '',confirmPassword:'' }}
        validationSchema={validationPasswords}
        onSubmit={handleChangePassword}
      >
        {({ errors, touched }) => (
          <Form className=" flex column justify-between full-width-responsive " style={{width:'600px'}}>
            <div>
              <div className="full-width mb-20">
                <label className="text-141414 text-weight-400 text-14 mb-2">Current Password</label>
                <Field type="password" name="currentPassword"
                       style={{ height: '46px' }}
                       className="px-10 full-width bg-transparent text-14 text-394560 border-color-D9D9D9 border-radius-8"
                />
                <ErrorMessage name="currentPassword" component="div" />
              </div>
              <div className="full-width mb-20">
                <label className="text-141414 text-weight-400 text-14 mb-2">New Password</label>
                <Field style={{ height: '46px' }} type="password" name="newPassword"
                       className="px-10 full-width bg-transparent text-14 text-394560 border-color-D9D9D9 border-radius-8"
                >
                </Field>
                <ErrorMessage name="newPassword" component="div" />
              </div>
              <div className="full-width mb-20">
                <label className="text-141414 text-weight-400 text-14 mb-2">Confirm Password</label>
                <Field style={{ height: '46px' }} type="password" name="confirmPassword"
                       className="px-10 full-width bg-transparent text-14 text-394560 border-color-D9D9D9 border-radius-8"
                >
                </Field>
                <ErrorMessage name="confirmPassword" component="div" />
              </div>
            </div>
            <div className="">
              {
                savePasswordLoader
                  ?
                    <button
                      style={{
                        height: '44px',
                        width: '180px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: '#763FF9',
                        color: '#ffffff',
                        borderRadius: '4px',
                        fontWeight: 500,
                        fontSize: '16px',
                        border: 'none',
                        cursor: "not-allowed",
                      }}
                      disabled={true}
                    >
                      <span className="submitloader"></span>
                      {/* <span className="ms-2">Saving Changes</span> *}
                    </button>
                  :
              <button
                style={{ height: '44px', width: '180px' }}
                className="px-20 bg-763FF9 border-none border-radius-4 text-ffffff text-weight-500 text-16 full-width-responsive"
                type="submit">Change Password
              </button>
            }
            </div>
          </Form>
        )}
      </Formik> */}
      </div>
      <PopUp props={popup} />
    </>
  );
}
