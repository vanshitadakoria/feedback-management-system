import { Box, Button, TextField } from "@mui/material";
import { Formik, Form, Field, setIn } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from '../../../components/Header';
import { useState, useEffect } from "react";
import { postCustomerUser } from "../../../services/customeradmin";
import { getCurrentLoggedInUser } from "../../../services/authentication";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const Create = () => {
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const generateThreeDigitNumber = () => Math.floor(100 + Math.random() * 900);
  const navigate = useNavigate();

  const CustomerAdminId = getCurrentLoggedInUser().customerAdminId;
  
  const [initialValues, setInitialValues] = useState({
    customerUserTokenId: generateThreeDigitNumber(),
    customerUserName: "",
    password: "",
    customerAdminId: CustomerAdminId ,
  });



  const handleFormSubmit = async (values) => {
    console.log("submitted");
    console.log(values);

    const updatedCustomerUser = {
        ...initialValues,
        customerUserName : values.customerUserName,
        password:values.password
    };
    console.log(updatedCustomerUser);
    try {
        const apiData = await postCustomerUser(updatedCustomerUser);
        toast.success("New CustomerUser created successfully");
        navigate('/customeradmin/customerusers')
        // setInitialValues();
        console.log(apiData);
    } catch (error) {
      toast.error("Error creating CustomerUser");

        console.error('Error posting newCustomerUser :', error);
    }
  };

  const checkoutSchema = yup.object().shape({
    customerUserName: yup.string().required("required"),
    password: yup.string().required("required"),
  });

  return (
    <Box m="20px">
      <Header title="CREATE" subtitle="Create a New Customer Users" />

      <Formik
        initialValues={initialValues}
        validationSchema={checkoutSchema}
        onSubmit={(values, { setSubmitting }) => {
          handleFormSubmit(values);
          setSubmitting(false);
        }}
      >
        {({ errors, touched, handleChange, handleBlur, isSubmitting }) => (
          <Form>
            <Box display="grid" gap="30px" gridTemplateColumns="repeat(4, minmax(0, 1fr)">
              <Field
                as={TextField}
                fullWidth
                variant="filled"
                type="text"
                label="Customer User Token ID"
                name="customerUserTokenId"
                onBlur={handleBlur}
                onChange={handleChange}
                value={initialValues.customerUserTokenId} // Use the value from initialValues
                InputProps={{ readOnly: true }} // Make it read-only
                error={touched.customerUserTokenId && !!errors.customerUserTokenId}
                helperText={touched.customerUserTokenId && errors.customerUserTokenId}
              />
              <Field
                as={TextField}
                fullWidth
                variant="filled"
                type="text"
                label="Customer User Name"
                name="customerUserName"
                onBlur={handleBlur}
                onChange={handleChange}
                error={touched.customerUserName && !!errors.customerUserName}
                helperText={touched.customerUserName && errors.customerUserName}
              />
              <Field
                as={TextField}
                fullWidth
                variant="filled"
                type="password"
                label="Password"
                name="password"
                onBlur={handleBlur}
                onChange={handleChange}
                error={touched.password && !!errors.password}
                helperText={touched.password && errors.password}
              />
            </Box>
            <Box display="flex" justifyContent="end" mt="20px">
              <Button type="submit" color="secondary" variant="contained" disabled={isSubmitting}>
                Create New CustomerUser
              </Button>
            </Box>
          </Form>
        )}
      </Formik>
      <ToastContainer/>
    </Box>
  );
};

export default Create;