import { Formik, Form } from 'formik';
import React from 'react';
import { toast } from 'react-toastify';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import * as Yup from "yup";
import { Button } from "semantic-ui-react";
import UserService from '../services/userService.js'; // Burada doğru servisi import ediyoruz.
import HrmsTextinput from "../utilities/customFormControls/HrmsTextinput"; // Textinput bileşeniniz

export default function EmployerRegisterPage() {
    const initialValues = {
        companyName: "",
        phoneNumber: "",
        webAdress: "",
        user: {
            email: "",
            password: ""
        }
    };

    const schema = Yup.object({
        companyName: Yup.string().required('Şirket Adı Zorunlu'),
        phoneNumber: Yup.string().required('Telefon Numarası Alanı Zorunlu'),
        webAdress: Yup.string()
            .required('Web Adresi Alanı Zorunlu')
            .url('Geçerli bir web adresi giriniz'),
        user: Yup.object({
            email: Yup.string().email('Geçerli bir e-posta adresi giriniz').required('Email Alanı Zorunlu'),
            password: Yup.string().required('Şifre Alanı Zorunlu')
        })
    });

    // Handle form submit
    const handleRegister = (values) => {
        const userService = new UserService();
        const employerData = {
            companyName: values.companyName,
            phoneNumber: values.phoneNumber,
            webAdress: values.webAdress,
            user: {
                email: values.user.email,
                password: values.user.password
            }
        };

        // API'ye POST isteği gönderiyoruz
        userService.addEmployer(employerData).then(result => {
            if (result.data.success) {
                toast.success(result.data.message);
            } else {
                toast.error(result.data.message);
            }
        }).catch(error => {
            toast.error("Kayıt sırasında bir hata oluştu.");
            console.log(error);
        });
    };

    return (
        <div className="login-page">
            <div className="login-wrapper">
                <div className="container-login">
                    <Formik
                        initialValues={initialValues}
                        validationSchema={schema}
                        onSubmit={handleRegister}
                    >
                        {props => (
                            <Form className="ui form">
                                <span className="login100-form-title p-b-34 p-t-27">
                                    Kayıt Ol
                                </span>
                                <br />
                                <br />
                                <HrmsTextinput name="companyName" placeholder="Şirket Adı" />
                                <br />
                                <HrmsTextinput name="phoneNumber" placeholder="Telefon Numarası" maxlength="11" />
                                <br />
                                <HrmsTextinput name="webAdress" placeholder="İnternet Adresi" />
                                <br />
                                <HrmsTextinput name="user.email" placeholder="Email" />
                                <br />
                                <HrmsTextinput name="user.password" placeholder="Şifre" />
                                <br />
                                <div className="form-check">
                                    <input className="form-check-input" type="checkbox" value="" id="flexCheckDefault" />
                                    <label className="form-check-label" htmlFor="flexCheckDefault">
                                        Hizmet sözleşmesini onaylıyorum
                                    </label>
                                </div>
                                <br />
                                <Button color="green" onClick={props.handleSubmit} type="submit">Ekle</Button>
                            </Form>
                        )}
                    </Formik>
                    <br />
                    <div className="login-footer text-white text-center mt-3">
                        <a className="text-white" href="/auth/login">
                            Hesabınız var mı? Giriş yapın.
                        </a>
                    </div>
                    <ToastContainer />
                </div>
            </div>
        </div>
    );
}
