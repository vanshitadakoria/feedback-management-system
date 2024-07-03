import React, { useState, useEffect } from 'react';
import FullEditDataGrid from 'mui-datagrid-full-edit';
import { Box, Button, Checkbox, Dialog, DialogActions, DialogContent, DialogTitle, FormControlLabel, Tabs, Tab, useTheme, Alert } from '@mui/material';
import { getAllQuestionnaireAssignmentsByCustomerUserId, getAllQuestionnaires, getAllQuestionnairesByCustomerAdminId, getCustomerAdminById, getCustomerUsersByCustomerAdmin, getCustomerUsersBycustomeradmin, getQuestionnaireByCustomerId, getQuestionnaireById, postQuestionnaireAssignment, postQuestionnaireQuestion } from '../../../services/customeradmin'; // Ensure this API function is correctly defined
import Header from '../../../components/Header';
import { tokens } from '../../../theme';
import { object } from 'yup';
import { getQuestionnaireAssignmentsByCustomerUserId, getQuestionnaireByCustomerUserId, updateCustomerUserStatus } from '../../../services/customeruser';
import { getCurrentLoggedInUser } from '../../../services/authentication';

function Index() {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [open, setOpen] = useState(false);
    const [rows, setRows] = useState([]);
    const [questionnaires, setQuestionnaires] = useState([]);
    const [selectedCustomerAdminId, setSelectedCustomerAdminId] = useState(null);
    const [selectedQuestionnaires, setSelectedQuestionnaires] = useState({});
    const [assignedQuestionnaires, setAssignedQuestionnaires] = useState({});
    const [currentSelectedQuestionnaires, setCurrentSelectedQuestionnaires] = useState({});
    const [tabValue, setTabValue] = useState(0);

    const customerAdminId = getCurrentLoggedInUser().customerAdminId;

    const fetchDataFromApi = async () => {
        try {
            const apiData = await getCustomerUsersByCustomerAdmin(customerAdminId);
            const formattedData = apiData.map((item) => ({
                id: item.customerUserId,
                customerUserId: item.customerUserId,
                customerUserTokenId: item.customerUserTokenId,
                customerUserName: item.customerUserName,
                password: item.password,
                customerAdminId: item.customerAdminId,
                status: item.status,
                QuestionnaireAssign: "Questionnaire Assign",
                isNew: false
            }));
            setRows(formattedData);
            console.log("customer users", rows);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    useEffect(() => {
        fetchDataFromApi();

        const fetchGetAllQuestionnaire = async () => {
            try {
                // const apiData = await getAllQuestionnaires();
                const apiData = await getAllQuestionnairesByCustomerAdminId(customerAdminId);
                console.log("api", apiData);
                setQuestionnaires(apiData);
                console.log("formattedData", apiData);
            } catch (error) {
                console.error('Error fetching questionnaires By CustomerAdminId:', error);
            }
        };
        fetchGetAllQuestionnaire();
    }, []);

    // const fetchquestionnaireByCustomerUser = async (customerUserId) => {
    //     try {
    //         const assignedquestionnaire = await getAllQuestionnaireAssignmentsByCustomerUserId(customerUserId);
    //         console.log("jsbjsbjsf", assignedquestionnaire);
    //     } catch (error) {
    //         console.error('Error fetching questionnaire by customer user:', error);
    //     }
    // };

    const fetchAssignedQuestionnaires = async (customerUserId) => {
        try {
            const assigned = await getAllQuestionnaireAssignmentsByCustomerUserId(customerUserId);
            console.log("assigned", assigned);
            const selectedBank = {};
            assigned.forEach(assignment => {
                selectedBank[assignment.questionnaire.questionnaireId] = assignment.questionnaire;
            });
            setAssignedQuestionnaires(selectedBank);
            setSelectedQuestionnaires(selectedBank);
            console.log("assigned questionnaire", assignedQuestionnaires);
            console.log("selected questionnaire", selectedQuestionnaires);
            console.log("selected bank:", selectedBank);
        } catch (error) {
            console.error('Error fetching assigned questionnaires:', error);
        }
    };

    const handleOpen = async (customerUserId) => {
        console.log("Selected Customer Admin Id:", customerUserId);
        setSelectedCustomerAdminId(customerUserId);
        setCurrentSelectedQuestionnaires({});
        fetchAssignedQuestionnaires(customerUserId);
        console.log(selectedCustomerAdminId);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleToggleQuestionnaire = (q) => (event) => {
        const selected = event.target.checked;
        setCurrentSelectedQuestionnaires((prevSelected) => {
            const updatedSelection = selected
                ? { ...prevSelected, [q.questionnaireId]: q }
                : Object.fromEntries(Object.entries(prevSelected).filter(([key]) => key !== q.questionnaireId));
            return updatedSelection;
        });
        console.log("current questionnaire selected", currentSelectedQuestionnaires);
    };

    const handleSave = async () => {
        try {
            const promises = Object.values(currentSelectedQuestionnaires).map(async (selectedBank) => {
                const newQuestionnaire = {
                    questionnaireId: selectedBank.questionnaireId,
                    customerUserId: selectedCustomerAdminId,
                    customerAdminId: selectedBank.customerAdminId,
                };
                console.log("new questionnaire", newQuestionnaire);
                await postQuestionnaireAssignment(newQuestionnaire);
            });
            await Promise.all(promises);
            setOpen(false);
        } catch (error) {
            console.error('Error saving assigned questionnaires:', error);
        }
    };

    const onUpdateStatusRow = async (id, updatedRow, newStatus) => {
        try {
            console.log("updatedRow", updatedRow);
            await updateCustomerUserStatus(updatedRow.customerUserId, newStatus); // Pass only the status string
            const updatedStatusRow = { ...updatedRow, status: newStatus };
            setRows((prevRows) => prevRows.map((row) => row.id === id ? updatedStatusRow : row));
            // console.log(Status of user ${updatedRow.customerUserId} changed to ${newStatus});
        } catch (error) {
            console.error(`Error updating user status to ${newStatus}:`, error);
        }
    };

    const columns = [
        { field: 'id', headerName: 'Customer User Id', flex: 1 },
        { field: 'customerUserTokenId', headerName: 'User Token Id', flex: 1 },
        { field: 'customerUserName', headerName: 'User Name', flex: 1 },
        { field: 'password', headerName: 'Password', flex: 1 },
        // { field: 'customerAdminId', headerName: 'Customer Admin Id', flex: 1 },
        { field: 'status', headerName: 'Status', flex: 1 },
        {
            field: 'QuestionnaireAssign',
            headerName: 'Assign Questionnaire',
            flex: 1.5,
            editable: true,
            renderCell: (params) => (
                <div>
                    <Button
                        variant="contained"
                        onClick={() => handleOpen(params.row.customerUserId)}
                        disabled={params.row.status === 'inactive'}
                        color="secondary"
                    >
                        Assign Questionnaire
                    </Button>
                    <Dialog open={open} onClose={handleClose}>
                        <DialogTitle>Assign Questionnaires</DialogTitle>
                        <DialogContent>
                            <Box sx={{
                                display: 'flex', flexDirection: 'column', overflowY: 'auto', maxHeight: '200px',

                            }}>
                                {questionnaires.map((q) => {
                                    if (q.status === 'active') {
                                        return <FormControlLabel
                                            key={q.questionnaireId}
                                            control={
                                                <Checkbox
                                                    checked={!!selectedQuestionnaires[q.questionnaireId] || !!currentSelectedQuestionnaires[q.questionnaireId]}
                                                    onChange={handleToggleQuestionnaire(q)}
                                                />
                                            }
                                            label={q.questionnaireTitle}
                                        />
                                    }
                                }

                                )}
                            </Box>

                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleSave} color="secondary">
                                Save
                            </Button>
                            <Button onClick={handleClose} color="secondary">
                                Cancel
                            </Button>
                        </DialogActions>
                    </Dialog>
                </div>
            )
        },
        {
            field: 'UpdateStatus',
            headerName: 'Update Status',
            flex: 1,
            renderCell: (params) => (
                params.row.status === 'inactive' ? (
                    <Button variant="contained" color="secondary" onClick={() => onUpdateStatusRow(params.row.id, params.row, 'active')}>
                        Activate
                    </Button>
                ) : (
                    <Button variant="contained" color="secondary" onClick={() => onUpdateStatusRow(params.row.id, params.row, 'inactive')}>
                        Deactivate
                    </Button>
                )
            )
        }
    ];

    const activeRows = rows.filter(row => row.status === 'active');
    const inactiveRows = rows.filter(row => row.status === 'inactive');

    return (
        <Box m="20px">
            <Header title="Customer Users" subtitle="Manage Customer Users and Assign Questionnaires" />
            <Tabs
                value={tabValue}
                onChange={(event, newValue) => setTabValue(newValue)}
                indicatorColor="secondary"
                textColor="secondary"
            >
                <Tab label="Active Users" />
                <Tab label="Inactive Users" />
            </Tabs>
            <Box
                m="40px 0 0 0"
                // height="60vh"
                width="95%"
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
                    "& ::-webkit-scrollbar": {
                        width: '0px',
                        background: 'transparent', /* make scrollbar transparent */
                    },
                    "& .MuiDataGrid-virtualScroller": {
                        maxHeight: '300px',
                        overflowY: 'auto !important',
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

                {tabValue === 0 && (
                    <Box m="20px 0">
                        {activeRows.length > 0 ? (
                            <FullEditDataGrid
                                rows={activeRows}
                                columns={columns}
                                noActionColumn
                            />
                        ) : (
                            <Alert severity="info">No data available.</Alert>
                        )}
                    </Box>
                )}

                {tabValue === 1 && (
                    <Box m="20px 0">
                        {inactiveRows.length > 0 ? (
                            <FullEditDataGrid
                                rows={inactiveRows}
                                columns={columns}
                                noActionColumn
                            />
                        ) : (
                            <Alert severity="info">No data available.</Alert>
                        )}
                    </Box>
                )}
            </Box>
        </Box>
    );
}

export default Index;