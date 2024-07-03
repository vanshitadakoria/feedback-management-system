import React, { useState, useEffect } from 'react';
import { Box, Typography, Tabs, Tab } from '@mui/material';
import { GetFeedbackDetailsByCustomerAdminId, getQuestionByCategoryId, getQuestionsByCategoryId } from '../../../services/customeradmin';
import { getAllCategories } from '../../../services/superadmin';
import FullEditDataGrid from 'mui-datagrid-full-edit';
import { useTheme } from '@emotion/react';
import { tokens } from '../../../theme';
import Header from '../../../components/Header';
import { getCurrentLoggedInUser } from '../../../services/authentication';

const QuestionReport = () => {
    const [categories, setCategories] = useState([]);
    const [questions, setQuestions] = useState({});
    const [feedbackData, setFeedbackData] = useState([]);
    const [selectedTab, setSelectedTab] = useState(0);
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    const CustomerAdminId = getCurrentLoggedInUser().customerAdminId;

    useEffect(() => {
        const fetchCategoriesAndQuestions = async () => {
            try {
                const categories = await getAllCategories();
                const filteredCategories = [];
                const questions = {};

                for (const category of categories) {
                    const categoryQuestions = await getQuestionsByCategoryId(category.questionCategoryId, CustomerAdminId);
                    if (categoryQuestions.length > 0) {
                        filteredCategories.push(category);
                        questions[category.questionCategoryId] = categoryQuestions;
                    }
                }

                setCategories(filteredCategories);
                setQuestions(questions);
            } catch (error) {
                console.error('Error fetching data', error);
            }
        };

        fetchCategoriesAndQuestions();

        const fetchData = async () => {
            try {
                const response = await GetFeedbackDetailsByCustomerAdminId(CustomerAdminId);
                setFeedbackData(response);
                console.log("feedback data", response); // Log response instead of feedbackData
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    const countRatings = (feedbackDetails) => {
        const counts = Array(6).fill(0);
        feedbackDetails.forEach(detail => {
            if (detail.responseRating >= 0 && detail.responseRating <= 5) {
                counts[detail.responseRating]++;
            }
        });
        return counts;
    };

    const generateColumns = () => [
        { field: 'questionText', headerName: 'Question Text', width: 300 },
        { field: 'rating0', headerName: '0 Rating', width: 100 },
        { field: 'rating1', headerName: '1 Rating', width: 100 },
        { field: 'rating2', headerName: '2 Rating', width: 100 },
        { field: 'rating3', headerName: '3 Rating', width: 100 },
        { field: 'rating4', headerName: '4 Rating', width: 100 },
        { field: 'rating5', headerName: '5 Rating', width: 100 },
    ];

    const generateRows = (questions, feedbackData) => {
        // console.log("q :", questions);
        const rows = questions.map((question, index) => {
            const relevantFeedback = feedbackData.filter(feedback => feedback.questionId === question.questionId);
            const ratingCounts = countRatings(relevantFeedback);
            return {
                id: index,
                questionText: question.questionText,
                rating0: ratingCounts[0],
                rating1: ratingCounts[1],
                rating2: ratingCounts[2],
                rating3: ratingCounts[3],
                rating4: ratingCounts[4],
                rating5: ratingCounts[5],
            };
        });

        const totals = rows.reduce((acc, row) => {
            return {
                rating0: acc.rating0 + row.rating0,
                rating1: acc.rating1 + row.rating1,
                rating2: acc.rating2 + row.rating2,
                rating3: acc.rating3 + row.rating3,
                rating4: acc.rating4 + row.rating4,
                rating5: acc.rating5 + row.rating5,
            };
        }, { rating0: 0, rating1: 0, rating2: 0, rating3: 0, rating4: 0, rating5: 0 });

        rows.push({
            id: 'total',
            questionText: 'Total Rating',
            ...totals,
        });

        return rows;
    };

    const handleTabChange = (event, newValue) => {
        setSelectedTab(newValue);
    };

    return (
            <Box m="20px">
                <Header
                    title="Question Reports"
                    subtitle="List of Questions and their Responses"
                />
                <Box width="100%" >
                <Tabs
                        indicatorColor="secondary"
                        textColor="secondary"
                        value={selectedTab}
                        onChange={handleTabChange}
                    >
                        {categories.map((category, index) => (
                            <Tab
                                color='secondary'
                                key={category.questionCategoryId}
                                label={category.categoryName}
                                sx={{ textTransform: 'none', fontSize: 14 }}
                            />
                        ))}
                    </Tabs>
                    <Box
                        // height="20vh"
                        // marginTop={2}
                        sx={{

                            "& .MuiDataGrid-root": {
                                border: "none",
                            },
                            "& .MuiDataGrid-cell": {
                                borderBottom: "none",
                                fontSize: 14,
                            },
                            "& .name-column--cell": {
                                color: colors.greenAccent[300],
                            },
                            "& .MuiDataGrid-columnHeaders": {
                                backgroundColor: colors.blueAccent[700],
                                borderBottom: "none",
                                fontSize: 14,
                            },
                            "& ::-webkit-scrollbar": {
                                width: '0px',
                                background: 'transparent', /* make scrollbar transparent */
                            },
                            "& .MuiDataGrid-virtualScroller": {
                                maxHeight: '250px',
                                width: 'inherit',
                                overflowY: 'auto !important',
                                overflowX: 'hidden !important',

                                backgroundColor: colors.primary[400],
                            },
                            "& .MuiDataGrid-footerContainer": {
                                borderTop: "none",
                                backgroundColor: colors.blueAccent[700],
                            },
                            "& .MuiCheckbox-root": {
                                color: `${colors.greenAccent[200]} !important`,
                            },
                            "& .MuiDataGrid-toolbarContainer": {
                                display: 'none'
                            },
                            "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
                                color: `${colors.grey[100]} !important`,
                            },
                        }}
                    >
                        {categories.length > 0 && questions[categories[selectedTab].questionCategoryId] && (
                            <FullEditDataGrid

                                rows={generateRows(questions[categories[selectedTab].questionCategoryId] || [], feedbackData)}
                                columns={generateColumns()}
                                noActionColumn
                            />
                        )}
                    </Box>
                </Box>
            </Box>
    );
};

export default QuestionReport;