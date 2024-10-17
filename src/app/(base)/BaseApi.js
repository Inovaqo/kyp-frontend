import {BaseApiService} from './BaseApiService';

export const BaseApi = {
  getProfessors:async (data) => {
    let search = '?searchBy='+data.searchBy+'&search='+data.search+'&page='+data.page+'&sortField='+data.sortField+'&sortOrder='+data.sortOrder+'&empty_search='+data.search_empty;
    try {
      return await BaseApiService.getProfessors(search)
        .then((response)=>{
          return response.data;
        })
    } catch (e) {
      throw e.message;
    }
  },
  getProfessor:async (data) => {
    try {await BaseApiService.getProfessor(data)
      .then((response)=>{
        return response;
      })
    } catch (e) {
      throw e.message;
    }
  },
  getRecommendations:async (data) => {
    let search = '?searchBy='+data.searchBy+'&search='+data.search;
    try {
      let response = await BaseApiService.getRecommendations(search)
        return response;
    } catch (e) {
      throw e;
    }
  },
  saveProfessor:async (data) => {
    console.log(data);
    try {
      return await BaseApiService.saveProfessor(data)
      .then((response)=>{
        return response;
      })
    } catch (e) {
      throw e.message;
    }
  },
  SavedProfessors:async (data) => {
    let search = '?searchBy='+data.searchBy+'&search='+data.search+'&startIndex='+data.startIndex+'&endIndex='+data.endIndex;
    try {
      return await BaseApiService.SavedProfessors(search)
      .then((response)=>{
        return response;
      })
    } catch (e) {
      throw e.message;
    }
  },
  postReview:async (data) => {
    try {await BaseApiService.postReview(data)
      .then((response)=>{
        return response;
      })
    } catch (e) {
      throw e.message;
    }
  },
  postRating:async (data) => {
    try { return await BaseApiService.postRating(data)
      .then((response)=>{
        return response;
      })
    } catch (e) {
      throw e;
    }
  },
  getReviews:async (data) => {
    let search = '?searchBy='+data.searchBy+'&search='+data.search+'&page='+data.page;
    try {
      return await BaseApiService.getReviews(search)
      .then((response)=>{
        return response;
      })
    } catch (e) {
      throw e.message;
    }
  },
  updateProfile:async (data) => {
    try {await BaseApiService.updateProfile(data)
      .then((response)=>{
        return response;
      })
    } catch (e) {
      throw e;
    }
  },
  updatePassword:async (data) => {
    try {await BaseApiService.updatePassword(data)
      .then((response)=>{
        return response;
      })
    } catch (e) {
      throw e;
    }
  },
  reactRatings:async (data) => {
    try {
      return await BaseApiService.reactRatings(data)
      .then((response)=>{
        return response;
      })
    } catch (e) {
      throw e.message;
    }
  },
  getProfessorDetail: async(data) =>{
    try {
      const{id} = data
      let params= `${id}`
      return await BaseApiService.getProfessorDetails(params)
      .then((response)=>{
        return response;
      })
    } catch (e) {
      throw e.message;
    }
  },
  getProfessorCourseDetail: async(data) =>{
    try {
      const{id,courseCode,page,limit} = data
      let params= courseCode? `${id}/${courseCode}/?page=${page}&limit=${limit}` : `${id}/?page=${page}&limit=${limit}`
      return await BaseApiService.getProfessorCoursesDetails(params)
      .then((response)=>{
        return response;
      })
    } catch (e) {
      throw e.message;
    }
  },
  getProfessorCourses: async(data) =>{
    try {
      const{id} = data
      return await BaseApiService.getProfessorCourses(`${id}`)
      .then((response)=>{
        return response;
      })
    } catch (e) {
      throw e.message;
    }
  },
  getSavedProfessor: async(data) =>{
    try {
      const{id} = data
      return await BaseApiService.getSavedProfessor(`${id}`)
      .then((response)=>{
        return response;
      })
    } catch (e) {
      throw e.message;
    }
  },
  getReview: async(data) =>{
    try {
      const {id} =data
      return await BaseApiService.getReview(`${Number(id)}`)
        .then((response)=>{
          return response; 
        })
    } catch (e) {
      throw e.message;
    }
  }

};
