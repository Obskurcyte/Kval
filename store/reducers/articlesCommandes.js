import {GET_AVIS, GET_COMMANDES} from "../actions/articlesCommandes";


const initialState = {
    mesCommandes : [],
    commentaires: []
}

const articleCommandeReducer = (state= initialState, action) => {
    switch (action.type) {
        case GET_COMMANDES :
            return {
                mesCommandes : action.mesCommandes
            }
        case GET_AVIS :
            return {
                commentaires : action.avis
            }
    }
    return state;
}


export default articleCommandeReducer;
