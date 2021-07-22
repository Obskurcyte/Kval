import {GET_USER} from "../actions/users";

const initialState = {
  userData: null
}

const userReducer = (state= initialState, action) => {
  switch (action.type) {
    case GET_USER :
      return {
        userData : action.userData
      }
  }
  return state;
}

export default userReducer
