'use client';
import Image from 'next/image';
import SavedProfessor from '@/components/user/SavedProfessor';
import UserRatings from '@/components/user/UserRatings';
import Profile from '@/components/user/Profile';
import { useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { getUserInfo } from '@/services/JwtService';
import {getToken}  from '@/services/JwtService'
import { useRouter } from 'next/navigation';

export default function User() {
    let token = getToken();
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const router = useRouter()
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const searchParams = useSearchParams();
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [activeTab, setActiveTab] = useState(
        Number(searchParams.get('active')) || 0
    );
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [userInfo,setUserInfo] = useState(JSON.parse(getUserInfo()));
    // console.log("userInfo: ",userInfo);

    // function getCookie(name) {
    //   const value = `; ${document.cookie}`;
    //   const parts = value.split(`; ${name}=`);
    //   if (parts.length === 2) return parts.pop().split(';').shift();
    // }
//   useEffect(() => {
// getCookie('user-info')
//   }, [userInfo]);

    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(() => {
        if(!token){
            router.push('/')
        }
        setActiveTab(Number(searchParams.get('active')) || 0);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchParams.get('active')]);
    return (
        <>
            <main>
                <section>
                    <div className="px-120 py-80 tablet-px-90 tablet-px-50 mobile-px-20">
                        <div className="d-flex flex-column align-items-center mb-5">
                            <Image
                                width={200}
                                height={200}
                                // src={userInfo?.image_url || "/user/userImage.png"}
                                src={userInfo?.image_url || '/student.png'}
                                alt="userImage"
                                className="mb-3 img-fluid border-radius-100"
                            />
                            <h1 className="text-weight-700 text-1F1F1F text-48 text-capitalize text-center">
                                {userInfo?.first_name + " " + userInfo?.last_name || "Name here"}
                            </h1>
                            <p className="text-434343 text-weight-400 text-24 mb-60">
                                {userInfo?.institute?.name ||'School Name here'}
                            </p>
                            <div className="d-flex flex-wrap justify-content-center mt-5 gap-5">
                                <p
                                    className={`text-141414 text-24 text-weight-400 cursor-pointer ${
                                        activeTab === 0 ? 'active-user-tab pb-2' : ''
                                    }`}
                                    onClick={() => setActiveTab(0)}
                                >
                                    Saved Professors
                                </p>
                                <p
                                    className={`text-141414 text-24 text-weight-400 cursor-pointer ${
                                        activeTab === 1 ? 'active-user-tab pb-2' : ''
                                    }`}
                                    onClick={() => setActiveTab(1)}
                                >
                                    Ratings
                                </p>
                                <p
                                    className={`text-141414 text-24 text-weight-400 cursor-pointer ${
                                        activeTab === 2 ? 'active-user-tab pb-2' : ''
                                    }`}
                                    onClick={() => setActiveTab(2)}
                                >
                                    Profile and settings
                                </p>
                            </div>
                        </div>
                        <div>
                            {activeTab === 0 && <SavedProfessor />}
                            {activeTab === 1 && <UserRatings />}
                            {activeTab === 2 && userInfo !== undefined && (
                                <Profile userInfo={userInfo} setUserProfileInfo={setUserInfo} />
                            )}
                        </div>
                    </div>
                </section>
            </main>
        </>
    );
}
