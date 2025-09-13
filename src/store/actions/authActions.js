import Cookies from "js-cookie";
import { userTypes } from "../actions/userAction";
import { CookieTypes } from "../../utilities/customFormControls/cookieTypes"

export const authTypes = {
    SAVE_DATA: "SAVE_DATA",
    USER_LOGOUT: "USER_LOGOUT",
};

export const saveAuthData = (data) => {
    return {
        type: authTypes.SAVE_DATA,
        payload: data,
    };
};

export const fetchAuthData = () => (dispatch) => {
    try {
        const storedAuth = Cookies.get(CookieTypes.AUTH); // Çerezden auth verisi al

        if (storedAuth) {
            const parsedAuth = JSON.parse(storedAuth); // Çerez verisini JSON olarak çöz
            dispatch(saveAuthData(parsedAuth)); // Redux store'a kaydet
        } else {
            dispatch(saveAuthData(null)); // Çerez yoksa null gönder
        }
    } catch (error) {
        console.error("Auth verisi alınamadı:", error);
    }
};

export const logout = () => (dispatch) => {
    Cookies.remove(CookieTypes.AUTH); // AUTH çerezini kaldır
    Cookies.remove(CookieTypes.USER); // USER çerezini de kaldır
    dispatch({ type: authTypes.USER_LOGOUT }); // Redux auth durumunu sıfırla
    dispatch({ type: userTypes.GET_USER, payload: null }); // Redux user durumunu sıfırla
};
