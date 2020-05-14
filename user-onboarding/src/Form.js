import React, { useState, useEffect } from "react";
import * as yup from "yup";
import axios from "axios";


function Form(){
    const newForm = {
        name: "",
        email: "",
        password: "",
        terms: "",
        remember: "",
    };

    const [post, setPost] = useState([]);
    
    const [serverError, setServerError] = useState("");
    
    const [formState, setFormState] = useState(newForm);
    
    const [isButtonDisabled, setIsButtonDisabled] = useState(true);

    const [errors, setErrors] = useState(newForm);


    const formSchema = yup.object().shape({
        name: yup
            .string()
            .required("Name is required"),
        email: yup
            .string()
            .email("Must be a valid email address")
            .required(),
        password: yup
            .string()
            .min(6, "Password must be 6 characters long.")
            .required("Please enter a valid password"),
        terms: yup
        .boolean()
        .oneOf([true], "Please Accept to Terms and Conditions"),
    });
    
    const validateChange = e => {
        yup
         .reach(formSchema, e.target.name)
         .validate(e.target.value)
         .then(valid => {
             setErrors({...errors, [e.target.name]:""});
         })
         .catch(err => {
             console.log("errors!",err);
             setErrors({...errors, [e.target.name]: err.errors[0]});
         });
    };
    
    useEffect(() =>{
        formSchema.isValid(formSchema).then(valid => {
            console.log("valid?",valid);
            setIsButtonDisabled(!valid);
        });
    }, [formSchema]);
    
    const formSubmit = e => {
        e.preventDefault();

        axios
         
         .post("https://reqres.in/api/users", formState)
         .then(response => {
            setPost(response.data);

            setFormState({
                name:"",
                email:"",
                password:"",
                terms:""
            });
    
            setServerError(null);
         })
         
         .catch(err => {
             setServerError("Oops!");
         });
    };
    const inputChange = e => {
        e.persist();
        const newFormData ={
            ...formState,
            [e.target.name]:
            e.target.type === "checkbox" ? e.target.checked : e.target.value
        };
        validateChange(e);
        setFormState(newFormData);
    };
    
    return (
        <newForm onSubmit={formSubmit}>
            {serverError ? <p className="error">{serverError}</p> : null}
            <label htmlFor="name">
                Name
                <input
                    id="name"
                    type="text"
                    name="name"
                    onChange={inputChange}
                    value={formState.name}
                    data-cy="name"
                />
                {errors.name.length > 0 ? <p className="error">{errors.name}</p> : null}
            </label>

            <label htmlFor="email">
                Email
                <input
                    type="text"
                    name="email"
                    onChange={inputChange}
                    value={formState.email}
                    data-cy="email"
                />
                {errors.name.length > 0 ? <p className="error">{errors.email}</p> : null}
            </label>
            <label htmlFor="password">
                Password
                <input
                    type="password"
                    name="password"
                    onChange={inputChange}
                    value={formState.password}
                    data-cy="password"
                />
                {errors.name.length > 0 ? <p className="error">{errors.email}</p> : null}
            </label>
            <label htmlFor="terms" className="terms">
                <input
                    type="checkbox"
                    name="terms"
                    checked={formState.terms}
                    onChange={inputChange}
                />
                Terms & Conditions
            </label>

            <pre>{JSON.stringify(post, null, 2)}</pre>
            <button data-cy="submit" disabled={isButtonDisabled} type="submit">
                Login
            </button>
            
        </newForm>
    );
}
export default Form;