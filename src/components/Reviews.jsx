'use client';
import Image from 'next/image';
import {BaseApi} from '../app/(base)/BaseApi';
import {getToken} from '../services/JwtService';
import { Popover } from "antd";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import PopUp from '../components/PopUp'

export default function Reviews({reviews,professorId,updateRatings}) {
  let token = getToken();
  let router = useRouter();
  const [popup, setPopup] = useState({
    show: false,
    type: '',
    message: '',
    timeout: 0,
  });
  const[showModel,setShowModel] = useState({show:false,id:0,type:""});

  const content = (
    <div>
      <h5>Login Required</h5>
      <p>You need to sign in to perform this action.</p>
      <div style={{display:"flex",alignItems:"center",justifyContent:"center", marginTop:"10px" , marginBottom:"10px"}}>
        <button
        style={{padding:"5px"}}
        className={`full-width bg-763FF9 border-none border-radius-4 text-ffffff text-weight-500 text-16`}
        onClick={()=>router.push("/login")}>Login</button>
        <button
        style={{marginLeft:"5px",padding:"5px"}}
        className={`full-width bg-red border-none border-radius-4 text-ffffff text-weight-500 text-16`}
        onClick={()=>setShowModel({show:false,id:0,type:""})}>Close</button>
      </div>
    </div>
  );
  const convertDate = (date)=>{
    return new Intl.DateTimeFormat('en-US', { month: 'long', day: 'numeric', year: 'numeric',}).format(new Date(date))
  }
  const updateReactRating = async (check,review)=>{
    if (token) {
    let reaction = {
      ratingId: review.id,
      upvote: review.reactRatings.upvote,
      downvote: review.reactRatings.downvote,
      report: review.reactRatings.reported,
    }
    let previousReview = review
    let updatedReview = review
    if(check === 1){
      reaction.upvote = !review.reactRatings.upvote;
      if(reaction.upvote){
        updatedReview.upVotes = updatedReview.upVotes+1;
      }else{
        updatedReview.upVotes = updatedReview.upVotes-1;
      }
      if(reaction.upvote && reaction.downvote){
        reaction.downvote = false;
        updatedReview.downVotes = updatedReview.downVotes-1;
      }
    }
    else if(check === 2){
      reaction.downvote = !review.reactRatings.downvote;
      if(reaction.downvote){
        updatedReview.downVotes = updatedReview.downVotes+1;
      }else{
        updatedReview.downVotes = updatedReview.downVotes-1;
      }
      if(reaction.upvote && reaction.downvote){
        reaction.upvote = false;
        updatedReview.upVotes = updatedReview.upVotes-1;
      }
    }
    else{
      reaction.report = !review.reactRatings.reported;
      if(reaction.report){
        updatedReview.reports = updatedReview.reports+1;
      }else{
        updatedReview.reports = updatedReview.reports-1;
      }
    }
    updatedReview.reactRatings.upvote = reaction.upvote;
    updatedReview.reactRatings.downvote = reaction.downvote;
    updatedReview.reactRatings.reported = reaction.report;
    updateRatings?.(updatedReview,professorId)
    try{
      await BaseApi.reactRatings(reaction)
    }catch (e){
      updateRatings?.(previousReview,professorId)
    }
  }  else {
    setShowModel({show:true,id:review.id,type: check==1?"upvote" :check==2 ? "downvote" : "report"});
    // setTimeout(()=>setShowModel(()=>setShowModel({show:false,id:0,type:""})),2000)
  }
  }

  const copyToClipboard = (id) => {
    console.log("----inside-----")
    navigator.clipboard.writeText(`${window.location.origin}/professor/review/${id}`).then(
      () => {
        setPopup({
          show: true,
          type: 'success',
          message: 'Link Copied to Clipboard',
          timeout: 3000,
        });
        console.log('Copied!');
      },
      (err) => {
        console.error('Error copying to clipboard: ', err);
      }
    );
  }


  return<>
  <PopUp props={popup}/>

    {reviews?.map((review,index) => (
      <div key={'review'+index} className="flex mb-20">
        <div className="flex column items-center reviews">
          <div className={`circle  circle${index%4} circle-margin`}>{review?.student_name?.split(" ")[0]?.charAt(0)?.toUpperCase()}{review?.student_name?.split(" ")[1]?.charAt(0)?.toUpperCase()}</div>
          {/* <Image className="border-radius-100" height={48} width={48} src={review?.student_image_url ? review?.student_image_url : '/student.png'} alt={review?.image_url} /> */}
          {/* <p style={{width:"120px",textAlign:"center"}}>{review?.reactRatings?.student?.first_name} {review.reactRatings?.student?.last_name}</p> */}
          <p className="text-0378A6 text-26 text-weight-600">{(review?.rating?.toFixed(1))}</p>
        </div>
        <div className="flex-1 ml-12  border-radius-10 pa-20 bg-E6F1F6">
          <div className="flex justify-between mb-20">
            <p className="text-16 text-141414 text-weight-700">{review?.course_name !== 'N/A'?review?.course_name.toUpperCase():''}</p>
            <p className="text-14 text-141414 text-weight-600">{convertDate(review?.created_at)}</p>
          </div>
          <p className="text-141414 text-16 text-weight-400 mb-20">{review?.comment}</p>
          <div className="flex mb-20 professor-mobile-flex-col">
            {review?.tags?.map((tag,index) => (
              <div key={tag+'-'+index} className="bg-ffffff  text-14 text-024864 text-weight-400 pa-10 border-radius-6 mr-16  review-tag ">
                {tag}
              </div>
            ))}
          </div>
          <div className="flex mb-10 professor-mobile-flex-col credit-attendence">
            <p className="text-434343 text-14 text-weight-400">For Credit: <span className="text-weight-600 text-141414">{review?.for_credit?'Yes':'No'}</span></p>
            <p className=" ml-12 text-434343 text-14 text-weight-400">Attendance: <span className="text-weight-600 text-141414">{review?.attendance?'Mandatory':'optional'}</span></p>
            <p className=" ml-12 text-434343 text-14 text-weight-400">TextBook Use: <span className="text-weight-600 text-141414">{review?.textbook_use?'Yes':'No'}</span></p>
          </div>
          <div className="flex justify-between items-center">
            <div className="flex items-center">
            <Popover content={content} open={showModel.show==true && showModel.id==review.id && showModel.type=="upvote"}>
              <Image data-toggle="tooltip" data-placement="bottom" title="Like" className={`${token? "cursor-pointer" : ""}`} width={16} height={16} src={review?.reactRatings?.upvote?'/likeTrue.png':'/like.png'} alt="like" onClick={()=>{updateReactRating(1,review)}}/>
              </Popover>
              <p className="text-14 text-434343 text-weight-400 " style={{marginLeft:'4px',marginRight:'8px',width:'18px'}}>{review?.upVotes}</p>
            <Popover content={content} open={showModel.show==true && showModel.id==review.id && showModel.type=="downvote"}>
              <Image data-toggle="tooltip" data-placement="bottom" title="Dislike" className={`${token? "cursor-pointer" : ""}`} width={16} height={16} src={review?.reactRatings?.downvote?'/dislikeTrue.png':'/dislike.png'}alt="like" onClick={()=>{updateReactRating(2,review)}}/>
              </Popover>
              <p className="text-14 text-434343 text-weight-400" style={{marginLeft:'4px',marginRight:'8px',width:'18px'}}>{review?.downVotes}</p>
            <Popover content={content} open={showModel.show==true && showModel.id==review.id && showModel.type=="report"}>
              <Image data-toggle="tooltip" data-placement="bottom" title="Report" className={`${token? "cursor-pointer" : ""}`} width={13} height={16} src={review?.reactRatings?.reported?'/reportTrue.png':'/report.png'} alt="like" onClick={()=>{updateReactRating(3,review)}}/>
              </Popover>
              <p className="text-14 text-434343 text-weight-400" style={{marginLeft:'4px',width:'18px'}}>{review?.reports}</p>
            </div>
            <Image className="cursor-pointer" data-toggle="tooltip" data-placement="bottom" title="Share" width={15} height={16} src="/share.svg" alt="like" onClick={()=>copyToClipboard(review.id)} />
          </div>
        </div>
      </div>
    ))}
  </>
}
