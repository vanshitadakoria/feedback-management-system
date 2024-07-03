import React, { useEffect, useState } from 'react';
import { Formik, Form, Field } from 'formik';
import Header from '../../../components/Header';
import { useTheme } from '@emotion/react';
import { tokens } from '../../../theme';
import * as yup from "yup";
import { Box, Button, Grid, Rating, Typography, TextField, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import { Link, useParams } from 'react-router-dom';
import { getQuestionnaireById } from '../../../services/customeradmin';
import { postFeedbackDetails, postFeedbackMaster } from '../../../services/customeruser';
import { getAllCategories } from '../../../services/superadmin';
import { GridExpandMoreIcon } from '@mui/x-data-grid';
import { getCurrentLoggedInUser } from '../../../services/authentication';

export default function FeedbackForm() {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const { id } = useParams();
    const [questionnaire, setQuestionnaire] = useState(null);
    const [questionsByCategory, setQuestionsByCategory] = useState({});
    const [allCategories, setAllCategories] = useState(null);

    const customerUserId = getCurrentLoggedInUser().customerUserId;

    useEffect(() => {
        const fetchDataFromApi = async () => {
            try {
                const apiData = await getQuestionnaireById(id);
                setQuestionnaire(apiData);
            } catch (error) {
                console.error('Error fetching questionnaire:', error);
            }
        };
        fetchDataFromApi();
    }, [id]);

    useEffect(() => {
        // const fetchDataFromApi = async () => {
        //     try {




        //         const questions = questionnaire.questionnaireQuestions || [];
        //         const groupedQuestions = {};
        //         questions.forEach(question => {
        //             const { category } = question.question.questionCategory.categoryName;
        //             if (!groupedQuestions[category]) {
        //                 groupedQuestions[category] = [];
        //             }
        //             groupedQuestions[category].push(question.question);
        //         });
        //         // Sort questions by serial number within each category
        //         Object.keys(groupedQuestions).forEach(category => {
        //             groupedQuestions[category].sort((a, b) => a.serialNo - b.serialNo);
        //         });
        //         console.log("groupedQuestions:", groupedQuestions);

        //         setQuestionsByCategory(groupedQuestions);
        //         console.log("groupedQuestions:", groupedQuestions);
        //     } catch (error) {
        //         console.error('Error setting questions by category:', error);
        //     }
        // };
        // fetchDataFromApi();

        const fetchData = async () => {
            try {
                const data = await getAllCategories(); // Fetch all categories
                setAllCategories(data);
                console.log("all c : ", allCategories);

            } catch (error) {
                console.error('Error fetching all categories :', error);
            }
        };
        fetchData();



    }, [questionnaire]);

    if (!questionnaire) {
        return <div>Loading...</div>;
    }

    // Group questions by category
    const groupedQuestions = {};
    questionnaire.questionnaireQuestions.forEach(questionnaireQuestion => {
        const category = questionnaireQuestion.question.questionCategory.categoryName;
        if (!groupedQuestions[category]) {
            groupedQuestions[category] = [];
        }
        //groupedQuestions[category].push(questionnaireQuestion.question);
        groupedQuestions[category].push({
            ...questionnaireQuestion.question,
            serialNo: questionnaireQuestion.serialNo, // Included serialNo 
        });
    });

    // Sorting categorized questions based on serialNo
    Object.keys(groupedQuestions).forEach(category => {
        groupedQuestions[category].sort((a, b) => a.serialNo - b.serialNo);
    });

    const getCurrentDate = () => {
        const today = new Date();
        const dd = String(today.getDate()).padStart(2, '0');
        const mm = String(today.getMonth() + 1).padStart(2, '0'); // January is 0!
        const yyyy = today.getFullYear();
      
        return `${yyyy}-${mm}-${dd}`;
      };

    // const checkoutSchema = yup.object().shape({
    //     name: yup.string().required("* required"),
    //     contactNo: yup.string().required("* required"),
    //     dob: yup.string().required("* required"),
    // });

    const handleFormSubmit = async (values) => {

        var personalData = {
            personName: values.name,
            personContactNo: values.contactNo,
            dateOfBirth: values.dob,
            questionnaireId: id,
            customerUserId: customerUserId,
        }
        console.log("personalData :", personalData);

        try {
            var feedbackMaster = await postFeedbackMaster(personalData)
            console.log("postFeedbackMaster :", feedbackMaster);
            var ratings = questionnaire.questionnaireQuestions.map((question, index) => ({
                feedBackMasterId: feedbackMaster.feedbackMasterId,
                // feedBackMasterId: 1,
                questionId: question.questionId,
                responseRating: values[`rating-${question.questionId}`]
            }));
            console.log("ratings :", ratings);

            var promises = ratings.map(async (rating) => {
                try {
                    var feedbackDetails = await postFeedbackDetails(rating);
                    console.log("postFeedbackDetails :", feedbackDetails);
                } catch (error) {
                    console.error('Error posting feedback details:', error);
                }
            });

            await Promise.all(promises);
            // Refresh the page after all POST requests are successful
            window.location.reload();
        } catch (error) {
            console.error('Error posting feedback master:', error);
        }

    }

    return (
        <div>
            <Box m="20px">
                <Header
                    title="Collect Feedback"
                    subtitle="Fill up the feedback form"
                />
                <Box height='540px' overflow='auto' mt={1}>
                    <Formik
                        initialValues={{
                            name: '',
                            contactNo: '',
                            dob: '',
                            ratings: Array(questionnaire.questionnaireQuestions.length).fill(0)
                        }}
                        // validationSchema={checkoutSchema}
                        onSubmit={(values) => {
                            // Handle form submission here
                            handleFormSubmit(values);
                        }}
                    >
                        {({ values, errors, touched, handleBlur, handleChange }) => (
                            <Form>

                                <Box
                                    sx={{
                                        border: '2px solid',
                                        borderColor: colors.primary[200],
                                        borderRadius: '10px',
                                        padding: '20px',
                                        position: 'relative',
                                        margin: '10px',
                                        marginTop: '20px'
                                    }}
                                >
                                    <Typography variant="h4"
                                        position="absolute"
                                        top={-20}
                                        bgcolor={colors.grey[100]}
                                        padding={1}
                                        color={colors.greenAccent[700]}
                                        borderRadius="10px"
                                    >
                                        Personal Details
                                    </Typography>
                                    {/* Use Field components from Formik */}
                                    <Box key="personal-details" mb={2} mt={2}>
                                        <Grid container spacing={2}>
                                            <Grid item xs={12} md={12}>
                                                <Field
                                                    as={TextField}
                                                    id="name"
                                                    label="Name"
                                                    variant="filled"
                                                    fullWidth
                                                    value={values.name}
                                                    onChange={handleChange}
                                                    error={touched.name && !!errors.name}
                                                    helperText={touched.name && errors.name}
                                                />
                                            </Grid>
                                            <Grid item xs={12} md={6}>
                                                <Field
                                                    as={TextField}
                                                    id="contactNo"
                                                    label="Contact Number"
                                                    variant="filled"
                                                    fullWidth
                                                    value={values.contactNo}
                                                    onChange={handleChange}
                                                    error={touched.contactNo && !!errors.contactNo}
                                                    helperText={touched.contactNo && errors.contactNo}
                                                />
                                            </Grid>

                                            <Grid item xs={12} md={6}>
                                                <Field
                                                    as={TextField}
                                                    id="dob"
                                                    label="Date of Birth"
                                                    type="date"
                                                    variant="filled"
                                                    fullWidth
                                                    value={values.dob}
                                                    onChange={handleChange}
                                                    error={touched.dob && !!errors.dob}
                                                    helperText={touched.dob && errors.dob}
                                                    InputLabelProps={{ shrink: true }} // Ensures label shrinks when value is entered
                                                    placeholder="Select Date of Birth"
                                                    InputProps={{ inputProps: { max: getCurrentDate() } }}
                                                />
                                            </Grid>
                                        </Grid>
                                    </Box>
                                </Box>


                                {/* Map through other questions */}
                                <Box
                                    sx={{
                                        border: '2px solid',
                                        borderColor: colors.primary[200],
                                        borderRadius: '10px',
                                        padding: '20px',
                                        position: 'relative',
                                        margin: '10px',
                                        marginTop: '30px'
                                    }}
                                >
                                    <Typography variant="h4"
                                        position="absolute"
                                        top={-20}
                                        bgcolor={colors.grey[100]}
                                        padding={1}
                                        color={colors.greenAccent[700]}
                                        borderRadius="10px"
                                    >
                                        Feedback Collection
                                    </Typography>
                                    {console.log("sorted :",groupedQuestions)}
                                    {questionnaire.questionnaireQuestions.length === 0 ? (
                                        <Typography variant="h5" mt={2} mb={2}>No questions found...</Typography>
                                    ) : (

                                        <Box height='100%' overflow='auto' mt='20px'>
                                            {Object.keys(groupedQuestions).map((categoryName, index) => (
                                                <Accordion defaultExpanded key={index} sx={{ maxHeight: '50vh', overflowY: 'auto', backgroundColor: colors.grey[800], borderBottom: '1px solid' }}>
                                                    <AccordionSummary expandIcon={<GridExpandMoreIcon />}>
                                                        <Typography variant='h4'>{categoryName}</Typography>
                                                    </AccordionSummary>
                                                    <AccordionDetails>
                                                        {/* Render DataGrid component for each category */}
                                                        {groupedQuestions[categoryName]?.map((category, categoryIndex) => (
                                                            <Box key={categoryIndex} mb={2} mt={2}>
                                                                <Typography variant="h5"> {category.questionText}</Typography>

                                                                {/* Add Rating input */}
                                                                <Field as={Rating} name={`rating-${category.questionId}`} defaultValue={0} max={5} precision={1} size='large' />
                                                            </Box>
                                                        ))}
                                                    </AccordionDetails>
                                                </Accordion>
                                            ))}
                                        </Box>
                                    )}
                                    {questionnaire.questionnaireQuestions.length > 0 && <Button type='submit' variant="contained" sx={{ fontWeight: 'bolder', marginTop: '20px' }} color="secondary">Submit Feedback</Button>}
                                </Box>
                                {/* <Button type='submit' variant="contained" sx={{ fontWeight: 'bolder' }} color="secondary">Submit Feedback</Button> */}
                            </Form>
                        )}
                    </Formik>
                </Box>
            </Box>
        </div>
    );
}
