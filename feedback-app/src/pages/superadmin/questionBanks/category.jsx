import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import { getAllCategories } from '../../../services/superadmin';
import { GridExpandMoreIcon } from '@mui/x-data-grid';
import { tokens } from '../../../theme';
import { useTheme } from '@emotion/react';
import Header from '../../../components/Header';
import Index from './index';

export default function Category() {
    const [rows, setRows] = React.useState([]);
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);


    React.useEffect(() => {
        async function fetchData() {
            try {
                const data = await getAllCategories();
                setRows(data);
            } catch (error) {
                console.error('Error fetching question banks:', error);
            }
        }
        fetchData();
    }, []);

    return (
        <div style={{ overflowY: 'auto', maxHeight: 'calc(100vh - 100px)' }}>
            <Box m="20px" >
            <Header title="QUESTION BANKS" subtitle="Manage all question banks CATEGORY-WISE" />

                <Box >
                    {rows.map((row) => (
                        <Accordion key={row.questionCategoryId} sx={{maxHeight : '450px',backgroundColor : colors.grey[800]}} >
                            <AccordionSummary expandIcon={<GridExpandMoreIcon />}>
                                <Typography>{row.categoryName}</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Index questionCategoryId={row.questionCategoryId}/>
                            </AccordionDetails>
                        </Accordion>
                    ))}
                </Box>
            </Box>
        </div>
    );
}