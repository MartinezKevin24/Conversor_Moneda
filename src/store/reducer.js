import {INSERT_DATA, INSERT_CURRENCIES, CLEAR_DATA, INSERT_FROM} from "./actions";

const initialState = {
    dataCurrencies: null,
    dataBase: null,
    dataLatest: null,
    fromData: null
}

const convert = (state=initialState, action) => {
    switch (action.type){
        case INSERT_DATA:
            return{
                ...state,
                dataCurrencies: action.payload.data,
            }
        case INSERT_CURRENCIES:
            return{
                ...state,
                dataBase: action.payload.data,
                dataLatest: action.payload.meta.last_updated_at
            }
        case INSERT_FROM:
            return{
                ...state,
                fromData: action.payload
            }
        default: return state;
    }
}

export default convert;