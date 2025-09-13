import { combineReducers } from "redux";
import jobAdvertismentReducer from "./reducers/jobAdvertisementReducer";
import authReducer from "./reducers/authReducer"

const rootReducer= combineReducers({
    jobAdvertisements:jobAdvertismentReducer,
    auth: authReducer,
})
export default rootReducer