export const GET_COMMANDES = 'GET_COMMANDES';
export const GET_AVIS = 'GET_AVIS';
import axios from 'axios';
import {BASE_URL} from "../../constants/baseURL";

export const getAvis = (idVendeur) => {
    return async dispatch => {
        try {
            const { data } = await axios.get(`${BASE_URL}/api/users/${idVendeur}`);
            let avis = data.avis
            console.log(data.pseudo)
            dispatch({type: GET_AVIS, avis})
        } catch(err) {
            console.log("Error getting documents: ", error);
        }
    }
};

