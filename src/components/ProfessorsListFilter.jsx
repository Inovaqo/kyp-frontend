'use client';
import { useSearchParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import ProfessorsList from './ProfessorsList';
import { BaseApi } from '@/app/(base)/BaseApi';
import CustomDropdown from './user/CustomDropdown.';

export default function ProfessorsListFilter(){
  const [loading,setLoading] = useState(true);
  const [showmoreLoader,setShowMoreLoader] = useState(false);
  const [professors, setProfessors] = useState([]);
  const searchParams = useSearchParams();
  const [type, setType] = useState('name');
  const [sort, setSort] = useState('first_name');
  const [sortOrder, setSortOrder] = useState(true);
  const [search, setSearch] = useState('');
  const [professorData, setProfessorData] = useState({});
  const [DropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const isFirstRender = useRef(true);

  useEffect(() => {
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

  const options = [
    { value: 'first_name', label: 'Name' },
    { value: 'overall_rating', label: 'Rating' }
  ];
  const updateProfessors = (professorId, isSaved) => {
    const updatedProfessors = professors.map(professor =>
      professor.id === professorId
        ? { ...professor, is_saved: isSaved }
        : professor
   );
    
    setProfessors(updatedProfessors);
  }
  const getProfessors = async (searchBy=type,text=search,concatCheck = false, page=1,showMore=false,option_selected=false)=>{
    // if(text){
      try{
       showMore? setShowMoreLoader(true): setLoading(true)
        await BaseApi.getProfessors({sortField:option_selected ? searchBy : sort,sortOrder:sortOrder?'ASC':'DESC',searchBy:searchBy,search:text,page:page})
          .then((response)=>{
            if(concatCheck){
              let tempProfessors = professors;
              tempProfessors = tempProfessors.concat(response.data)
              setProfessors(tempProfessors)
            }else{
              setProfessors(response.data)
            }
            setProfessorData(response)
            showMore? setShowMoreLoader(false):  setLoading(false)
          })
      }catch(e){
        setProfessors([])
        setProfessorData([])
        showMore? setShowMoreLoader(false):  setLoading(false)
      }
    // } else {
    //   showMore? setShowMoreLoader(false):  setLoading(false)
    // }
  }
  
  useEffect(() => {
    setSearch(searchParams.get('search')|| '')
    setType(searchParams.get('searchBy') || '0')
    getProfessors(searchParams.get('searchBy'),searchParams.get('search'));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ searchParams.get('search')]);

  useEffect(()=>{
    if(search==""&& !searchParams.get('search')){
      setProfessors([])
      setProfessorData([])
    }
  },[search,searchParams.get('search')])
  useEffect(() => {
    // getProfessors(type,search,false,1)
    if (isFirstRender.current) {
      isFirstRender.current = false;
    } else {
      getProfessors(type, search, false, 1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sortOrder]);

  return <>
    {/* <div className="mb-60"> */}
      {/* <div className="flex flex-nowrap professor-mobile-flex-col ">
        <div className="flex items-center ">
       <CustomDropdown  selectedValue={type}
                        onSelect={setType}
                        placeholder="Select"/>

        <input value={search} onChange={(event)=>{ setSearch(event.target.value)}} style={{ height: '72px', width: '420px', borderTopRightRadius: '12px', borderBottomRightRadius: '12px' }}
               className="px-20 border-color-D9D9D9 mobile-px-10 search-input-field border-right search-input-full-width"
               placeholder={type === 'name' ? 'Search professor with name' : 'Search for professors by university.'}
               onKeyDown={(event)=>{
                if (event.key === 'Enter') {
                  getProfessors(type,search,false,1)
                }
              }}
               />
        </div>
        <div
          onClick={()=>{getProfessors(type,search,false,1)}}
          style={{ height: '72px', width: '72px' }}
          className="bg-FFA337 flex items-center justify-center border-radius-12 ml-30 cursor-pointer professer-list-ml-0 height-search-52">
          <Image height={24} width={24} src="/searchIcon.svg" alt="searchIcon" />
        </div>
      </div> */}
    {/* </div> */}
    <div className="flex justify-between mb-32 professor-mobile-flex-col">
      <div className="flex items-center">
        <p className="text-24 text-1F1F1F text-weight-600">Search Results</p>
        <Image onClick={()=>{setSortOrder(!sortOrder);}} className="ml-12 cursor-pointer" width={20} height={16} src="/sortingIcon.svg" alt="sortingIcon"/>
        <p className="ml-8 text-12 text-434343">{sortOrder?'ASC':'DESC'}</p>
      </div>
      <div className="flex items-center professor-mobile-results-selection  mobile-mt-20">
        <p className="text-weight-600 text-8C8C8C text-18 mr-16">{professorData?.total?professorData?.total:0} Results found</p>
        <div className="relative sort-dropdown" ref={dropdownRef}>
          <div
            onClick={() => setDropdownOpen(!DropdownOpen)}
            style={{
              height: '48px',
              borderRadius: '12px',
              width: "156px",
              backgroundColor: '#ffffff',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',

            }}
            className="px-28 border-color-D9D9D9 mobile-width-sort-dropdown"
          >
          <p className='text-18'>{options.find(option => option.value === sort)?.label || "Sort By"}</p>
          <Image style={{ marginLeft: '24px' }} height={10} width={10} src="/arrowicon.svg" alt="searchIcon" />
          </div>
          {DropdownOpen && (
            <div
              style={{
                position: 'absolute',
                marginTop:'4px',
                width: '200px',
                borderRadius: '12px',
                border: '1px solid #D9D9D9',
                backgroundColor: '#ffffff',
                zIndex: 10,
                maxHeight: '200px',

              }}
              className="px-10 border-color-D9D9D9"
            >
              {options.map(option => (
                <div
                  key={option.value}
                  onClick={() => {
                    setSort(option.value);
                    setDropdownOpen(false);
                    getProfessors(option.value,search,false,1,false,true)
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
      </div>
    </div>
    {
    loading
    ?
    <div style={{display:"flex",alignItems:"center",justifyContent:"center",marginTop:"15%", marginBottom:"15%"}}><span className="loader"></span> </div>
    :
    professors.length > 0 ?
      (
        <div>
          <ProfessorsList professors={professors} updateProfessors={updateProfessors} professorlist={true} />
          {Number(professorData.page) < professorData.lastPage &&(<div className="flex items-center justify-center mt-4">
            <div className="text-weight-600 text-763FF9 text-24 cursor-pointer" onClick={()=>{getProfessors(type||searchParams.get('searchBy'),search||searchParams.get('search'),true,Number(professorData.page)+1,true)}}>
              <div className='see-div'>{ showmoreLoader ?<div className="seeMoreLoader"></div> :  <div>See more</div>} </div> 
            </div> 
          </div>)}
        </div>

      )
      : (<div className="full-width full-height flex items-center justify-center column">
        <Image className="mb-20" width={112} height={112} src="/norecordfound.svg" alt="norecordfound" />
        <p className="text-weight-600 text-18 text-1F1F1F mb-8">No records found</p>
        <p className="text-weight-400 text-14 text-595959">The record you tried to filter was not found.</p>
      </div>)}

</>
}
