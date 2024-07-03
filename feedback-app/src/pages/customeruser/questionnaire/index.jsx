// import React from 'react'
// import Header from '../../../components/Header'
// import { useTheme } from '@emotion/react';
// import { tokens } from '../../../theme';
// import { Box } from '@mui/material';
// import { useState, useEffect } from 'react';
// import FullEditDataGrid from "mui-datagrid-full-edit";
// import { Link } from 'react-router-dom';
// import { getCustomerUserById } from '../../../services/customeruser';

// export default function Index() {

//     const theme = useTheme();
//     const colors = tokens(theme.palette.mode);
//     const [data, setData] = useState([]);
//     const [questionnaires, setQuestionnaires] = useState([]);
//     const [questionnaireAssignments, setQuestionnaireAssignements] = useState([]);

//     useEffect(() => {
//         const fetchDataFromApi = async () => {
//             try {
//                 const apiData = await getCustomerUserById(1);
//                 console.log("cust user:", apiData);
//                 setQuestionnaireAssignements(apiData.questionnaireAssignments);
//             } catch (error) {
//                 console.error('Error fetching data:', error);
//             }
//         };
//         fetchDataFromApi();
//     }, []);

//     useEffect(() => {

//         setData(questionnaireAssignments.map((row, index) => ({
//             ...row,
//             id: index + 1,
//             isNew: false
//         })));
//     }, [questionnaireAssignments]); 
   
//     const columns = [
//         {
//             field: "questionnaireId",
//             headerName: "ID",
//             flex: 0.2,      //Changed by vanshita on 1-05-2024
//         },
//         {
//             field: "questionnaire",
//             headerName: "Title",
//             flex: 1,
//             cellClassName: "name-column--cell",
//             editable: true,
//             valueGetter: (params) => params.value.questionnaireTitle,
//             renderCell: (params) => (
//                 <Link to={`/questionnaire/${params.row.questionnaireId}`}>
//                     {params.value}
//                 </Link>
//             ),
//         },
//         {
//             field: "status",
//             headerName: "Status",
//             flex: 1,
//         },
//     ];

//     // const getRowId = (row) => row.questionnaireBankId;

//     return (
//         <div>
//             <Box m="20px">
//                 <Header
//                     title="Questionnaires"
//                     subtitle="List of Questionnaires for Feedback Collection"
//                 />
//                 <Box
//                     m="40px 0 0 0"
//                     height="75vh"
//                     width="100%"
//                     sx={{
//                         "& .MuiDataGrid-root": {
//                             border: "none",
//                         },
//                         "& .MuiDataGrid-cell": {
//                             borderBottom: "none",
//                             fontSize: 14,    //Added by Vanshita on 1-05-2024
//                         },
//                         "& .name-column--cell": {
//                             color: colors.greenAccent[300],
//                         },
//                         "& .MuiDataGrid-columnHeaders": {
//                             backgroundColor: colors.blueAccent[700],
//                             borderBottom: "none",
//                             fontSize: 14,    //Added by Vanshita on 1-05-2024
//                         },
//                         "& .MuiDataGrid-virtualScroller": {
//                             backgroundColor: colors.primary[400],
//                         },
//                         "& .MuiDataGrid-footerContainer": {
//                             borderTop: "none",
//                             backgroundColor: colors.blueAccent[700],
//                         },
//                         "& .MuiCheckbox-root": {
//                             color: `${colors.greenAccent[200]} !important`,
//                         },
//                         // "& .MuiDataGrid-toolbarContainer ": {
//                         //   display: 'none'
//                         // },
//                         "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
//                             color: `${colors.grey[100]} !important`,
//                         },
//                     }}
//                 >

//                     <FullEditDataGrid
//                         columns={columns}
//                         rows={data}
//                     // onSaveRow={onSaveRow}
//                     // onDeleteRow={onDeleteRow}
//                     // createRowData={createRowData}
//                     />

//                 </Box>
//             </Box>
//         </div>
//     )
// }
