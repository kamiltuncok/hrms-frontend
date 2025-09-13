import { applyMiddleware, createStore } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import thunk from "redux-thunk";
import rootReducer from "./rootReducer";
import Cookies from 'js-cookie';
import { CookieTypes } from "../utilities/customFormControls/cookieTypes";
import { fetchAuthData } from "./actions/authActions";  // Auth verisini almak için import ettik

// Middleware
const middleware = [thunk];

// Initial state için auth verisini alalım
let auth = null;
try {
    const authCookie = Cookies.get(CookieTypes.AUTH);  // Çerezi al
    auth = JSON.parse(authCookie || '{}');  // Çerezi JSON olarak çöz
} catch (error) {
    console.error("Error reading auth cookie:", error);
}

const initial = {
    auth: {
      data: auth || null,
    },
    isAuthenticated: JSON.parse(localStorage.getItem('isAuthenticated')) || false,
  };
  

export function configureStore() {
    const store = createStore(
        rootReducer,  // Root reducer'ı kullanıyoruz
        initial,  // Başlangıç durumu
        composeWithDevTools(applyMiddleware(...middleware))  // Middleware ekliyoruz
    );

    // auth verisi store'a kaydedilmelidir.
    store.dispatch(fetchAuthData());  // Store'da auth verisini almak için fetchAuthData çağırıyoruz.

    return store;
}
