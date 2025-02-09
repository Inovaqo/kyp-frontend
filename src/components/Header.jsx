'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { getToken, getUserInfo } from '@/services/JwtService';
import { AuthApi } from '@/app/(auth)/AuthApi';
import { useRouter } from 'next/navigation';
import { usePathname } from 'next/navigation'
import { useEffect, useState} from 'react';
import CustomDropdown from '../components/user/CustomDropdown.';
import { AutoComplete, Input, Tooltip, message, Modal } from 'antd';
import { CopyOutlined } from '@ant-design/icons';

import { BaseApi } from '@/app/(base)/BaseApi';
import { debounce } from 'lodash';
import { useCallback } from 'react';
import PopUp from './PopUp';

export default function Header() {
  const searchParams = useSearchParams();
  const pathname = usePathname()
  const router = useRouter();
  const [token, setToken] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [type, setType] = useState('name');
  const [search, setSearch] = useState('');
  const [searchCheck, setSearchCheck] = useState('');
  const [recommendation,setRecommendation]=useState([])
  const [notFound,setNotFound] = useState(false)
  const getPanelValue = (searchText) =>
  !searchText ? [] : [mockVal(searchText), mockVal(searchText, 2), mockVal(searchText, 3)];
  const [isDomLoaded, setIsDomLoaded] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [inviteModalOpen, setInviteModalOpen] = useState(false);
  const [popup, setPopup] = useState({
    show: false,
    type: '',
    message: '',
    timeout: 0,
  });

  const referral_code = getUserInfo() && JSON.parse(getUserInfo())?.referral_code

  const debouncedGetRecommendations = useCallback(
    debounce(async (text,type) => {
      await getRecommendations(text,type);
    }, 1000), []
  );

  const mockVal = (str, repeat = 1) => ({
    value: str.repeat(repeat),
  });
  const getRecommendations = async (text,type) => {
      if(text){
        try{
         let response =  await BaseApi.getRecommendations({searchBy:type,search:text})
         let sortedRecomendation = response.data.sort((a, b) => {
          const lowerText = text.toLowerCase();
          const nameA = a.name.toLowerCase();
          const nameB = b.name.toLowerCase();
          if (nameA === lowerText) return -1;
          if (nameB === lowerText) return 1;
          if (nameA.startsWith(lowerText) && !nameB.startsWith(lowerText)) return -1;
          if (!nameA.startsWith(lowerText) && nameB.startsWith(lowerText)) return 1;
          if (nameA.includes(lowerText) && !nameB.includes(lowerText)) return -1;
          if (!nameA.includes(lowerText) && nameB.includes(lowerText)) return 1;
          return 0;
        });
        setRecommendation(sortedRecomendation);
        }catch(e){
          setNotFound(true);
          setRecommendation([])
        }
      }
  }

  const renderItem = (name, department, institute,id) => ({
    value: name,
    label: (
      <div>
        {name} - {institute} - {department}
      </div>
    ),
  });

  const options = recommendation && search
    ? recommendation.map((recommend) =>
        renderItem(recommend.name, recommend.department_name, recommend.institute_name,recommend.id)
      )
    : [];


  const searchProfessor= (clear=false)=>{
    if(search.trim() === ''){
        setSearchCheck('Search field can not be empty')
    } else{
      setSearchCheck('')
      // setSearch('')
      if(clear){
        router.push('/professors-list');
      }else{
      router.push('/professors-list?searchBy='+type+'&search='+search);
    }
    }
  }

  useEffect(() => {
    const token = getToken();
    setToken(token);
    const userInfoData = getUserInfo();
    if (userInfoData) {
      setUserInfo(JSON.parse(userInfoData));
    }
    setIsDomLoaded(true);
  }, []);


  useEffect(() => {
    if(searchParams.get('searchBy') !== null){
      setType(searchParams.get('searchBy'))
    }
  }, [searchParams.get('searchBy')]);

  useEffect(() => {
      setSearch(searchParams.get('search'))
  }, [searchParams.get('search')]);

  useEffect(()=>{
    if(search=== ''){
      setRecommendation([])
    }
  },[search])

  useEffect(()=>{
      setSearch('');
      setRecommendation([]);
  },[type])

  useEffect(()=>{
    if(pathname.includes("search=")){
    }
    setSearchCheck('');
  },[pathname])

  const logout = () => {
    if (userInfo && userInfo.email) {
      AuthApi.logout().then(() => {
        router.push('/login');
      });
    }
  };

  const closeDropDown = (parentClass) => {
    const dropdown = document.querySelector(parentClass);
    if (dropdown) {
      dropdown.style.display = 'none';
      setTimeout(() => {
        dropdown.style.display = 'block';
      }, 200);
    }
  };

  useEffect(() => {
    if(window.innerWidth <= 576){
      if(sidebarOpen){
        document.body.style.overflow = 'hidden'
      }
      else {
        document.body.style.overflow = 'auto'
      }
    }
  }, [sidebarOpen])

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  const handleCopy = (referral_code)=>{
    
    navigator.clipboard.writeText(referral_code).then(()=>{
      setPopup({
        show: true,
        type: 'success',
        message: 'Copied to clipboard!',
        timeout: 5000,
      });
    }).catch(()=>{
      setPopup({
        show: true,
        type: 'success',
        message: 'Failed to copy!',
        timeout: 5000,
      });
    })
  }
  return (
    <nav>
      <div style={{height: '80px', borderBottom: "1.25px solid #E4E7EC"}}
           className=" px-160 flex justify-between items-center tablet-px-90 tablet-px-50 mobile-px-20">
        <Link href="/">
          <Image height={35} width={70} src="/KYP.png" alt="KYPIcon"/>
        </Link>
        <div className="flex justify-between items-center">
          {
              pathname != "/" &&
              <>
                <div className="d-sm-flex d-none">
                  {isDomLoaded && (
                      <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60px'}}>
                        <CustomDropdown
                            selectedValue={type}
                            onSelect={setType}
                            placeholder="Select"
                            height={52}
                            borderRightNull={true}

                        />
                        {/* <div style={{borderTop:"1px solid #D9D9D9", borderBottom:"1px solid #D9D9D9",display:"flex",alignItems:"center",width:"30px",height:"50px", paddingLeft:"10px"}}>
              <LuSearch size={20} />
              </div> */}
                        <div style={{
                          display: 'flex',
                          flexDirection: 'row',
                          alignItems: "center",
                          position: 'relative',
                          minHeight: '50px'
                        }}>

                          {/* <span style={{position: "absolute", top: "30px"}} className="text-12">search</span> */}

                          <AutoComplete
                              autoFocus={false}
                              notFoundContent={
                                notFound ? (
                                    <div style={{
                                      color: '#FFCC00',
                                      fontSize: '18px',
                                      textAlign: 'center',
                                      fontStyle: "italic"
                                    }}>
                                      Not Found
                                    </div>
                                ) : null
                              }
                              popupClassName=""
                              value={search}
                              // defaultValue={searchParams.get('search') || ''}
                              onSelect={function (value) {
                                if (value) {
                                  if (searchCheck !== '') {
                                    setSearchCheck('');
                                  }
                                  let selectedOption = recommendation.filter((recomend) => recomend.name == value);
                                  router.push(`/professor/${selectedOption[0].id}`);
                                }
                              }}
                              style={{
                                width: '446px',
                                height: '52px'
                              }}
                              className={`header-autocomplete-size ${searchCheck !== '' && 'emptysearch'}`}

                              options={options}
                              onSearch={(text) => {
                                setNotFound(false)
                                getPanelValue(text);
                                setSearch(text);
                                if (searchCheck !== '') {
                                  setSearchCheck('');
                                }
                                if (text.trim() !== '') {
                                  debouncedGetRecommendations(text.trim(), type)
                                }
                              }
                              }
                              placeholder={type === 'name' ? 'Search professor by name' : 'Search for professors by university'}
                              onKeyDown={(event) => {
                                if (event.key === 'Enter') {
                                  searchProfessor();
                                }
                              }}
                              allowClear={true}
                              onClear={() => searchProfessor(true)}
                          >
                          </AutoComplete>
                          <div
                              style={{
                                height: '52px',
                                width: '50px',
                                borderTopRightRadius: '12px',
                                borderBottomRightRadius: '12px'
                              }}
                              onClick={()=>searchProfessor()}
                              className="bg-FFA337 flex items-center justify-center cursor-pointer width-header-search">
                            <Image height={24} width={24} src="/searchIcon.svg" alt="searchIcon"/>
                          </div>
                          {/* {searchCheck !== '' &&(<span style={{color:"brown", position: "absolute", top: "48px"}} className="text-12">{searchCheck}</span>)} */}
                        </div>
                      </div>)}
                </div>
                <button className=" d-sm-none d-block border-none bg-FFA337 border-radius-100 flex justify-center items-center" style={{width:'47px',height:'47px'}} onClick={()=>{setIsModalOpen(true)}}>
                  <Image height={24} width={24} src="/searchIcon.svg" alt="profileicon"/>
                </button>
              </>
          }

          {
            (pathname === '/' && token && userInfo)  &&
            <>
            <div className='cursor-pointer px-20 py-12 text-18 flex justify-center items-center bg-ffffff text-763FF9 border-color-763FF9 border-radius-4 hover-invite-btn'
              onClick={()=> setInviteModalOpen(true)}
            >
                Invite
            </div>
            </>
          }
          <div className="ml-30 mobile-ml-15">
            {token && userInfo ? (
                <div className="profile-btn">
                <div className="bg-763FF9 border-radius-100 flex items-center justify-center cursor-pointer"
                       onClick={toggleSidebar} style={{width: '47px', height: '47px'}}>
                    <Image height={20} width={16} src="/profileicon.svg" alt="profileicon"/>
                  </div>
                  <div className="position-relative d-none d-sm-flex">
                    <div className="z-3 profile-div" style={{position: 'absolute', right: '0'}}>
                      <div className="nav-dropdown border-radius-8 pa-16 profile-dropdown mt-3">
                        <div className="flex column">
                          <div className="flex">
                            <div
                                className="text-14 bg-D6C5FD border-radius-8 pa-10 text-uppercase flex items-center justify-center"
                                style={{minWidth: '42px'}}>
                              {userInfo?.first_name[0] + userInfo?.last_name[0]}
                            </div>
                            <div className="ml-8">
                              <p className="text-141414 text-weight-600 text-16 text-capitalize">
                                {userInfo?.first_name + ' ' + userInfo?.last_name}
                              </p>
                              <p className="text-8C8C8C text-12 text-weight-400">{userInfo?.email}</p>
                            </div>
                          </div>
                          <div className="separator-x my-12"></div>
                          <div className="px-12">
                            <Link href={`/user/${userInfo.id}?active=0`} className="text-decoration-none"
                                  onClick={() => {
                                    closeDropDown('.profile-div');
                                  }}>
                              <div className="flex items-center mb-16 cursor-pointer">
                                <Image height={14} width={15} src="/saveProfessorsIcon.svg" alt="savedProfessorIcon"/>
                                <p className="text-weight-400 text-14 text-1F1F1F ml-12">Saved Professors</p>
                              </div>
                            </Link>
                            <Link href={`/user/${userInfo.id}?active=1`} className="text-decoration-none"
                                  onClick={() => {
                                    closeDropDown('.profile-div');
                                  }}>
                              <div className="flex items-center mb-16 cursor-pointer">
                                <Image height={14} width={15} src="/ratingIcon.svg" alt="ratingIcon"/>
                                <p className="text-weight-400 text-14 text-1F1F1F ml-12">My Ratings</p>
                              </div>
                            </Link>
                            <Link href={`/user/${userInfo.id}?active=2`} className="text-decoration-none"
                                  onClick={() => {
                                    closeDropDown('.profile-div');
                                  }}>
                              <div className="flex items-center mb-16 cursor-pointer">
                                <Image height={14} width={15} src="/profileBlackIcon.svg" alt="profileBlackIcon"/>
                                <p className="text-weight-400 text-14 text-1F1F1F ml-12">Profile Settings</p>
                              </div>
                            </Link>
                            <div className="flex items-center mb-16 cursor-pointer" onClick={logout}>
                              <Image height={12} width={15} src="/logoutIcon.svg" alt="logoutIcon"/>
                              <p className="text-weight-400 text-14 text-1F1F1F ml-12">Logout</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
            ) : (
                <div>
                  <div className="d-block d-sm-none">
                    <Image height={20} width={20} src="/toggleSidebaricon.svg" alt="toggleSidebaricon"
                           onClick={toggleSidebar}/>
                  </div>

                  <div className="d-none d-sm-flex">

                    <button onClick={() => {
                      router.push('/sign-up');
                    }}
                            className="cursor-pointer px-20 py-12 text-18 flex justify-center items-center bg-ffffff text-763FF9 border-color-763FF9 border-radius-4">
                      Sign Up
                    </button>

                    <button onClick={() => {
                      router.push('/login');
                    }}
                            className="cursor-pointer px-20 py-12 ml-12 text-18 flex justify-center items-center bg-763FF9 text-ffffff border-color-763FF9 border-radius-4">
                      Login
                    </button>
                  </div>
                </div>

            )}
          </div>
        </div>
        {
            sidebarOpen && (<div className={`d-block d-sm-none sidebar  ${sidebarOpen ? 'open' : ''}`}>
              <div className="sidebar-content ">
                {/* Sidebar content goes here */}
                <div className="close-button" onClick={closeSidebar}>
                  &times;
                </div>
                {token && userInfo ? (<div className="flex column">
                  <div className="flex">
                    <div className="text-14 bg-D6C5FD border-radius-8 pa-10 text-uppercase flex items-center justify-center"
                         style={{minWidth: '42px'}}>
                      {userInfo?.first_name[0] + userInfo?.last_name[0]}
                    </div>
                    <div className="ml-8">
                      <p className="text-141414 text-weight-600 text-16 text-capitalize">
                        {userInfo?.first_name + ' ' + userInfo?.last_name}
                      </p>
                      <p className="text-8C8C8C text-12 text-weight-400">{userInfo?.email}</p>
                    </div>
                  </div>
                  <div className="separator-x my-12"></div>

                  <div className="px-12">
                    <Link href={`/user/${userInfo.id}?active=0`} className="text-decoration-none" onClick={closeSidebar}>
                      <div className="flex items-center mb-16 cursor-pointer">
                        <Image height={10} width={11} src="/saveProfessorsIcon.svg" alt="savedProfessorIcon"/>
                        <p className="text-weight-400 text-14 text-1F1F1F ml-12">Saved Professors</p>
                      </div>
                    </Link>
                    <Link href={`/user/${userInfo.id}?active=1`} className="text-decoration-none" onClick={closeSidebar}>
                      <div className="flex items-center mb-16 cursor-pointer">
                        <Image height={10} width={11} src="/ratingIcon.svg" alt="ratingIcon"/>
                        <p className="text-weight-400 text-14 text-1F1F1F ml-12">My Ratings</p>
                      </div>
                    </Link>
                    <Link href={`/user/${userInfo.id}?active=2`} className="text-decoration-none" onClick={closeSidebar}>
                      <div className="flex items-center mb-16 cursor-pointer">
                        <Image height={10} width={11} src="/profileBlackIcon.svg" alt="profileBlackIcon"/>
                        <p className="text-weight-400 text-14 text-1F1F1F ml-12">Profile Settings</p>
                      </div>
                    </Link>
                    <div className="flex items-center mb-16 cursor-pointer" onClick={logout}>
                      <Image height={10} width={11} src="/logoutIcon.svg" alt="logoutIcon"/>
                      <p className="text-weight-400 text-14 text-1F1F1F ml-12">Logout</p>
                    </div>
                  </div>
                </div>) : (
                    <div className='mt-30'>
                      <div
                          onClick={() => {
                            router.push('/sign-up');
                          }}
                          className="cursor-pointer px-20 py-12 text-18  text-763FF9 "
                      >
                        Sign Up
                      </div>

                      <div
                          onClick={() => {
                            router.push('/login');
                          }}
                          className="cursor-pointer px-20 py-12 text-18  text-763FF9 "
                      >
                        Login
                      </div>
                    </div>

                )}

              </div>
            </div>)
        }

        <Modal footer={<></>} closeIcon={false} title="" open={isModalOpen} onCancel={() => {
          setIsModalOpen(false)
        }}>
          {isDomLoaded && (
              <div className='mobile-mb-20' style={{display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60px'}}>
                <CustomDropdown
                    selectedValue={type}
                    onSelect={setType}
                    placeholder="Select"
                    height={52}
                    borderRightNull={true}

                />
                {/* <div style={{borderTop:"1px solid #D9D9D9", borderBottom:"1px solid #D9D9D9",display:"flex",alignItems:"center",width:"30px",height:"50px", paddingLeft:"10px"}}>
              <LuSearch size={20} />
              </div> */}
                <div style={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: "center",
                  position: 'relative',
                  minHeight: '50px',
                  width:"100%"
                }}>

                  {/* <span style={{position: "absolute", top: "30px"}} className="text-12">search</span> */}

                  <AutoComplete
                      autoFocus={false}
                      notFoundContent={
                        notFound ? (
                            <div style={{
                              color: '#FFCC00',
                              fontSize: '18px',
                              textAlign: 'center',
                              fontStyle: "italic"
                            }}>
                              Not Found
                            </div>
                        ) : null
                      }
                      popupClassName=""
                      value={search}
                      // defaultValue={searchParams.get('search') || ''}
                      onSelect={function (value) {
                        if (value) {
                          if (searchCheck !== '') {
                            setSearchCheck('');
                          }
                          let selectedOption = recommendation.filter((recomend) => recomend.name == value);
                          router.push(`/professor/${selectedOption[0].id}`);
                          setIsModalOpen(false)
                        }
                      }}
                      style={{
                        width: '100%',
                        height: '52px'
                      }}
                      options={options}
                      onSearch={(text) => {
                        setNotFound(false)
                        getPanelValue(text);
                        setSearch(text);
                        if (searchCheck !== '') {
                          setSearchCheck('');
                        }
                        if (text.trim() !== '') {
                          debouncedGetRecommendations(text.trim(), type)
                        }
                      }
                      }
                      placeholder={type === 'name' ? 'Search professor by name' : 'Search for professors by university'}
                      onKeyDown={(event) => {
                        if (event.key === 'Enter') {
                          searchProfessor();
                        }
                      }}
                      allowClear={true}
                      onClear={() => searchProfessor(true)}
                  >
                  </AutoComplete>

                  {/* {searchCheck !== '' &&(<span style={{color:"brown", position: "absolute", top: "48px"}} className="text-12">{searchCheck}</span>)} */}
                </div>
              </div>)}
          <div
              onClick={()=>{
                searchProfessor();
                setIsModalOpen(false);
              }}
              style={{
                height: '52px',
                width: '100%',
                borderRadius:"12px"
              }}
              className="bg-FFA337 flex items-center justify-center cursor-pointer ">
            <Image height={24} width={24} src="/searchIcon.svg" alt="searchIcon"/>
          </div>
        </Modal>
      </div>
      {sidebarOpen && <div className="overlay" onClick={closeSidebar}></div>}
      <Modal className="invite-modal-header" open={inviteModalOpen} footer={[]}  width={500} onCancel={()=>{setInviteModalOpen(false)}} title="Invite">
        <h3 className='text-18'>Referral Link</h3>
            <Input  className='mb-16' size="large" addonAfter={
                  <Tooltip title="Copy">
                    <CopyOutlined onClick={()=> handleCopy(referral_code)}  />
                  </Tooltip>
            }
            readOnly
            value={referral_code} 
             />
         <h3 className='text-18'>Referral Code</h3>

             <Input className='mb-16'  size="large" addonAfter={
                  <Tooltip title="Copy">
                    <CopyOutlined onClick={()=> handleCopy(referral_code?.split('/')[4])}  />
                  </Tooltip>
            }
            readOnly
            value={referral_code?.split('/')[4]} 
             />
      </Modal>
      <PopUp props={popup}  />
    </nav>
  );
}
