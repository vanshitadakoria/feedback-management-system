import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Typography, Accordion, AccordionSummary, AccordionDetails, Grid, TextField } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import FullEditDataGrid from 'mui-datagrid-full-edit';
import { GetFeedbackMasterById } from '../../../services/customeradmin';
import { useTheme } from '@emotion/react';
import { tokens } from '../../../theme';
import Header from '../../../components/Header';
import { Formik, Form, Field } from 'formik';

const SingleEndUserDetail = () => {
  const { feedbackMasterId } = useParams();
  const [feedbackDetails, setFeedbackDetails] = useState(null);
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const responsedata = await GetFeedbackMasterById(feedbackMasterId);
        setFeedbackDetails(responsedata);
        console.log("response", feedbackDetails);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [feedbackMasterId]);

  if (!feedbackDetails) {
    return <Typography>Loading...</Typography>;
  }

  const { feedbackDetails: detailsArray } = feedbackDetails;

  // Group questions by category
  const groupedByCategory = detailsArray.reduce((acc, detail) => {
    const categoryName = detail.question.questionCategory.categoryName;
    if (!acc[categoryName]) {
      acc[categoryName] = [];
    }
    acc[categoryName].push(detail);
    return acc;
  }, {});

  const generateColumns = () => [
    { field: 'questionText', headerName: 'Question Text', flex: 1 },
    { field: 'responseRating', headerName: 'Response Rating', flex: 1 },
  ];

  const generateRows = (details) => details.map((detail, index) => ({
    id: index,
    questionText: detail.question.questionText,
    responseRating: detail.responseRating,
  }));

  return (
    <Box m="20px">
      <Header
        title="Single User Report"
        subtitle="Show Rating Each Question Category wise"
      />
      <Box height='auto' overflow='auto' mt={1}>
        <Formik>
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
                        value={feedbackDetails.personName || 'NA'}
                        InputProps={{ readOnly: true }}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Field
                        as={TextField}
                        id="contactNo"
                        label="Contact Number"
                        variant="filled"
                        fullWidth
                        value={feedbackDetails.personContactNo || 'NA'}
                        InputProps={{ readOnly: true }}
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
                        value={feedbackDetails.dateOfBirth || 'NA'}
                        InputProps={{ readOnly: true }}
                        InputLabelProps={{ shrink: true }} // Ensures label shrinks when value is entered
                        placeholder="Select Date of Birth"
                      />
                    </Grid>
                  </Grid>
                </Box>
              </Box>
            </Form>
          )}
        </Formik>
      </Box>
      <Box
        m="10px 0 0 0"
        height="40vh"
        overflow='auto'
        width="96%"
        sx={{
          "& .MuiDataGrid-root": {
            border: "none",
          },
          "& .MuiDataGrid-cell": {
            borderBottom: "none",
            fontSize: 14,    // Added by Vanshita on 1-05-2024
          },
          "& .name-column--cell": {
            color: colors.greenAccent[300],
          },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: colors.blueAccent[700],
            borderBottom: "none",
            fontSize: 14,    // Added by Vanshita on 1-05-2024
          },
          "& .MuiDataGrid-virtualScroller": {
            backgroundColor: colors.primary[400],
          },
          "& .MuiDataGrid-footerContainer": {
            borderTop: "none",
            backgroundColor: colors.blueAccent[700],
          },
          "& .MuiCheckbox-root": {
            color: `${colors.greenAccent[200]} !important`,
          },
          "& .MuiDataGrid-toolbarContainer ": {
            display: 'none'
          },
          "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
            color: `${colors.grey[100]} !important`,
          },
        }}
      >
        <Box
        height='98%' overflow='auto'
        mt='20px'
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
            Feedback Responses
          </Typography>
          <Box mt='10px'>
            {Object.entries(groupedByCategory).map(([categoryName, details], index) => (
              <Accordion defaultExpanded key={index} sx={{ maxHeight: '50vh', overflowY: 'auto', backgroundColor: colors.primary[400] }}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography>{categoryName}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <FullEditDataGrid
                    columns={generateColumns()}
                    rows={generateRows(details)}
                    noActionColumn
                  />
                </AccordionDetails>
              </Accordion>
            ))}
          </Box>
        </Box>

      </Box>
    </Box>
  );
};

export default SingleEndUserDetail;