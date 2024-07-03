import React, { useEffect, useState } from 'react';
import { Box, TextField, Button, Typography, Grid, Select, ListItemText, InputLabel, MenuItem, FormControl, colors, ThemeProvider, Container, CssBaseline, createTheme } from '@mui/material';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { getAllOrganizationNatures, postCustomerAdmin } from '../../services/superadmin';
import Image from '../../images/bg1.jpg';

const defaultTheme = createTheme();

const Register = () => {
    const { subscriptionCategoryId } = useParams();
    const [rows, setRows] = useState([]);
    const navigate = useNavigate();


    useEffect(() => {
        const getApiData = async () => {
            const organizationNatures = await getAllOrganizationNatures();
            setRows(organizationNatures);
        };
        getApiData();
    }, []);

    const phoneRegExp = /^\d{10}$/;

    const validationSchema = Yup.object().shape({
        organizationName: Yup.string().required('Organization Name is required'),
        officialEmailId: Yup.string().email('Invalid email').required('Email is required'),
        password: Yup.string().min(6, 'Password must be at least 6 characters').max(10, 'Password cannot exceed 10 characters').required('Password is required'),
        contactNo: Yup
            .string()
            .matches(phoneRegExp, "Phone number is not valid")
            .required("Contact number is required"),
        organizationNatureId: Yup.number().required('Organization Nature ID is required'),
    });

    // const validationSchema = Yup.object().shape({
    //     organizationName: Yup.string().required('Organization Name is required'),
    //     officialEmailId: Yup.string().email('Invalid email').required('Email is required'),
    //     password: Yup.string().required('Password is required'),
    //     contactNo: Yup.string().required('Contact Number is required'),
    //     organizationNatureId: Yup.number().required('Organization Nature ID is required'),
    // });

    const generateThreeDigitNumber = () => Math.floor(100 + Math.random() * 900);




    const [initialValues, setInitialValues] = useState({
        customerTokenId: generateThreeDigitNumber().toString(),
        organizationName: '',
        officialEmailId: '',
        password: '',
        contactNo: '',
        organizationNatureId: '',
        subscriptionCategoryId: subscriptionCategoryId,
    });

    const handleSubmit = (values) => {
        const newCustomerAdmin = {
            customerTokenId: values.customerTokenId,
            organizationName: values.organizationName,
            officialEmailId: values.officialEmailId,
            password: values.password,
            contactNo: values.contactNo,
            organizationNatureId: values.organizationNatureId,
            subscriptionCategoryId: 2,
        };
        postCustomerAdmin(newCustomerAdmin);
        navigate('/login');
    };

    return (
        <ThemeProvider theme={defaultTheme}>
            {/* // <Container component="main" maxWidth="100vh" m={0} > */}
            <CssBaseline />
            <Box
                sx={{
                    backgroundImage: `url(${Image})`,
                    minHeight: '100vh',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    position: 'relative',
                    backgroundSize: 'cover',
                    '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        right: 0,
                        bottom: 0,
                        left: 0,
                        backgroundColor: 'rgba(255, 255, 255, 0.5)', // Light overlay
                    },
                }}
            >
                <Box
                    sx={{
                        p: 5,
                        // backgroundColor: '#B2BEB5',
                        backgroundColor: '#E5E4E2',
                        borderRadius: 2,
                        boxShadow: 3,
                        maxWidth: 800,
                        width: '100%',
                        position: 'relative',
                        zIndex: 1
                    }}
                >
                    <Typography display='flex' justifyContent="center" variant="h4" marginBottom={2}>
                        FEEDBACK SYSTEM
                    </Typography>
                    <Typography display='flex' justifyContent="center" variant="h5" borderBottom='2px solid blue' marginBottom={4} paddingBottom={2}>
                        Organization Registration
                    </Typography>
                    <Formik
                        initialValues={initialValues}
                        validationSchema={validationSchema}
                        onSubmit={handleSubmit}
                    >
                        {({ errors, touched }) => (
                            <Form>
                                <Grid container spacing={2}>
                                    <Grid item xs={12} sm={6}>
                                        <Field
                                            as={TextField}
                                            fullWidth
                                            name="customerTokenId"
                                            label="Customer Token Id"
                                            error={touched.customerTokenId && Boolean(errors.customerTokenId)}
                                            helperText={touched.customerTokenId && errors.customerTokenId}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <Field
                                            as={TextField}
                                            fullWidth
                                            name="organizationName"
                                            label="Organization Name"
                                            error={touched.organizationName && Boolean(errors.organizationName)}
                                            helperText={touched.organizationName && errors.organizationName}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <Field
                                            as={TextField}
                                            fullWidth
                                            name="officialEmailId"
                                            type="email"
                                            label="Official Email ID"
                                            error={touched.officialEmailId && Boolean(errors.officialEmailId)}
                                            helperText={touched.officialEmailId && errors.officialEmailId}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <Field
                                            as={TextField}
                                            fullWidth
                                            name="password"
                                            type="password"
                                            label="Password"
                                            error={touched.password && Boolean(errors.password)}
                                            helperText={touched.password && errors.password}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <Field
                                            as={TextField}
                                            fullWidth
                                            name="contactNo"
                                            label="Contact Number"
                                            error={touched.contactNo && Boolean(errors.contactNo)}
                                            helperText={touched.contactNo && errors.contactNo}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <FormControl fullWidth error={touched.organizationNatureId && Boolean(errors.organizationNatureId)}>
                                            <InputLabel>Select Nature</InputLabel>
                                            <Field
                                                as={Select}
                                                fullWidth
                                                name="organizationNatureId"
                                                label="Organization Nature ID"
                                            >
                                                <MenuItem value="" disabled>
                                                    Select Nature
                                                </MenuItem>
                                                {rows.map((nature) => (
                                                    <MenuItem key={nature.organizationNatureId} value={nature.organizationNatureId}>
                                                        <ListItemText primary={nature.natureName} />
                                                    </MenuItem>
                                                ))}
                                            </Field>
                                            {touched.organizationNatureId && errors.organizationNatureId && (
                                                <Typography variant="caption" color="error">
                                                    {errors.organizationNatureId}
                                                </Typography>
                                            )}
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Button type="submit" variant="contained" color='primary' sx={{ color: "white" }} fullWidth>
                                            Register
                                        </Button>
                                    </Grid>
                                    <Grid item>
                                        <Link to='/login' variant="body2">
                                            {"Already have an account? Sign In"}
                                        </Link>
                                    </Grid>
                                </Grid>
                            </Form>
                        )}
                    </Formik>
                </Box>
            </Box>
            {/* // </Container> */}
        </ThemeProvider>
    );
};

export default Register;