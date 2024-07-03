import React, { useState, useEffect } from 'react';
import { deleteQuestionBank, deleteQuestionnaireQuestionBankByQuestionBankId, getAllCategories, getQuestionnaireBankById } from '../../../services/superadmin';
import { useParams } from 'react-router-dom';
import { Accordion, AccordionDetails, AccordionSummary, Box, Button, Checkbox, FormControlLabel, ListItemIcon, Modal, Typography, colors } from '@mui/material';
import Header from '../../../components/Header';
import { useTheme } from '@emotion/react';
import { tokens } from '../../../theme';
import { getCategoryByName } from '../../../services/customeradmin';
// import Category from './category';
import { GridAddIcon, GridExpandMoreIcon } from '@mui/x-data-grid';
import CreateQuestionBank from './createQuestionBank';

function SingleQuestionnaireBank() {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const { id } = useParams();
    const [questionnaire, setQuestionnaire] = useState(null);
    const [fetchedCategories, setFetchedCategories] = React.useState({});
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [allCategories, setAllCategories] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // const [selectedCategory, setSelectedCategory] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getQuestionnaireBankById(id); // Fetch questionnaire data
                setQuestionnaire(data);
                console.log("qb : ", questionnaire);
                console.log("qbid : ", id);

            } catch (error) {
                console.error('Error fetching questionnaire bank :', error);
            }
        };
        fetchData();
    }, [id]);

    useEffect(() => {
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
    }, []);


    useEffect(() => {
        async function fetchCategoryData() {
            try {
                const fetchedCategoriesObject = {};
                await Promise.all(
                    categories.map(async c => {
                        const category = await getCategoryByName(c);
                        fetchedCategoriesObject[c] = category; // Assign category object to its name
                    })
                );
                setFetchedCategories(fetchedCategoriesObject);
                console.log("fetchedCategories asc:", fetchedCategories);
                console.log("groupedQuestions :", groupedQuestions);

            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        }
        fetchCategoryData();
    }, [questionnaire]);

    if (!questionnaire) {
        return <div>Loading...</div>;
    }

    // Group questions by category
    const groupedQuestions = {};
    questionnaire.questionnaireQuestionBanks.forEach(questionnaireQuestionBank => {
        // console.log("qb : ",questionnaireBank);

        const category = questionnaireQuestionBank.questionBank.questionCategory.categoryName;
        if (!groupedQuestions[category]) {
            groupedQuestions[category] = [];
        }
        // groupedQuestions[category].push(questionnaireQuestionBank.questionBank);
        groupedQuestions[category].push({
            ...questionnaireQuestionBank.questionBank,
            serialNo: questionnaireQuestionBank.serialNo, // Included serialNo 
        });
    });

    const handleAddCategory = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const handleCategorySelection = (c) => (event) => {
        const categoryName = c.categoryName;
        if (event.target.checked) {
            //console.log(c);
            const newObj = {}
            newObj[c.categoryName] = [c];
            // console.log("c", newObj);

            setFetchedCategories(prevState => ({
                ...prevState,
                [categoryName]: [c], // Add the category to fetchedCategories
            }));
        } else {
            // console.log("unchecked",c);
            removeCategory(c);
        }
    };


    const removeCategory = async (c) => {
        console.log(groupedQuestions[c.categoryName]);

        const questions = groupedQuestions[c.categoryName];
        questions?.map(async q => {
            const response = await deleteQuestionnaireQuestionBankByQuestionBankId(q.questionBankId);
            console.log(response);

            const deleteResponse = await deleteQuestionBank(q.questionBankId);
            console.log(deleteResponse);
        });
        // Remove the category from fetchedCategories
        setFetchedCategories((prevState) => {
            const newState = { ...prevState };
            delete newState[c.categoryName];
            return newState;
        });
    }

    const handleConfirmSelection = () => {
        // console.log(fetchedCategories);
        setIsModalOpen(false);
    };

    // Get unique categories (category names)
    const categories = Object.keys(groupedQuestions);

    return (
        <Box m="20px">
            <Header
                title={questionnaire.questionnaireBankTitle}
                subtitle="Details"
            />
            <Box display="flex" alignItems="center">
                {/* Add Category Button */}
                <Button variant="contained"
                    onClick={handleAddCategory}
                    sx={{
                        backgroundColor: colors.grey[200],
                        color: colors.primary[400],
                        fontWeight: 'bolder',
                        marginBottom: '10px',
                    }}
                >
                    <GridAddIcon /> Add Category
                </Button>
            </Box>

            <Modal
                open={isModalOpen}
                onClose={handleCloseModal}
                aria-labelledby="add-category-modal-title"
                aria-describedby="add-category-modal-description"
            >
                <Box
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        bgcolor: 'background.paper',
                        boxShadow: 24,
                        p: 4,
                        minWidth: 300,
                        maxWidth: 600,
                    }}
                >
                    <Typography
                        id="add-category-modal-title"
                        variant="h6"
                        component="h1"
                        sx={{
                            borderBottom: '1px solid white',
                            paddingBottom: '5px',
                            fontSize: '12pt'
                        }}
                    >
                        Add Category
                    </Typography>
                    <Box
                        display='flex'
                        flexDirection='column'
                        sx={{
                            overflowY: 'scroll',
                            maxHeight: '300px',
                        }}
                    >


                        {allCategories && allCategories.map((c, index) => (
                            <FormControlLabel
                                key={c.questionCategoryId}
                                control={
                                    <Checkbox
                                        checked={fetchedCategories.hasOwnProperty(c.categoryName)}
                                        // checked={categories.includes(c.categoryName)}
                                        onChange={handleCategorySelection(c)}
                                    // disabled={categories.includes(c.categoryName)}
                                    />
                                }
                                label={c.categoryName}
                            />
                        ))}
                    </Box>
                    <Box mt={2} display="flex" justifyContent="space-between">
                        <Button variant="contained" sx={{ backgroundColor: colors.grey[200], color: colors.primary[500] }} onClick={handleConfirmSelection}>Confirm</Button>
                        <Button variant="contained" sx={{ backgroundColor: colors.grey[200], color: colors.primary[500] }} onClick={handleCloseModal}>Close</Button>
                    </Box>
                </Box>
            </Modal>
            <Box >
                <Box height='500px' overflow='auto'>
                    {Object.keys(fetchedCategories).map((categoryName, index) => (
                        <Accordion key={index} sx={{ maxHeight: '450px', backgroundColor: colors.grey[800], borderBottom: '1px solid' }}>
                            <AccordionSummary expandIcon={<GridExpandMoreIcon />}>
                                <Typography>{categoryName}</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                {/* <h2>{categoryName}</h2>

                                        {groupedQuestions[categoryName]?.map(question => (
                                            <Typography key={question.questionBankId}>
                                                {question.questionText}
                                            </Typography>
                                        ))} */}

                                {/* Render DataGrid component for each category */}
                                {fetchedCategories[categoryName]?.map((category, categoryIndex) => (
                                    <CreateQuestionBank questionCategoryId={category.questionCategoryId} questions={groupedQuestions[categoryName]} questionnaireBankId={id} />
                                ))}
                            </AccordionDetails>
                        </Accordion>
                    ))}
                </Box>
                {/* </div> */}
            </Box>
        </Box>
    );
}
export default SingleQuestionnaireBank;
