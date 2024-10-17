import ProfessorsList from "../ProfessorsList";
import Image from "next/image";
import { useEffect, useState } from "react";
import { BaseApi } from "../../app/(base)/BaseApi";
import CustomDropdown from "./CustomDropdown.";
import { getToken } from "../../services/JwtService";
import { useRouter } from "next/navigation";
import { MdClear } from "react-icons/md";

export default function SavedProfessor() {
  const token = getToken();
  const router = useRouter();
  const [showmoreLoader, setShowMoreLoader] = useState(false);
  const [type, setType] = useState("name");
  const [search, setSearch] = useState("");
  const [searchCheck, setSearchCheck] = useState("");
  const [professors, setProfessors] = useState([]);
  const [professorsData, setProfessorsData] = useState({});
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [focused, setFocused] = useState(false);

  const updateProfessors = (professorId) => {
    const updatedProfessors = professors.filter(
      (professor) => !(professor.id === professorId)
    );
    if (updatedProfessors.length === 0 && professorsData.total > 0) {
      // getProfessors(type, search, false,1);
      getProfessors();
    }
    let tempProfessorData = professorsData;
    tempProfessorData.total = tempProfessorData.total - 1;
    setProfessors(updatedProfessors);
  };

  const searchProfessor = () => {
    if (search.trim() === "") {
      setSearch("");
      setSearchCheck("Search field can not be empty");
    } else {
      getProfessors();
      setSearchCheck("");
    }
  };
  const getProfessors = async (
    searchBy = type,
    text = search,
    seeMore = false,
    startIndex = 0,
    endIndex = 5,
    showMore = false
  ) => {
    try {
      showMore ? setShowMoreLoader(true) : setLoading(true);
      await BaseApi.SavedProfessors({
        searchBy: searchBy,
        search: text,
        startIndex: startIndex,
        endIndex: endIndex,
      }).then((response) => {
        if (seeMore) {
          let tempProfessors = [...professors];
          tempProfessors.splice(
            startIndex,
            endIndex - startIndex,
            ...response.data.data
          );
          setProfessors(tempProfessors);
        } else {
          setProfessors(response.data.data);
        }
        setProfessorsData(response.data);
        setTotal(response.data.total);
        showMore ? setShowMoreLoader(false) : setLoading(false);
      });
    } catch (e) {
      setProfessors([]);
      setProfessorsData([]);
      showMore ? setShowMoreLoader(false) : setLoading(false);
    }
  };
  useEffect(() => {
    setSearch("");
  }, [type]);

  useEffect(() => {
    if (!token) {
      router.push("/");
    }
    getProfessors();
  }, []);

  return (
    <>
      {loading ? (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginTop: "15%",
            marginBottom: "30%",
          }}
        >
          <span className="loader"></span>{" "}
        </div>
      ) : (
        <>
          <div>
            <div className="flex full-width justify-center mb-32 mt-60 ">
              <div className="flex items-center  border-radius-12 professor-mobile-flex-col position-relative full-width-responsive ">
                <div
                  className=" search-drop-shadow-class flex full-width-responsive"
                  style={{
                    borderTopLeftRadius: "12px",
                    borderBottomLeftRadius: "12px",
                  }}
                >
                  <CustomDropdown
                    selectedValue={type}
                    onSelect={setType}
                    placeholder="Select"
                  />
                  <div className="position-relative full-width"  >
                    <input
                      value={search}
                      onChange={(event) => {
                        setSearch(event.target.value);
                        if (searchCheck !== "") {
                          setSearchCheck("");
                        }
                      }}
                      onFocus={() => setFocused(true)}
                      onBlur={() => setFocused(false)}
                      className="px-20 pr-30 search-input-field rating-input mobile-border-right"
                      placeholder={
                        type === "name"
                          ? "Search professor by name"
                          : "Search for professors by university."
                      }
                      onKeyDown={(event) => {
                        if (event.key === "Enter") {
                          searchProfessor();
                        }
                      }}
                    />
                    {focused && (
                      <span
                        className="search-icon cursor-pointer "
                        onMouseDown={(event) => {
                          event.stopPropagation();
                          getProfessors("", "");
                          setSearch("");
                        }}
                      >
                        <MdClear />
                      </span>
                    )}
                  </div>
                </div>
                <div
                  onClick={searchProfessor}
                  style={{
                    height: "72px",
                    width: "72px",
                    borderTopRightRadius: "12px",
                    borderBottomRightRadius: "12px",
                  }}
                  className=" bg-FFA337 flex items-center justify-center cursor-pointer full-width-responsive border-mobile height-search-52"
                >
                  <Image
                    height={24}
                    width={24}
                    src="/searchIcon.svg"
                    alt="searchIcon"
                  />
                </div>
                {/*{searchCheck !== '' && (<span className="text-12 text-1F1F1F position-absolute" style={{top:'75px',left:'0'}}>{searchCheck}</span>)}*/}
              </div>
            </div>
            <div className="flex justify-between mb-32">
              <p className="text-weight-600 text-24 text-1F1F1F">Saved</p>
              <p className="text-weight-600 text-18 text-8C8C8C">
                {professorsData.total ? professorsData.total : 0}
              </p>
            </div>
            {professors.length > 0 ? (
              <div>
                <ProfessorsList
                  professors={professors}
                  updateProfessors={updateProfessors}
                />
                {Math.ceil(Number(professors.length / 5)) <
                  Math.ceil(Number(total / 5)) && (
                  <div className="flex items-center justify-center mt-4">
                    <div
                      className="text-weight-600 text-763FF9 text-24 cursor-pointer"
                      onClick={() => {
                        getProfessors(
                          type,
                          search,
                          true,
                          professors.length,
                          professors.length +
                            (professors.length % 5 > 0 &&
                              5 - (professors.length % 5)) +
                            5,
                          true
                        );
                      }}
                    >
                      <div className="see-div">
                        {showmoreLoader ? (
                          <div className="seeMoreLoader"></div>
                        ) : (
                          <div>See more</div>
                        )}{" "}
                      </div>
                      {/* { showmoreLoader ?<div className="seeMoreLoader"></div> :  <div>See more</div>} */}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="full-width full-height flex items-center justify-center column">
                <Image
                  className="mb-20"
                  width={112}
                  height={112}
                  src="/norecordfound.svg"
                  alt="norecordfound"
                />
                <p className="text-weight-600 text-18 text-1F1F1F mb-8">
                  No records found
                </p>
                <p className="text-weight-400 text-14 text-595959">
                  The record you tried to filter was not found.
                </p>
              </div>
            )}
          </div>
        </>
      )}
    </>
  );
}
