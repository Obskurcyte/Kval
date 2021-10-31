import {GET_UNREAD_MESSAGES} from "../actions/messages";

const initialState = {
    unreadMessages: []
};


const messageReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_UNREAD_MESSAGES :
            return {
                unreadMessages: action.unreadMessages
            }
    }
    return state;
}

export default messageReducer;

