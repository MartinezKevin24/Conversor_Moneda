import {createStore} from "redux";
import {combineReducers} from "redux";
import { persistReducer } from 'redux-persist'
import convert from "./reducer";
import storage from 'redux-persist/lib/storage'
import { composeWithDevTools } from 'redux-devtools-extension';

const persistConfig = {
    key: 'Persist-currency',
    storage,
}

const reducers = combineReducers({convert})
const persistedReducer = persistReducer(persistConfig, reducers);

export default () => {

    return{
        ...createStore(persistedReducer, composeWithDevTools())
    }
}