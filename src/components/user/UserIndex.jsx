'use client';
import Image from 'next/image';
import SavedProfessor from './SavedProfessor';
import UserRatings from './UserRatings';
import Profile from './Profile';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { getUserInfo } from '../../services/JwtService';
import { BaseApi } from '../../app/(base)/BaseApi';

export default function UserIndex() {
  const userInfo = JSON.parse(getUserInfo());
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState(
    Number(searchParams.get('active')) || 0
  );
  const myRatings = [
    {
      image: '/professor.png',
      name: 'James Tortolano',
      department: 'Journalism',
      institute: 'Tech University USA',
      takeAgain: '40',
      loveTeaching: '80',
      reviews: [
        {
          image: '/student.png',
          rating: 4.3,
          courseCode: 'ENG101',
          date: 'Aug 19, 2021',
          review:
            'In mauris porttitor tincidunt mauris massa sit lorem sed scelerisque. Fringilla pharetra vel massa enim sollicitudin cras. At pulvinar eget sociis adipiscing eget donec ultricies nibh tristique.',
          tags: ['Tough Grader', 'Porttitor tincidunt', 'Tough Grader'],
          credit: 'Yes',
          attendance: 'Mandatory',
          upVotes: 5,
          downVotes: 5,
          reports: 3,
        },
      ],
    },
    {
      image: '/professor.png',
      name: 'James Tortolano',
      department: 'Journalism',
      institute: 'Tech University USA',
      takeAgain: '40',
      loveTeaching: '80',
      reviews: [
        {
          image: '/student.png',
          rating: 4.3,
          courseCode: 'ENG101',
          date: 'Aug 19, 2021',
          review:
            'In mauris porttitor tincidunt mauris massa sit lorem sed scelerisque. Fringilla pharetra vel massa enim sollicitudin cras. At pulvinar eget sociis adipiscing eget donec ultricies nibh tristique.',
          tags: ['Tough Grader', 'Porttitor tincidunt', 'Tough Grader'],
          credit: 'Yes',
          attendance: 'Mandatory',
          upVotes: 5,
          downVotes: 5,
          reports: 3,
        },
        {
          image: '/student.png',
          rating: 4.3,
          courseCode: 'ENG101',
          date: 'Aug 19, 2021',
          review:
            'In mauris porttitor tincidunt mauris massa sit lorem sed scelerisque. Fringilla pharetra vel massa enim sollicitudin cras. At pulvinar eget sociis adipiscing eget donec ultricies nibh tristique.',
          tags: ['Tough Grader', 'Porttitor tincidunt', 'Tough Grader'],
          credit: 'Yes',
          attendance: 'Mandatory',
          upVotes: 5,
          downVotes: 5,
          reports: 3,
        },
        {
          image: '/student.png',
          rating: 4.3,
          courseCode: 'ENG101',
          date: 'Aug 19, 2021',
          review:
            'In mauris porttitor tincidunt mauris massa sit lorem sed scelerisque. Fringilla pharetra vel massa enim sollicitudin cras. At pulvinar eget sociis adipiscing eget donec ultricies nibh tristique.',
          tags: ['Tough Grader', 'Porttitor tincidunt', 'Tough Grader'],
          credit: 'Yes',
          attendance: 'Mandatory',
          upVotes: 5,
          downVotes: 5,
          reports: 3,
        },
      ],
    },
    {
      image: '/professor.png',
      name: 'James Tortolano',
      department: 'Journalism',
      institute: 'Tech University USA',
      takeAgain: '40',
      loveTeaching: '80',
      reviews: [
        {
          image: '/student.png',
          rating: 4.3,
          courseCode: 'ENG101',
          date: 'Aug 19, 2021',
          review:
            'In mauris porttitor tincidunt mauris massa sit lorem sed scelerisque. Fringilla pharetra vel massa enim sollicitudin cras. At pulvinar eget sociis adipiscing eget donec ultricies nibh tristique.',
          tags: ['Tough Grader', 'Porttitor tincidunt', 'Tough Grader'],
          credit: 'Yes',
          attendance: 'Mandatory',
          upVotes: 5,
          downVotes: 5,
          reports: 3,
        },
        {
          image: '/student.png',
          rating: 4.3,
          courseCode: 'ENG101',
          date: 'Aug 19, 2021',
          review:
            'In mauris porttitor tincidunt mauris massa sit lorem sed scelerisque. Fringilla pharetra vel massa enim sollicitudin cras. At pulvinar eget sociis adipiscing eget donec ultricies nibh tristique.',
          tags: ['Tough Grader', 'Porttitor tincidunt', 'Tough Grader'],
          credit: 'Yes',
          attendance: 'Mandatory',
          upVotes: 5,
          downVotes: 5,
          reports: 3,
        },
        {
          image: '/student.png',
          rating: 4.3,
          courseCode: 'ENG101',
          date: 'Aug 19, 2021',
          review:
            'In mauris porttitor tincidunt mauris massa sit lorem sed scelerisque. Fringilla pharetra vel massa enim sollicitudin cras. At pulvinar eget sociis adipiscing eget donec ultricies nibh tristique.',
          tags: ['Tough Grader', 'Porttitor tincidunt', 'Tough Grader'],
          credit: 'Yes',
          attendance: 'Mandatory',
          upVotes: 5,
          downVotes: 5,
          reports: 3,
        },
      ],
    },
  ];

  useEffect(() => {
    setActiveTab(Number(searchParams.get('active')) || 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams.get('active')]);
  return (
    <>
      <main>
        <section>
          <div className="container py-5">
            <div className="d-flex flex-column align-items-center mb-5">
              <Image
                width={200}
                height={200}
                src="/user/userImage.png"
                alt="userImage"
                className="mb-3 img-fluid"
              />
              <h1 className="text-weight-700 text-1F1F1F text-48 text-capitalize">
                {userInfo.first_name + ' ' + userInfo.last_name}
              </h1>
              <p className="text-434343 text-weight-400 text-24 mb-60">
                {userInfo?.institute || 'School Name here'}
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
              {activeTab === 1 && <UserRatings ratings={myRatings} />}
              {activeTab === 2 && <Profile userInfo={userInfo} />}
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
