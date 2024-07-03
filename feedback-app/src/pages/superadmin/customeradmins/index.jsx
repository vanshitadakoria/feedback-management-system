import React, { useEffect, useState } from 'react';
import { editCustomerAdmin, getAllCustomerAdmins, getAllQuestionnaire, getAllQuestionnaireBanks, getAllSubscriptionCategories, } from '../../../services/superadmin';
import FullEditDataGrid from "mui-datagrid-full-edit";
import { Box, Button, Checkbox, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, FormControlLabel, InputLabel, MenuItem, Select, Tab, Tabs } from '@mui/material';
import { UpdateCustomerAdminsStatus, getCustomerAdminById, getQuestionnaireByCustomerId, postQuestion, postQuestionnaire, postQuestionnaireQuestion } from '../../../services/customeradmin';
import Header from '../../../components/Header';
import { useTheme } from '@emotion/react';
import { tokens } from '../../../theme';


function Index() {
  const [rows, setRows] = useState([]);
  const [selectedCustomerAdminId, setSelectedCustomerAdminId] = useState(null);
  const [questionnaireBanks, setQuestionnaireBanks] = useState([]);
  const [selectedQuestionnaireBanks, setSelectedQuestionnaireBanks] = useState({});
  const [subscriptionCategories, setSubscriptionCategories] = useState([]);
  const [assignedQuestionnaires, setAssignedQuestionnaires] = useState({});
  const [open, setOpen] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const theme = useTheme()
  const colors = tokens(theme.palette.mode);

  const getAllCustomerAdminsData = async () => {
    try {
      const apiData = await getAllCustomerAdmins();
      const formattedData = apiData.map((item) => ({
        id: item.customerAdminId,
        customerAdminId: item.customerAdminId,
        customerTokenId: item.customerTokenId,
        organizationName: item.organizationName,
        officialEmailId: item.officialEmailId,
        password: item.password,
        contactNo: item.contactNo,
        organizationNatureId: item.organizationNature.organizationNatureId,
        organizationNatureName: item.organizationNature?.natureName,
        subscriptionCategoryName: item.subscriptionCategory?.subscriptionCategoryName,
        subscriptionCategoryId: item.subscriptionCategory?.subscriptionCategoryId,
        maxCustomers: item.subscriptionCategory?.maxCustomerUsers,
        maxResponses: item.subscriptionCategory?.maxResponses,
        status: item.status,
        questionnaireTitle: "Assign Questionnaire",
        isNew: false
      }));
      setRows(formattedData);
      console.log(rows);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    getAllCustomerAdminsData();

    const fetchSubscriptionCategories = async () => {
      try {
        const categories = await getAllSubscriptionCategories();
        setSubscriptionCategories(categories);
      } catch (error) {
        console.error('Error fetching subscription categories:', error);
      }
    };
    fetchSubscriptionCategories();

    const fetchQuestionnaireBanks = async () => {
      try {
        const qb = await getAllQuestionnaireBanks();
        setQuestionnaireBanks(qb);
      } catch (error) {
        console.error('Error fetching questionnaire banks:', error);
      }
    };
    fetchQuestionnaireBanks();
  }, []);


  const fetchAssignedQuestionnaires = async (customerAdminId) => {
    try {
      const customerAdmin = await getCustomerAdminById(customerAdminId);
      const assigned = customerAdmin.questionnaires;
      const selectedBank = {};
      assigned.forEach(bank => {
        selectedBank[bank.questionnaireTitle] = bank;
      });
      setAssignedQuestionnaires(prev => ({
        ...prev,
        [customerAdminId]: selectedBank
      }));
      // setSelectedQuestionnaireBanks(selectedBank);
      console.log("Assigned Questionnaires:", selectedBank);
    } catch (error) {
      console.error('Error fetching assigned questionnaires:', error);
    }
  };

  const handleOpen = async (customerAdminId) => {
    console.log("Selected Customer Admin Id:", customerAdminId);
    setSelectedCustomerAdminId(customerAdminId);
    console.log(selectedCustomerAdminId);
    await fetchAssignedQuestionnaires(customerAdminId);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleQuestionnaireSelection = (bank) => (event) => {
    console.log("Bank selected:", bank);
    const selected = event.target.checked;
    setSelectedQuestionnaireBanks((prevSelected) => {
      const updatedSelection = selected
        ? { ...prevSelected, [bank.questionnaireBankTitle]: bank }
        : Object.fromEntries(Object.entries(prevSelected).filter(([key]) => key !== bank.questionnaireBankTitle));
      console.log("Updated Selection:", updatedSelection);
      console.log("selected qb", selectedQuestionnaireBanks);
      return updatedSelection;
    });
  };

  const handleSave = async () => {
    try {
      const updatedRow = rows.find(row => row.customerAdminId === selectedCustomerAdminId);
      if (!updatedRow.isNew) {
        const selectedBanks = Object.values(selectedQuestionnaireBanks);
        // console.log('Selected Banks:', selectedBanks);
        for (const bank of selectedBanks) {
          const newQuestionnaire = {
            questionnaireTitle: bank.questionnaireBankTitle,
            customerAdminId: selectedCustomerAdminId,
          };
          const response = await postQuestionnaire(newQuestionnaire);
          const questionnaireQuestionBanks = bank.questionnaireQuestionBanks;
          for (const qqb of questionnaireQuestionBanks) {
            const newQuestion = {
              questionText: qqb.questionBank.questionBankText,
              customerAdminId: selectedCustomerAdminId,
              questionCategoryId: qqb.questionBank.questionCategoryId
            };
            const quesResponse = await postQuestion(newQuestion);
            const newQuestionnaireQuestion = {
              questionnaireId: response.questionnaireId,
              questionId: quesResponse.questionId,
              customerAdminId: selectedCustomerAdminId,
              serialNo: 2
            };
            const qqResponse = await postQuestionnaireQuestion(newQuestionnaireQuestion);
          }
        }
        getAllCustomerAdminsData();
        setOpen(false);
        setSelectedQuestionnaireBanks({});
      }
    } catch (error) {
      console.error('Error saving selected questionnaire banks:', error);
    }
  };

  const handleCategoryChange = (event, id) => {
    const newValue = event.target.value;
    const updatedRows = rows.map(row => {
      if (row.id === id) {
        return { ...row, subscriptionCategoryId: newValue, subscriptionCategoryName: subscriptionCategories.find(cat => cat.subscriptionCategoryId === newValue).subscriptionCategoryName };
      }
      return row;
    });
    setRows(updatedRows);
  };

  const onSaveRow = async (id, updatedRow, oldRow) => {
    try {
      if (!updatedRow.isNew) {
        const updatedData = await editCustomerAdmin(oldRow.customerAdminId, updatedRow);
        const updatedRows = rows.map(row => (row.id === updatedData.customerAdminId ? updatedData : row));
        setRows(updatedRows);
        getAllCustomerAdminsData();
      }
    } catch (error) {
      console.error('Error saving selected questionnaire banks:', error);
    }
  };

  const onDeleteRow = async (id) => {
    try {
      const updatedRow = rows.find(row => row.id === id);
      if (updatedRow) {
        await UpdateCustomerAdminsStatus(updatedRow.customerAdminId, 'inactive');
        setRows(rows.map(row => row.id === id ? { ...row, status: 'inactive' } : row));
      }
    } catch (error) {
      console.error('Error deleting row:', error);
    }
  };

  const onUpdateStatusRow = async (id, updatedRow, newStatus) => {
    try {
      // console.log("updatedRow", updatedRow);
      await UpdateCustomerAdminsStatus(updatedRow.customerAdminId, newStatus); // Pass only the status string
      const updatedStatusRow = { ...updatedRow, status: newStatus };
      setRows((prevRows) => prevRows.map((row) => row.id === id ? updatedStatusRow : row));
      // console.log(Status of user ${updatedRow.customerUserId} changed to ${newStatus});
    } catch (error) {
      console.error(`Error updating user status to ${newStatus}:`, error);
    }
  };

  const columns = [
    { field: "customerAdminId", headerName: "ID", flex: 0.2 },
    { field: "customerTokenId", headerName: "Token Id", flex: 1 },
    { field: 'organizationName', headerName: "Organization Name", flex: 1 },
    { field: 'officialEmailId', headerName: "Email Id", flex: 1.5 },
    {
      field: 'organizationNatureId',
      headerName: "Organization Nature",
      flex: 1,
      renderCell: (params) => params.row.organizationNatureName
    },
    {
      field: "subscriptionCategoryName", headerName: "Category", flex: 1, editable: true,
      renderEditCell: (params) => {
        const value = params.row.subscriptionCategoryId;
        console.log("value is", value);
        return (
          <Box sx={{ minWidth: 120 }}>
            <FormControl fullWidth>
              <InputLabel id={`category-select-label-${params.row.subscriptionCategoryName}`}>{params.row.subscriptionCategoryName}</InputLabel>
              <Select
                labelId={`category-select-label-${params.id}`}
                id={`category-select-${params.id}`}
                value={value}
                defaultValue={value}
                onChange={(event) => handleCategoryChange(event, params.id)}
              >
                {subscriptionCategories.map((category) => (
                  <MenuItem key={category.subscriptionCategoryId} value={category.subscriptionCategoryId}>
                    {category.subscriptionCategoryName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        );
      }
    },
    { field: 'maxResponses', headerName: "No Of Responses", flex: 1 },
    { field: 'maxCustomers', headerName: "No Of Customers", flex: 1 },
    { field: "status", headerName: "Status", flex: 1 },
    {
      field: "questionnaireTitle", headerName: "Assignment", flex: 2,
      renderCell: (params) => (
        <Box display='flex' flexDirection='column' >
          {params.isEditable ? (
            params.value
          ) : (
            <Button color="secondary" variant="contained" disabled={params.row.status === 'inactive'} onClick={() => handleOpen(params.row.customerAdminId)}>
              Assign Questionnaire
            </Button>
          )}
          <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
            <DialogTitle>Questionnaire Assignments</DialogTitle>
            <DialogContent dividers>
              <Box sx={{
                display: 'flex', flexDirection: 'column', overflowY: 'auto', maxHeight: '200px',

              }}>
                {questionnaireBanks.map((bank) => {
                  if (bank.status === 'active'){
                    return <FormControlLabel
                      key={bank.questionnaireBankId}
                      control={
                        <Checkbox
                          checked={assignedQuestionnaires[selectedCustomerAdminId]?.[bank.questionnaireBankTitle] || !!selectedQuestionnaireBanks[bank.questionnaireBankTitle]}
                          onChange={handleQuestionnaireSelection(bank)}
                        />}
                      label={bank.questionnaireBankTitle}
                    />
                  }
                }
                )}
              </Box>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose} color="secondary">Cancel</Button>
              <Button onClick={handleSave} color="secondary">Save</Button>
            </DialogActions>
          </Dialog>
        </Box>
      )
    },
  ];

  const inactiveColumns = [
    ...columns.filter(col => col.field !== 'actions'),
    {
      field: 'activate',
      headerName: 'Activate',
      flex: 1,
      renderCell: (params) => (
        <Button variant="contained" color="secondary" onClick={() => onUpdateStatusRow(params.row.id, params.row, 'active')}>
          Activate
        </Button>
      )
    }
  ];

  return (
    <Box m='20px'>
      {/* <div style={{ width: 'auto', overflowY: 'auto' }}> */}
      <Header title="Customer Admins" subtitle="Manage Customer Admins and Assign Questionnaires" />
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
          "& .MuiDataGrid-toolbarContainer ": {
            display: 'none'
          },
          "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
            color: `${colors.grey[100]} !important`,
          },
        }}
      >

        {tabValue === 0 && (
          <FullEditDataGrid
            columns={columns}
            rows={rows.filter(row => row.status !== 'inactive')}
            onSaveRow={onSaveRow}
            onDeleteRow={onDeleteRow}
          />
        )}

        {tabValue === 1 && (
          <FullEditDataGrid
            columns={inactiveColumns}
            rows={rows.filter(row => row.status === 'inactive')}
            noActionColumn
          />
        )}
      </Box>
      {/* </div> */}
    </Box>
  );
}

export default Index;