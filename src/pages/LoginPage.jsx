import {Formik,Form,Field,ErrorMessage} from 'formik'
import React, {useState} from 'react'
import { useDispatch } from 'react-redux'
import { NavLink,useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import '../assets/styles/auth.css'
import AuthService from '../services/authService'
import { login, saveAuthData } from '../store/actions/authActions.js'
import { CookieTypes } from '../utilities/customFormControls/cookieTypes.js'
import Cookies from "js-cookie"
import * as Yup from 'yup'
import { FormField,Button,Label } from "semantic-ui-react"
import HrmsTextinput from "../utilities/customFormControls/HrmsTextinput"
import { ToastContainer } from 'react-toastify';
import Navi from '../layouts/Navi'
import SignedOut from '../layouts/SignedOut'
import { useAuth } from '../store/contexts/authContext.js';

export default function LoginPage({ handleSignIn  }) {

    const { setIsAuthenticated } = useAuth();

    const initialValues = {
        email: "",
        password: "",
    }



    
    const schema = Yup.object().shape({
        email: Yup.string().required("Eposta zorunlu").email("Eposta adresi hatalı"),
        password: Yup.string().required("Şifre zorunlu"),
    });

    const dispatch = useDispatch();
    const navigate = useNavigate();
    
    const handleLogin = (values) => {
        const authService = new AuthService();
    
        authService
          .login(values)
          .then((result) => {
            if (result.data.success) {
              toast.success(result.data.message);  // Başarı mesajı
              const { data } = result.data;  // API'den gelen auth verisi
              
              // Çerez kaydetme işlemi
              Cookies.set(CookieTypes.AUTH, JSON.stringify(data));  // Auth verisini çereze kaydet
    
              dispatch(saveAuthData(data));  // Redux store'a kaydet
              setIsAuthenticated(true);  // Kullanıcıyı oturum açmış olarak işaretle
    
              setTimeout(() => {
                navigate('/citylist');  // Başarıyla giriş yaptıktan sonra yönlendirme
              }, 1000);
            } else {
              toast.error(result.data.message);  // Hata mesajı
            }
          })
          .catch(() => {
            toast.error("Giriş işlemi sırasında bir hata oluştu.");
          });
    };

    return (
        <div className="login-page">
            <div className="login-wrapper">
                <div className="container-login">
                    <div className="wrap-login">
                        <Formik
                            initialValues={initialValues}
                            validationSchema={schema}
                            onSubmit={handleLogin}
                        >
                            {(props) => (
                                <Form className="ui form">
                                    <span className="login100-form-title p-b-34 p-t-27">
                                        Giriş Yap
                                    </span>
                                    <br />
                                    <br />
                                    <HrmsTextinput name="email" placeholder="Email" />
                                    <br />
                                    <HrmsTextinput name="password" placeholder="Şifre" />
                                    <div className="form-check">
                                        <Field
                                            type="checkbox"
                                            name="agree"
                                            id="flexCheckDefault"
                                        />
                                        <label
                                            className="form-check-label"
                                            htmlFor="flexCheckDefault"
                                        >
                                            Beni Hatırla
                                        </label>
                                    </div>
                                    <Button color="green" type="submit">
                                        Giriş Yap
                                    </Button>
                                </Form>
                            )}
                        </Formik>
                        <div className="login-footer text-white text-center mt-3">
                            <a className="text-white" href="/auth/login">
                                Hesabınız var mı? Giriş yapın.
                            </a>
                        </div>
                        <ToastContainer />
                    </div>
                </div>
            </div>
        </div>
    );
}
