import { Formik, Form } from 'formik';
import React from 'react';
import { toast } from 'react-toastify';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import * as Yup from "yup";
import { Button } from "semantic-ui-react";
import UserService from '../services/userService.js';  // Updated to import UserService
import HrmsTextinput from "../utilities/customFormControls/HrmsTextinput";

export default function JobSeekerRegisterPage() {

    const initialValues = {
        firstName: "",
        lastName: "",
        user: {
            email: "",
            password: ""
        }
    }

    const schema = Yup.object({
        firstName: Yup.string().required("İsim Alanı Zorunlu"),
        lastName: Yup.string().required("Soyad Alanı Zorunlu"),
        user: Yup.object({
            email: Yup.string().email("Geçerli bir e-posta adresi giriniz").required("Email Alanı Zorunlu"),
            password: Yup.string().required("Şifre Alanı Zorunlu"),
        }),
    });

    // Handle the job seeker registration
    const handleRegister = (values) => {
        const userService = new UserService();  // Instantiate the service
        const jobSeekerData = {
            firstName: values.firstName,
            lastName: values.lastName,
            user: values.user
        };
        
        // Call the addJobSeeker service method
        userService.addJobSeeker(jobSeekerData).then(result => {
            if (result.data.success) {
                toast.success(result.data.message);
            } else {
                toast.error(result.data.message);
            }
        }).catch(error => {
            toast.error("Bir hata oluştu: " + error.message);
        });
    }

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
                                <HrmsTextinput name="firstName" placeholder="İsim" />
                                <br />
                                <HrmsTextinput name="lastName" placeholder="Soyisim" />
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
