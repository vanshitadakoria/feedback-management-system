import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import { GridExpandMoreIcon } from '@mui/x-data-grid';
import { tokens } from '../../../theme';
import { useTheme } from '@emotion/react';
import Header from '../../../components/Header';
import { getCategoryByName } from '../../../services/customeradmin';
import Create from '../questions/create';

export default function Category({ categories, groupedQuestions }) {
    const [rows, setRows] = React.useState([]);
    const [fetchedCategories, setFetchedCategories] = React.useState({});
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    // const [category, setCategory] = React.useState(null);

    React.useEffect(() => {
        async function fetchData() {
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
        fetchData();
    }, []);

    return (
        <div style={{ overflowY: 'auto', maxHeight: 'calc(100vh - 100px)' }}>
            <Box m="20px">
                {/* <Header title="QUESTIONS" subtitle="Manage all question CATEGORY-WISE" /> */}

                <Box>
                    {Object.keys(fetchedCategories).map((categoryName, index) => (
                        <Accordion key={index} sx={{ maxHeight: '50vh', overflowY: 'auto', backgroundColor: colors.grey[800], borderBottom: '1px solid' }}>
                            <AccordionSummary expandIcon={<GridExpandMoreIcon />}>
                                <Typography>{categoryName}</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <h2>{categoryName}</h2>

                                {groupedQuestions[categoryName]?.map(question => (
                                    <Typography key={question.questionBankId}>
                                        {question.questionText}
                                    </Typography>
                                ))}

                                {/* Render DataGrid component for each category */}
                                {fetchedCategories[categoryName]?.map((category, categoryIndex) => (
                                    <Create questionCategoryId={category.questionCategoryId} questions={groupedQuestions[categoryName]} />
                                ))}
                            </AccordionDetails>
                        </Accordion>
                    ))}
                </Box>
            </Box>
        </div>
    );
}


{/* <h1>{fetchedCategories[categoryName][0].questionCategoryId}</h1> */ }

{/* {fetchedCategories[categoryName]?.map((category, categoryIndex) => (
                                    <div key={categoryIndex}>
                                        <Typography>
                                            {category.questionCategoryId}
                                        </Typography>
                                    </div>
                                ))} */}