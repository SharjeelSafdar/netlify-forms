import React, { useState, useEffect } from "react"
import { Formik, Field, Form, ErrorMessage } from "formik"
import Recaptcha from "react-recaptcha"

const encode = data => {
  return Object.keys(data)
    .map(key => encodeURIComponent(key) + "=" + encodeURIComponent(data[key]))
    .join("&")
}

const ContactForm = () => {
  const [token, setToken] = useState(null)

  useEffect(() => {
    const script = document.createElement("script")
    script.src = "https://www.google.com/recaptcha/api.js"
    script.async = true
    script.defer = true
    document.body.appendChild(script)
  }, [])

  return (
    <Formik
      initialValues={{ fullName: "", email: "" }}
      validate={values => {
        const errors = {}
        if (!values.fullName) {
          errors.fullName = "Required"
        } else if (values.fullName.length <= 1) {
          errors.fullName = "Must be atleast 2 characters"
        }
        if (!values.email) {
          errors.email = "Required"
        } else if (
          !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)
        ) {
          errors.email = "Invalid email address"
        }
        return errors
      }}
      onSubmit={data => {
        console.log(data)
        if (token !== null) {
          fetch("/", {
            method: "POST",
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
            },
            body: encode({
              "form-name": "contact-form",
              "g-recaptcha-response": token,
              ...data,
            }),
          })
            .then(_ => alert("Form Submitted"))
            .catch(err => alert(err))
        }
      }}
    >
      <Form
        name="contact-form"
        data-netlify="true"
        data-netlify-honeypot="bot-field"
        data-netlify-recaptcha="true"
      >
        <Field type="hidden" name="form-name" />
        <Field type="hidden" name="bot-field" />

        <label htmlFor="fullName">Full Name: </label>
        <Field name="fullName" type="text" />
        <ErrorMessage name="fullName" />
        <br />

        <label htmlFor="email">Email: </label>
        <Field name="email" type="text" />
        <ErrorMessage name="email" />
        <br />

        <Recaptcha
          // sitekey={process.env.SITE_RECAPTCHA_KEY}
          sitekey="6LcX_IYaAAAAAHTJ1ATsk6ERThIcy5FlBN_XLLow"
          render="explicit"
          theme="dark"
          verifyCallback={response => {
            setToken(response)
          }}
          onloadCallback={() => {
            console.log("Done loading...")
          }}
        />
        <br />

        <button type="submit">Submit</button>
      </Form>
    </Formik>
  )
}

export default ContactForm
