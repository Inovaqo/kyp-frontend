'use client'

import Image from 'next/image';
import Reviews from '../../../../components/Reviews';
import StarRating from '../../../../components/StarRating';
import RatingBar from '../../../../components/RatingBar';
import { useState, useEffect, useRef } from 'react';
import {BaseApi} from '../../BaseApi';
import { useParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import {getToken} from '../../../../services/JwtService';


export default function page(){
  let token = getToken();
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [ Loading,setLoading ] = useState(true);
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const router = useRouter();
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [course, setCourse] = useState('');
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [courseCode, setCourseCode] = useState('');
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [DropdownOpen, setDropdownOpen] = useState(false);
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [professorDetails,setProfessorDetails] = useState(null)
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [professorCourse,setProfessorCourse] = useState(null);
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [showmoreLoader,setShowMoreLoader] = useState(false);
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [options, setOptions] = useState([])
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [ courseLoading,setCourseLoading ] = useState(false);
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const {slug} = useParams();
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [saved,setSaved] = useState(false);
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const dropdownRef = useRef(null);
  const saveProfessor = async () => {
    try{
      setSaved((prev)=>!prev)
      await BaseApi.saveProfessor({professorId:Number(slug) ,flag:saved?0:1})
        .then((response)=>{
        })
    }catch(err){
      console.error(err);
      setSaved((prev)=>!prev)
    }
  }

  const getData = async (courseLoad = false) =>{
    try {
      courseLoad ? setCourseLoading(true) : setLoading(true)
      let response = await BaseApi.getProfessorDetail({ id: slug ,courseCode});
      console.log("response from api: ", response);
      if(response?.data?.message?.includes("not found")){
        router.push(`/`);
      }
      setProfessorDetails(response.data.professor)
      // let savedprofessor = await BaseApi.getSavedProfessor({ id: Number(slug)});
      setSaved(response.data.saved)
      setOptions(response.data.courses)
       getCourses(true)
       setLoading(false)
    } catch (error) {
      console.error("Error fetching professor details:", error);
      setLoading(false)

    }
  }

  console.log("Loader: ",Loading);
  const getCourses = async (courseLoad = false,page=1,limit=5,concatCheck=false,seeMore=false) =>{
    try {
      seeMore ? setShowMoreLoader(true) : courseLoad ? setCourseLoading(true) : setLoading(true)
      let professorCourseDetails = await BaseApi.getProfessorCourseDetail({ id: slug ,courseCode,page,limit});
      if(concatCheck){
        let tempProfessors = professorCourse;
        tempProfessors.page=professorCourseDetails.data.page
        tempProfessors.data = tempProfessors.data.concat(professorCourseDetails.data.data)
        setProfessorCourse(tempProfessors)
      }else{
        setProfessorCourse(professorCourseDetails.data)
      }
      seeMore ? setShowMoreLoader(false) : courseLoad ? setCourseLoading(false) : setLoading(false)
    } catch (error) {
      console.error("Error fetching professor details:", error);
      seeMore ? setShowMoreLoader(false) : courseLoad ? setCourseLoading(false) : setLoading(false)
    }
  }

  const goToReviewPage = () => {
    router.push(`/professor/rate/${slug}`);
  }
  console.log("Courses-----: ",professorCourse)

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    getData(true)
    setProfessorCourse({})
  },[courseCode])

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
     getData()
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // const options = [
  //   { value: '0', label: 'CS101' },
  //   { value: '1', label: 'MATH101' },
  // ];

  const updateRatings = (updatedReview, professorId) => {
    if (!professorDetails || professorDetails.id !== professorId) {
      console.error("Professor details not found or ID mismatch");
      return;
    }

    // Map through the Course to find the relevant rating and update it
    const updatedCourses = professorCourse.data.map(course => ({
      ...course,
      // Update the reactRatings within each course
      reactRatings: course.id === updatedReview.id
        ? { ...course.reactRatings, ...updatedReview }
        : course.reactRatings
    }));

    // Update professorDetails with the modified courses
    setProfessorCourse({
      ...professorCourse,
      data: updatedCourses
    });
  };

  const tags = ['Tough Grader','Porttitor tincidunt','Tough Grader','Porttitor tincidunt','Tough Grader','Porttitor tincidunt','Tough Grader','Porttitor tincidunt','Tough Grader','Porttitor tincidunt','Tough Grader','Porttitor tincidunt','Tough Grader',];

  return<>
  { Loading || !professorDetails
  ?
  <div style={{display:"flex",alignItems:"center",justifyContent:"center",marginTop:"30%", margin:"30%"}}><span className="loader"></span> </div>
  :
  <>
    <div className="px-120 py-30 tablet-px-90 tablet-px-50 mobile-px-20">

      <p className="text-8C8C8C text-14 text-weight-400 mb-40">Professor / <span
        className="text-1F1F1F"> {professorDetails.first_name} {professorDetails.last_name}</span></p>

      <div className="flex mb-60 professor-profile-mobile-center">
        {/* <div>
          <Image className="border-radius-100" height={114} width={114} src={professorDetails?.image_url? professorDetails?.image_url: '/student.png'} alt="professor" />
        </div> */}
        <div className="flex-1 flex column justify-center professor-name-mt-24">
          <h2 className="text-24 text-1F1F1F text-weight-600 mb-6">{professorDetails?.first_name} {professorDetails?.last_name}</h2>
          <p className="text-14 text-weight-400 text-434343">Professor in the
            <span className="text-1F1F1F text-weight-600"> {professorDetails?.department_name} </span> at <span
              className="line-break-2"><br />  </span>
            <span className="text-1F1F1F text-weight-600"> {professorDetails?.institute_name} </span></p>
        </div>
        {token && (
        <div className="flex items-center mobile-mt-28">
          <div disabled={!token} onClick={saveProfessor} className={`${token? "cursor-pointer" : ""}`}>
          { !saved ? <svg width="25" height="31" viewBox="0 0 13 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M11.3721 15.4746C11.2438 15.4746 11.1148 15.4416 11.0001 15.3756L6.12207 12.5879L1.24407 15.3756C1.01157 15.5084 0.72657 15.5076 0.49557 15.3734C0.26457 15.2391 0.12207 14.9916 0.12207 14.7246V2.72461C0.12207 1.48411 1.13157 0.474609 2.37207 0.474609H9.87207C11.1126 0.474609 12.1221 1.48411 12.1221 2.72461V14.7246C12.1221 14.9916 11.9803 15.2391 11.7486 15.3734C11.6323 15.4409 11.5026 15.4746 11.3721 15.4746ZM6.12207 10.9746C6.25032 10.9746 6.37857 11.0076 6.49407 11.0736L10.6221 13.4316V2.72461C10.6221 2.31136 10.2861 1.97461 9.87207 1.97461H2.37207C1.95882 1.97461 1.62207 2.31136 1.62207 2.72461V13.4316L5.75007 11.0729C5.86557 11.0076 5.99382 10.9746 6.12207 10.9746Z"
                fill={ '#595959'} />
            </svg> :
            <img height={31} width={25} src='/savedProfessor.png'  alt='savedProfessor'/>
            }
          </div>
          <button
            style={{ height: '48px' }}
            onClick={goToReviewPage}
            disabled={!token}
            className={`ml-12 ${token? "cursor-pointer" : ""} px-12 flex items-center justify-between  text-18 flex justify-center items-center bg-763FF9 text-ffffff border-color-763FF9 border-radius-4`}>
            Write a Review
          </button>
        </div>)}
      </div>

      <div className="row mb-60">
        <div className="col-xl-7 col-lg-12 ">
          <p className="text-1F1F1F text-weight-500 text-16">Overall Rating</p>
          <div className="separator-x mt-3 mb-4"></div>
          <div className="flex mb-40 professor-mobile-flex-col ">

            <div className="bg-FFEBCC flex column items-center justify-center star-rating-full-width"
                 style={{ width: '180px', height: '180px' }}>
              <p className="text-weight-600 text-40 text-1F1F1F">{professorDetails?.overallRating.toFixed(1)}</p>
              <StarRating rating={professorDetails?.overallRating.toFixed(1)} />
              <p className="text-weight-500 text-14 text-1F1F1F">Quality Rating</p>
            </div>

            <div className="flex-1 ml-30 mobil-ml-none mobile-mt-28">
              <RatingBar rating={5} progress={!professorDetails.star_distribution.five_star ? 0.00 : Math.round(Number(professorDetails.star_distribution.five_star))} text={'Awesome'} />
              <RatingBar rating={4} progress={!professorDetails.star_distribution.four_star ? 0.00 :Math.round(Number(professorDetails.star_distribution.four_star))} text={'Great'} />
              <RatingBar rating={3} progress={!professorDetails.star_distribution.three_star ? 0.00 :Math.round(Number(professorDetails.star_distribution.three_star))} text={'Good'} />
              <RatingBar rating={2} progress={!professorDetails.star_distribution.two_star ? 0.00 :Math.round(Number(professorDetails.star_distribution.two_star))} text={'OK'} />
              <RatingBar rating={1} progress={!professorDetails.star_distribution.one_star ? 0.00 :Math.round(Number(professorDetails.star_distribution.one_star))} text={'Awful'} />
            </div>
          </div>
          <div className="d-none d-xl-block">
            <p className="text-1F1F1F text-weight-500 text-16 ">Tags</p>
            <div className="separator-x mt-3 mb-4"></div>
            <div className="flex mb-20 flex-wrap">
               { professorDetails.top_tags ? (professorDetails?.top_tags?.map((tag, index) => (
                <div key={tag + '-' + index}
                     className=" bg-F0F0F0 text-14 text-595959 text-weight-400 pa-10 border-radius-6 mr-16 mb-16">
                  {tag}
                </div>
              ))) : (<div>
                    <p className="text-1F1F1F text-weight-400 text-16">No tags found.</p>
              </div>) }
            </div>
          </div>


        </div>
        <div className="col-xl-5 col-lg-12
        {/*d-none d-sm-block*/}
        "
        >
          <div className="row ml-60 ml-mobile-30 mobile-width-ml-none-2 tablet-margin-left-12" style={{ height: 504 }}>
            <div className="col-sm-12 col-md-6 flex column justify-around full-width-responsive">
              <div className="flex items-center">
                <div className="border-radius-8 flex items-center justify-center bg-FFF5E5" style={{ width: '60px', height: '60px' }}>
                  <Image width={32} height={32} src="/textBook.svg" alt="Love Teaching Style" />
                </div>
                <div className="flex column justify-between ml-24 professor-flex-review ml-mobile-30">
                  <p className="text-1F1F1F text-weight-400 text-24">{Math.floor(professorDetails.criteria_averages.love_teaching_style)}%</p>
                  <p className="text-434343 text-weight-400 text-14 ml-mobile-30">Love Teaching Style</p>
                </div>
              </div>
              <div className="flex items-center">
                <div className="border-radius-8 flex items-center justify-center bg-E6F1F6" style={{ width: '60px', height: '60px' }}>
                  <Image width={32} height={32} src="/clarity.svg" alt="Clarity" />
                </div>
                <div className="flex column justify-between ml-24 professor-flex-review ml-mobile-30">
                  <p className="text-1F1F1F text-weight-400 text-24">{Math.floor(professorDetails.criteria_averages.clarity)}%</p>
                  <p className="text-434343 text-weight-400 text-14 ml-mobile-30">Clarity</p>
                </div>
              </div>
            </div>

            <div className="col-sm-12 col-md-6 flex column justify-around full-width-responsive">
              <div className="flex items-center">
                <div className="border-radius-8 flex items-center justify-center bg-F0F0F0" style={{ width: '60px', height: '60px' }}>
                  <Image width={32} height={32} src="/knowledgeable.svg" alt="Knowledgeable" />
                </div>
                <div className="flex column justify-between ml-24 professor-flex-review ml-mobile-30">
                  <p className="text-1F1F1F text-weight-400 text-24">{Math.floor(professorDetails.criteria_averages.knowledgeable)}%</p>
                  <p className="text-434343 text-weight-400 text-14 ml-mobile-30">Knowledgeable</p>
                </div>
              </div>
              <div className="flex items-center">
                <div className="border-radius-8 flex items-center justify-center bg-FEE9E8" style={{ width: '60px', height: '60px' }}>
                  <Image width={32} height={32} src="/collaboration.svg" alt="Collaboration" />
                </div>
                <div className="flex column justify-between ml-24 professor-flex-review ml-mobile-30">
                  <p className="text-1F1F1F text-weight-400 text-24">{Math.floor(professorDetails.criteria_averages.collaboration)}%</p>
                  <p className="text-434343 text-weight-400 text-14 ml-mobile-30">Collaboration</p>
                </div>
              </div>
            </div>
            {/* <div className="separator-x" style={{ margin: '20px 0' }}></div> */}
            <div className="col-sm-12 col-md-6 flex column justify-around full-width-responsive">
              <div className="flex items-center">
                <div className="border-radius-8 flex items-center justify-center bg-E4D9FE" style={{ width: '60px', height: '60px' }}>
                  <Image width={32} height={32} src="/courseDifficulty.svg" alt="Course Difficulty" />

                </div>
                <div className="flex column justify-between ml-24 professor-flex-review ml-mobile-30">
                  <p className="text-1F1F1F text-weight-400 text-24">{Math.floor(professorDetails.criteria_averages.course_difficulty)}%</p>
                  <p className="text-434343 text-weight-400 text-14 ml-mobile-30">Course Difficulty</p>
                </div>
              </div>
            </div>
            <div className="col-sm-12 col-md-6 flex column justify-around full-width-responsive">
              <div className="flex items-center">
                <div className="border-radius-8 flex items-center justify-center bg-F0F0F0" style={{ width: '60px', height: '60px' }}>
                <Image width={32} height={32} src="/knowledgeable.svg" alt="Exam Difficulty" />
                </div>
                <div className="flex column justify-between ml-24 professor-flex-review ml-mobile-30">
                  <p className="text-1F1F1F text-weight-400 text-24">{Math.floor(professorDetails.criteria_averages.exam_difficulty)}%</p>
                  <p className="text-434343 text-weight-400 text-14 ml-mobile-30">Exam Difficulty</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="d-block d-xl-none">
        <p className="text-1F1F1F text-weight-500 text-16 ">Tags</p>
        <div className="separator-x mt-3 mb-4"></div>
        <div className="flex mb-20 flex-wrap">
        { professorDetails.top_tags ?  (professorDetails?.top_tags?.map((tag, index) => (
            <div key={tag + '-' + index}
                 className=" bg-F0F0F0 text-14 text-595959 text-weight-400 pa-10 border-radius-6 mr-16 mb-16">
              {tag}
            </div>
          ))) : (<div>
             <p className="text-1F1F1F text-weight-400 text-16">No tags found.</p>
          </div>)}
        </div>
      </div>

      <div>
        <p className="text-1D2026 text-weight-600 text-24 mb-20 ">Reviews ({professorCourse?.total}) </p>
        <div className="relative sort-dropdown my-28" ref={dropdownRef}>
                <div
                  onClick={() => setDropdownOpen(!DropdownOpen)}
                  style={{

                    height: '72px',
                    maxWidth: '300px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                  className="px-28 border-radius-12 border-color-D9D9D9"
                >
                  <p className="text-18">
                    {options?.find((option) => option.value === course)?.label ||
                      'All'}
                  </p>
                  <Image
                    style={{ marginLeft: '24px' }}
                    height={10}
                    width={10}
                    src="/arrowicon.svg"
                    alt="searchIcon"
                  />
                </div>
                {DropdownOpen && (
                  <div
                    style={{
                      position: 'absolute',
                      marginTop:"4px",
                      width: '300px',
                      borderRadius: '12px',
                      border: '1px solid #D9D9D9',
                      backgroundColor: '#ffffff',
                      zIndex: 10,
                      maxHeight: '200px',
                    }}
                    className="px-10 border-color-D9D9D9"
                  >
                    {options?.map((option) => (
                      <div
                        key={option.value}
                        onClick={() => {
                          setCourse(option.value);
                          setCourseCode(option.label);
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
       {
        courseLoading ?
        <div style={{display:"flex",alignItems:"center",justifyContent:"center",marginTop:"15%", marginBottom:"30%"}}><span className="loader"></span> </div>
        :
        professorCourse?.data?.length===0 ?
        (<div className="full-width full-height flex items-center justify-center column">
        <Image className="mb-20" width={112} height={112} src="/norecordfound.svg" alt="norecordfound" />
        <p className="text-weight-600 text-18 text-1F1F1F mb-8">No records found</p>
        <p className="text-weight-400 text-14 text-595959">The record you tried to filter was not found.</p>
      </div>)
        :(<>
        <Reviews reviews={professorCourse?.data} professorId={professorDetails.id} updateRatings={updateRatings} />
        {Number(professorCourse?.page) < professorCourse?.lastPage && <div className="flex items-center justify-center mt-4">
        <div className="text-weight-600 text-763FF9 text-24 cursor-pointer" onClick={()=>{getCourses(false,Number(professorCourse?.page)+1,5,true,true)}}>
              {/* { showmoreLoader ?<div className="seeMoreLoader"></div> :  <div>See more</div>} </div> */}
             <div className='see-div'>{ showmoreLoader ?<div className="seeMoreLoader"></div> :  <div>See more</div>} </div> 
        </div> 
       </div> }
        </>)
      }
      </div>
    </div>
    </>}
  </>
}
