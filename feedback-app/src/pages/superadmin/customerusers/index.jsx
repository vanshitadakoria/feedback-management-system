import React, { useEffect, useState } from 'react';
import { editCustomerAdmin, getAllCustomerAdmins, getAllCustomerUsers, getAllQuestionnaire, getAllQuestionnaireBanks, getAllSubscriptionCategories, } from '../../../services/superadmin';
import FullEditDataGrid from "mui-datagrid-full-edit";
import { Box, Button, Checkbox, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, FormControlLabel, InputLabel, MenuItem, Select, Tab, Tabs } from '@mui/material';
import { UpdateCustomerAdminsStatus, getCustomerAdminById, getQuestionnaireByCustomerId, postQuestion, postQuestionnaire, postQuestionnaireQuestion } from '../../../services/customeradmin';
import Header from '../../../components/Header';
import { useTheme } from '@emotion/react';
import { tokens } from '../../../theme';
import ActiveIcon from '@mui/icons-material/CheckCircle';  // Import the active icon
import InactiveIcon from '@mui/icons-material/Cancel';


function Index() {
    const [rows, setRows] = useState([]);
    const theme = useTheme()
    const colors = tokens(theme.palette.mode);

    const getAllCustomerUsersData = async () => {
        try {
            const apiData = await getAllCustomerUsers();
            const formattedData = apiData.map((item,index) => ({
                // id: item.customerUserId,
                customerUserId: item.customerUserId,
                customerUserTokenId: item.customerUserTokenId,
                customerUserName: item.customerUserName,
                password: item.password,
                customerAdminId: item.customerAdmin.organizationName,
                status: item.status,
                id:index+1
            }));
          
            setRows(formattedData);
            console.log(rows);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    useEffect(() => {
        getAllCustomerUsersData();

    }, []);




    //   const handleSave = async () => {
    //     try {
    //       const updatedRow = rows.find(row => row.customerAdminId === selectedCustomerAdminId);
    //       if (!updatedRow.isNew) {
    //         const selectedBanks = Object.values(selectedQuestionnaireBanks);
    //         // console.log('Selected Banks:', selectedBanks);
    //         for (const bank of selectedBanks) {
    //           const newQuestionnaire = {
    //             questionnaireTitle: bank.questionnaireBankTitle,
    //             customerAdminId: selectedCustomerAdminId,
    //           };
    //           const response = await postQuestionnaire(newQuestionnaire);
    //           const questionnaireQuestionBanks = bank.questionnaireQuestionBanks;
    //           for (const qqb of questionnaireQuestionBanks) {
    //             const newQuestion = {
    //               questionText: qqb.questionBank.questionBankText,
    //               customerAdminId: selectedCustomerAdminId,
    //               questionCategoryId: qqb.questionBank.questionCategoryId
    //             };
    //             const quesResponse = await postQuestion(newQuestion);
    //             const newQuestionnaireQuestion = {
    //               questionnaireId: response.questionnaireId,
    //               questionId: quesResponse.questionId,
    //               customerAdminId: selectedCustomerAdminId,
    //               serialNo: 2
    //             };
    //             const qqResponse = await postQuestionnaireQuestion(newQuestionnaireQuestion);
    //           }
    //         }
    //         getAllCustomerAdminsData();
    //         setOpen(false);
    //         setSelectedQuestionnaireBanks({});
    //       }
    //     } catch (error) {
    //       console.error('Error saving selected questionnaire banks:', error);
    //     }
    //   };


    //   const onSaveRow = async (id, updatedRow, oldRow) => {
    //     try {
    //       if (!updatedRow.isNew) {
    //         const updatedData = await editCustomerAdmin(oldRow.customerAdminId, updatedRow);
    //         const updatedRows = rows.map(row => (row.id === updatedData.customerAdminId ? updatedData : row));
    //         setRows(updatedRows);
    //         getAllCustomerAdminsData();
    //       }
    //     } catch (error) {
    //       console.error('Error saving selected questionnaire banks:', error);
    //     }
    //   };

    //   const onDeleteRow = async (id) => {
    //     try {
    //       const updatedRow = rows.find(row => row.id === id);
    //       if (updatedRow) {
    //         await UpdateCustomerAdminsStatus(updatedRow.customerAdminId, 'inactive');
    //         setRows(rows.map(row => row.id === id ? { ...row, status: 'inactive' } : row));
    //       }
    //     } catch (error) {
    //       console.error('Error deleting row:', error);
    //     }
    //   };

    const columns = [
        { field: "customerUserId", headerName: "customerUserId", flex: 0.2 },
        { field: "id", headerName: "ID", flex: 0.2 },
        { field: "customerUserTokenId", headerName: "Token Id", flex: 1 },
        { field: 'customerUserName', headerName: "Customer UserName ", flex: 1 },
        {
            field: 'customerAdminId',
            headerName: "Customer Admin",
            flex: 1,
            //   renderCell: (params) => params.row.organizationName
        },

        {
            field: "status", headerName: "Status", flex: 1,
            renderCell: (params) => (
                params.value === 'active'
                    ? <ActiveIcon style={{ color: 'green' }} />
                    : <InactiveIcon style={{ color: 'red' }} />
            ),
        },

    ];



    return (
        <Box m='20px'>
            <Header title="Customer Users" subtitle="List of Customer Users" />
            <Box
                m="40px 0 0 0"
                width="98%"
                sx={{
                    "& .MuiDataGrid-root": {
                        border: "none",
                    },
                    "& .MuiDataGrid-cell": {
                        borderBottom: "none",
                        fontSize: 14,    //Added by Vanshita on 1-05-2024
                    },
                    "& .name-column--cell": {
                        color: colors.greenAccent[300],
                    },
                    "& .MuiDataGrid-columnHeaders": {
                       
                        backgroundColor: colors.blueAccent[700],
                        borderBottom: "none",
                        fontSize: 14,    //Added by Vanshita on 1-05-2024
                    },
                    "& .MuiDataGrid-virtualScroller": {
                        maxHeight: '300px',
                        // width: 'inherit',
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
                    // "& .MuiDataGrid-toolbarContainer ": {
                    //   display: 'none'
                    // },
                    "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
                        color: `${colors.grey[100]} !important`,
                    },
                    "& .css-13qp4b7-MuiButtonBase-root-MuiButton-root": {    //Added on 03-06-2024
                        display: 'none'
                    }
                }}
            >

                <FullEditDataGrid
                    columns={columns}
                    rows={rows}
                  noActionColumn
                  columnVisibilityModel={{
                    customerUserId: false,
                }}
                />
            </Box>
            {/* </div> */}
        </Box>
    );
}

export default Index;