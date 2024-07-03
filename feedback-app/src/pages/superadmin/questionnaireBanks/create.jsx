// import React, { useState, useEffect } from 'react';
// import { Box, Button, TextField, InputLabel, FormHelperText } from "@mui/material";
// import { Formik, Form, Field, ErrorMessage } from "formik";
// import * as yup from "yup";
// import Header from "../../../components/Header";
// import MenuItem from '@mui/material/MenuItem';
// import FormControl from '@mui/material/FormControl';
// import ListItemText from '@mui/material/ListItemText';
// import Select from '@mui/material/Select';
// import Checkbox from '@mui/material/Checkbox';
// import { getAllCategories, postQuestionnaireBank, postQuestionnaireQuestionBank } from '../../../services/superadmin';

// const Create = () => {
//     const [categories, setCategories] = useState([]);
//     const [selectedCategories, setSelectedCategories] = useState([]);
//     const [questionBankIds, setQuestionBankIds] = useState([]);
//     const [newQuestionnaireBank, setNewQuestionnaireBank] = useState({
//         questionnaireBankTitle: '',
//         superAdminId: 1
//     });

//     useEffect(() => {
//         const fetchDataFromApi = async () => {
//             try {
//                 const apiData = await getAllCategories();
//                 console.log(apiData);
//                 setCategories(apiData);
//             } catch (error) {
//                 console.error('Error fetching categories :', error);
//             }
//         };
//         fetchDataFromApi();
//     }, []);

//     const initialValues = {
//         questionnaireBankTitle: "",
//         category: []
//     };

//     const checkoutSchema = yup.object().shape({
//         questionnaireBankTitle: yup.string().required("* required"),
//         category: yup.array().min(1, "* Select at least one category").required("* required")
//     });

//     const handleFormSubmit = async (values) => {
//         console.log("submitted");
//         console.log(values);

//         const updatedQuestionnaireBank = {
//             ...newQuestionnaireBank,
//             questionnaireBankTitle : values.questionnaireBankTitle
//         };

//         const categoryIds = selectedCategories.map(cName => categories.find(c => c.categoryName == cName).questionCategoryId);

//         const questionIds = categoryIds.flatMap(categoryId =>
//             categories.find(category => category.questionCategoryId === categoryId)?.questionBanks.map(question => question.questionBankId)
//         );
//         setQuestionBankIds(questionIds);

//         try {

//             const apiData = await postQuestionnaireBank(updatedQuestionnaireBank);
//             const response = await postQuestionnaireQuestionBank(apiData.questionnaireBankId,questionIds);
//             console.log(apiData);
//             console.log(response);
            
//         } catch (error) {
//             console.error('Error posting newQuestionnaireBank :', error);
//         }
//     };


//     return (
//         <Box m="20px">
//             <Header title="CREATE" subtitle="Create a New QUESTIONNAIRE BANK" />

//             <Formik
//                 initialValues={initialValues}
//                 validationSchema={checkoutSchema}
//                 onSubmit={(values, { setSubmitting }) => {
//                     handleFormSubmit(values);
//                     setSubmitting(false);
//                 }}
//             >
//                 {({ values, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitting }) => (
//                     <Form onSubmit={handleSubmit}>
//                         <Box display="grid" gap="30px" gridTemplateColumns="repeat(4, minmax(0, 1fr)">
//                             <Field
//                                 as={TextField}
//                                 fullWidth
//                                 variant="filled"
//                                 type="text"
//                                 label="Title"
//                                 name="questionnaireBankTitle"
//                                 error={touched.questionnaireBankTitle && !!errors.questionnaireBankTitle}
//                                 helperText={touched.questionnaireBankTitle && errors.questionnaireBankTitle}
//                             />

//                             <FormControl fullWidth variant='filled' >
//                                 <InputLabel id="demo-simple-select-label">Category</InputLabel>
//                                 <Field
//                                     as={Select}
//                                     labelId="demo-simple-select-label"
//                                     id="demo-simple-select"
//                                     multiple
//                                     name="category"
//                                     value={selectedCategories}
//                                     onChange={(event) => {
//                                         setSelectedCategories(event.target.value);
//                                         handleChange(event);
//                                     }}
//                                     onBlur={handleBlur}
//                                     renderValue={(selected) => selected.join(', ')}
//                                     error={touched.category && !!errors.category}
//                                     MenuProps={{
//                                         PaperProps: {
//                                             style: {
//                                                 maxHeight: 200,
//                                             },
//                                         },
//                                     }}
//                                 >
//                                     {categories.map((category) => (
//                                         <MenuItem key={category.questionCategoryId} value={category.categoryName} >
//                                             <Checkbox checked={selectedCategories.indexOf(category.questionCategoryId) > -1} />
//                                             <ListItemText primary={category.categoryName} />
//                                         </MenuItem>
//                                     ))}
//                                 </Field>
//                                 {touched.category && errors.category && (
//                                     <FormHelperText style={{ color: 'red' }}>{errors.category}</FormHelperText>
//                                 )}
//                             </FormControl>
//                         </Box>
//                         <Box display="flex" justifyContent="end" mt="20px">
//                             <Button type="submit" color="secondary" variant="contained" disabled={isSubmitting}>
//                                 Create New QuestionnaireBank
//                             </Button>
//                         </Box>
//                     </Form>
//                 )}
//             </Formik>
//             {/* {formSubmitted && (
//                 <QuestionBanks
//                     title={title}
//                     selectedCategories={selectedCategories}
//                 />
//             )} */}
//         </Box>
//     );
// };

// export default Create;
