import {GET_ARTICLES} from "../actions/articlesEnVente";
import {GET_COMMANDES} from "../actions/articlesCommandes";


const initialState = {
    mesCommandes : []
}

const articleCommandeReducer = (state= initialState, action) => {
    switch (action.type) {
        case GET_COMMANDES :
            return {
                mesCommandes : action.mesCommandes
            }
    }
    return state;
}


export default articleCommandeReducer;
