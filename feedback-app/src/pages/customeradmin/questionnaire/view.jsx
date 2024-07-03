import React, { useState, useEffect } from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { getQuestionnaireBankById } from '../../../services/superadmin';
import { useParams } from 'react-router-dom';
import { Box, ListItemIcon, colors } from '@mui/material';
import Header from '../../../components/Header';
import { useTheme } from '@emotion/react';
import { tokens } from '../../../theme';
import { getQuestionnaireById } from '../../../services/customeradmin';

function View() {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const { id } = useParams();
    const [questionnaire, setQuestionnaire] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getQuestionnaireById(id); // Fetch questionnaire bank data
                setQuestionnaire(data);

            } catch (error) {
                console.error('Error fetching questionnaire :', error);
            }
        };
        fetchData();
    }, [id]);

    const handleTabClick = (category) => {
        setSelectedCategory(category);
    };

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
        groupedQuestions[category].push(questionnaireQuestion.question);
    });

    // Get unique categories (category names)
    const categories = Object.keys(groupedQuestions);
    
    return (
        <Box m="20px">
            <Header
                title={questionnaire.questionnaireTitle}
                subtitle="Details"
            />
            <Box >
                <Tabs
                    indicatorColor="primary" // Set the indicator color to primary
                    textColor="primary" // Set the text color to primary
                    onChange={(event, newValue) => handleTabClick(newValue)}
                    sx={{
                        '& .MuiTabs-indicator': {
                          backgroundColor: 'white', // Example color
                        },
                      }}
                >
                    {categories.map((category, index) => (
                        <Tab key={index} label={category} value={category} sx={{ color: colors.grey[200],borderBottom:'5px solid white', fontSize: '10pt', fontWeight: 'bolder' }} />
                    ))}
                </Tabs>
                {selectedCategory && (
                    <TabPanel category={selectedCategory} questions={groupedQuestions[selectedCategory]} />
                )}
            </Box>
        </Box>
    );

    function TabPanel({ category, questions }) {
        return (
            <Box marginTop="20px" 
                 sx={{
                        backgroundColor:colors.blueAccent[800],
                        borderRadius:5,
                        padding:'10px 30px',
                        fontSize:'11pt',
                        overflowY:'auto',
                        height:'60vh' 
                    }}>
                <h2>Questions of {category} Category</h2>
                {questions.map(question => (
                    <Box key={question.questionBankId} >
                        
                        <Box
                            sx={{
                                borderBottom:'2px solid',
                                borderColor:colors.blueAccent[200],
                                boxShadow:'50%',
                                padding:2,
                                backgroundColor:colors.grey[700],
                                borderRadius:'0 0 10px 10px',
                                color:colors.primary[100]
                            }}
                        >
                           {question.questionText}
                        </Box>
                      
                    </Box> 
                ))}
            </Box>
        );
    }

}
export default View;
