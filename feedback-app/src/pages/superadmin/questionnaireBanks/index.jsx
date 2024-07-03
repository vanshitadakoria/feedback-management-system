import React, { useState, useEffect } from 'react';
import Header from '../../../components/Header';
import { deleteQuestionnaireBankWithAllRelatedData, editQuestionnaireBank, editQuestionnaireBankStatus, getAllQuestionnaireBanks, postQuestionnaireBank } from '../../../services/superadmin';
import { useTheme } from '@emotion/react';
import { tokens } from '../../../theme';
import { Box, Button, Tab, Tabs } from '@mui/material';
import FullEditDataGrid from 'mui-datagrid-full-edit';
import { Link, useNavigate } from 'react-router-dom';
import { getCurrentLoggedInUser } from '../../../services/authentication';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Index() {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [data, setData] = useState([]);
  const [tabIndex, setTabIndex] = useState(0);


  const SuperAdminId = getCurrentLoggedInUser().superAdminId;

  useEffect(() => {
    const fetchDataFromApi = async () => {
      try {
        const apiData = await getAllQuestionnaireBanks();
        setData(apiData.map((row, index) => ({ ...row, id: index + 1, isNew: false })));
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchDataFromApi();
  }, []);



  const onSaveRow = async (id, updatedRow, oldRow, oldRows) => {
    if (updatedRow.isNew) {
      // Post call
      try {
        const newQuestionnaireBank = {
          questionnaireBankTitle: updatedRow.questionnaireBankTitle,
          superAdminId: SuperAdminId,
        };
        const response = await postQuestionnaireBank(newQuestionnaireBank);
        console.log(response);

        // Fetch updated data from API
        const updatedData = await getAllQuestionnaireBanks();
        setData(updatedData.map((row, index) => ({ ...row, id: index + 1, isNew: false })));

        toast.success('New questionnaire bank added successfully.');
      } catch (error) {
        console.error('Error posting newQuestionnaireBank :', error);
        toast.error('Failed to add new questionnaire bank.');
      }
    } else {
      // Edit call
      try {
        const apiData = await editQuestionnaireBank(oldRow.questionnaireBankId, updatedRow);
        console.log(apiData);
        toast.success('Questionnaire bank updated successfully.');
      } catch (error) {
        console.error('Error updating QuestionnaireBank :', error);
        toast.error('Failed to update questionnaire bank.');
      }
    }
  };

  // const onDeleteRow = async (id, oldRow, oldRows) => {
  //   try {
  //     const apiData = await deleteQuestionnaireBankWithAllRelatedData(oldRow.questionnaireBankId, oldRow.questionnaireQuestionBanks);
  //     console.log(apiData);
  //     setData(oldRows.filter(row => row.id !== id));
  //     toast.success('Questionnaire bank deleted successfully.');
  //   } catch (error) {
  //     console.error('Error deleting QuestionnaireBank :', error);
  //     toast.error('Failed to delete questionnaire bank.');
  //   }
  // };

  const onDeleteRow = async (id) => {
    try {
      const updatedRow = data.find(row => row.id === id);
      if (updatedRow) {
        await editQuestionnaireBankStatus(updatedRow.questionnaireBankId, 'inactive');
        setData(data.map(row => row.id === id ? { ...row, status: 'inactive' } : row));
        toast.success('Questionnaire bank deactivated successfully.');

      }
    } catch (error) {
      console.error('Error deleting row:', error);
      toast.error('Failed to deactivate questionnaire bank.');

    }
  };

  const handleActivate = async (id, row) => {
    try {
      const updatedRow = { ...row, status: "active" };
      const apiData = await editQuestionnaireBankStatus(row.questionnaireBankId, 'active');
      setData(prevData => prevData.map(r => r.questionnaireBankId === id ? updatedRow : r));
      toast.success('Questionnaire bank activated successfully.');

    } catch (error) {
      console.error('Error activating row:', error);
      toast.error('Failed to activate questionnaire bank.');

    }
  };

  const columns = [
    {
      field: 'questionnaireBankId',
      headerName: 'questionnaireBankId',
      flex: 0.2,
    },
    {
      field: 'id',
      headerName: 'ID',
      flex: 0.2,
    },
    {
      field: 'questionnaireBankTitle',
      headerName: 'Title',
      flex: 1,
      cellClassName: 'name-column--cell',
      editable: true,
      renderCell: (params) => (
        <Link
          to={`/superadmin/questionnairebank/${params.row.questionnaireBankId}`}
          style={{ textDecoration: 'none', color: 'inherit', fontSize: '11pt' }}
        >
          {params.value}
        </Link>
      ),
    },
    {
      field: 'status',
      headerName: 'Status',
      flex: 1,
    },
  ];


  const inactiveColumns = [
    ...columns.filter(col => col.field !== 'actions'),
    {
      field: 'activate',
      headerName: 'Activate',
      flex: 1,
      renderCell: (params) => (
        <Button variant="contained" color="secondary" onClick={() => handleActivate(params.row.questionnaireBankId, params.row, 'active')}>
          Activate
        </Button>
      )
    }
  ];

  return (
    <div>
      <Box m="20px">
        <Header
          title="QuestionnaireBanks"
          subtitle="List of Questionnaires for Feedback Collection"
        />
        <Box m="20px 0">
          <Tabs value={tabIndex} onChange={(event, newValue) => setTabIndex(newValue)} indicatorColor="secondary" textColor="secondary">
            <Tab label="Active QuestionnaireBanks" />
            <Tab label="Inactive QuestionnaireBanks" />
          </Tabs>
        </Box>
        {tabIndex === 0 && (<Box
          m="20px 0 0 0"
          sx={{
            "& .MuiDataGrid-root": {
              border: "none",
              display: 'flex',
              width: "99%",
            },
            "& .MuiDataGrid-cell": {
              borderBottom: "none",
              fontSize: 14,
            },
            "& .name-column--cell": {
              color: colors.greenAccent[300],
              textDecoration: 'none',
            },
            "& .MuiDataGrid-columnHeaders": {
              backgroundColor: colors.blueAccent[700],
              borderBottom: "none",
              fontSize: 14,
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
              // display: 'none'
            },
            "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
              color: `${colors.grey[100]} !important`,
            },
          }}
        >

          {/* <FullEditDataGrid
            columns={columns}
            rows={data}
            onSaveRow={onSaveRow}
            onDeleteRow={onDeleteRow}
            columnVisibilityModel={{
              questionnaireBankId: false,
          }}
          /> */}
          {/* {tabIndex === 0 && ( */}
            <FullEditDataGrid
              columns={columns}
              rows={data.filter(row => row.status !== 'inactive')}
              onSaveRow={onSaveRow}
              onDeleteRow={onDeleteRow}
              columnVisibilityModel={{
                questionnaireBankId: false,
              }}
            />
          {/* )} */}
         
        </Box>
        )}
        {tabIndex === 1 && (<Box
          m="40px 0 0 0"
          sx={{
            "& .MuiDataGrid-root": {
              border: "none",
              display: 'flex',
              width: "99%",
            },
            "& .MuiDataGrid-cell": {
              borderBottom: "none",
              fontSize: 14,
            },
            "& .name-column--cell": {
              color: colors.greenAccent[300],
              textDecoration: 'none',
            },
            "& .MuiDataGrid-columnHeaders": {
              backgroundColor: colors.blueAccent[700],
              borderBottom: "none",
              fontSize: 14,
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

          {/* <FullEditDataGrid
            columns={columns}
            rows={data}
            onSaveRow={onSaveRow}
            onDeleteRow={onDeleteRow}
            columnVisibilityModel={{
              questionnaireBankId: false,
          }}
          /> */}
         
          <FullEditDataGrid
            columns={inactiveColumns}
            rows={data.filter(row => row.status === 'inactive')}
            onSaveRow={onSaveRow}
            onDeleteRow={onDeleteRow}

            columnVisibilityModel={{
              questionnaireBankId: false,
            }}
            noActionColumn
            // disableToolbar
            // components={{ Toolbar: null }}
          />

        </Box>
        )}
          <ToastContainer />

      </Box>
    </div>
  );
}
