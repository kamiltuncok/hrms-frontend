import { Formik } from 'formik'
import React from 'react'
import * as Yup from "yup";
import { Button, Form, Label, TextArea } from 'semantic-ui-react'
import JobPositionDropdown from '../utilities/customFormControls/JobPositionDropdown';
import SectorDropdown from '../utilities/customFormControls/SectorDropdown';
import CityDropdown from '../utilities/customFormControls/CityDropdown';
import SBInput from '../utilities/customFormControls/SBInput';
import RichTextEditor from '../utilities/customFormControls/RichTextEditor';
import {addJobAdvert} from '../store/actions/jobAdvertisementAction.js'
import { useDispatch } from 'react-redux';

export default function JobAdvertisementAdd() {
    const dispatch = useDispatch()
    const initialValues = {
        jobPosition: { id: "" },
        employer: { id: "" },
        city: { id: "" },
        typeOfWork:"",
        startDate: "",
        endDate: "",
        minSalary: "",
        maxSalary: "",
        description: "",
        freePositionAmount:""
    }

    const schema = Yup.object().shape({
        jobPosition: Yup.object().shape({
            id: Yup.number().required("Bu alan zorunlu!")
        }),
        employer: Yup.object().shape({
            id: Yup.number().required("Bu alan zorunlu!")
        }),
        city: Yup.object().shape({
            id: Yup.number().required("Bu alan zorunlu!")
        }),
        startDate: Yup.string().required("Bu alan zorunlu!"),
        endDate: Yup.string().required("Bu alan zorunlu!"),
        description: Yup.string().required("Bu alan zorunlu!"),
        minSalary: Yup.string().required("Bu alan zorunlu!"),
        maxSalary: Yup.string().required("Bu alan zorunlu!"),
        freePositionAmount: Yup.string().required("Bu alan zorunlu!"),
        typeOfWork: Yup.string().required("Bu alan zorunlu!"),
    });
    
    return (
        <div className="bg-light">
            <div className=" w-75 m-auto pt-6">
                <div className="p-5">
                    <Formik
                        initialValues={
                            initialValues
                        }
                        //validationSchema={schema}
                        onSubmit={(values) => {
                            console.log(values)
                            dispatch(addJobAdvert(values))
                        }}
                    >
                        {props => (

                            <Form >
                                <Form.Group widths={3}>
                                    <CityDropdown name="city.id" />
                                    <JobPositionDropdown name="jobPosition.id" />
                                    <SectorDropdown name="employer.id" />
                                </Form.Group>
                                <Form.Group widths={3}>
                                <SBInput label="İş Türü" name="typeOfWork" placeholder="İş Türü" />
                                    <SBInput label="Yayınlanma Tarihi" name="startDate" placeholder="Yayınlanma Tarihi" type="date" />
                                    <SBInput label="Son Başvuru Tarihi" name="endDate" placeholder="Son Başvuru Tarihi" type="date" />
                                </Form.Group>
                                <Form.Group widths={3}>
                                    <SBInput label="Minimum Maaş" name="minSalary" placeholder="Minimum Maaş" />
                                    <SBInput label="Maksimum Maaş" name="maxSalary" placeholder="Maksimum Maaş" />
                                    <SBInput label="Eleman Kontenjanı" name="freePositionAmount" placeholder="Eleman Kontenjanı" />
                                </Form.Group>
                                <Form.Field>
                                    <label className="mt-5 text-left">
                                        Lütfen iş ilanı için açıklama giriniz
                                    </label>
                                    <RichTextEditor
                                        textValue={(value)=>{
                                                props.setFieldValue(value)
                                                
                                        }}
                                        defaultValue={props.values.description}
                                    />
                                   
                                </Form.Field>
                                <Button color='green' type="submit" className="mt-3" onClick={()=>props.submitForm()}>İlanı yayınla</Button>
                            </Form>
                        )}

                    </Formik>
                </div>
            </div>

        </div>
    )
}
