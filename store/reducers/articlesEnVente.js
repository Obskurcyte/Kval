import {GET_ARTICLES} from "../actions/articlesEnVente";


const initialState = {
  mesVentes : []
}

const articleReducer = (state= initialState, action) => {
  switch (action.type) {
    case GET_ARTICLES :
      return {
        mesVentes : action.mesVentes
      }
    }
  return state;
}


export default articleReducer;
