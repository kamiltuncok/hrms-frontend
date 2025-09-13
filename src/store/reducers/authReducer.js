import { authTypes } from "../actions/authActions";

const initialState = {
    data: null, // Başlangıçta auth verisi yok
};

const authReducer = (state = initialState, action) => {
    switch (action.type) {
        case authTypes.SAVE_DATA:
            return { ...state, data: action.payload };
        case authTypes.USER_LOGOUT:
            return { ...state, data: null }; // Çıkış yapıldığında auth verisini temizle
        default:
            return state;
    }
};

export default authReducer;
