import {GET_NOTIFICATIONS} from "../actions/notifications";

const initialState = {
  notifs: []
}

const notifReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_NOTIFICATIONS :
      return {
        notifs : action.notifs
      }
  }
  return state;
}


export default notifReducer
