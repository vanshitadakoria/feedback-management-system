import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import FullEditDataGrid from "mui-datagrid-full-edit";
import { tokens } from '../../../theme';
import { useTheme } from '@emotion/react';
import { deleteQuestion, deleteQuestionnaireQuestionByQuestionId, editQuestion, editQuestionStatus, editQuestionnaireQuestion, fetchQuestionnaireQuestion, getQuestionnaireQuestionByQuestionId, postQuestion, postQuestionnaireQuestion } from '../../../services/customeradmin';
import { getCurrentLoggedInUser } from '../../../services/authentication';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Create({ questionCategoryId, questions, questionnaireId }) {
    const [rows, setRows] = useState([]);
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const CustomerAdminId = getCurrentLoggedInUser().customerAdminId;

    useEffect(() => {
        async function fetchData() {
            try {

                setRows(questions.map((row, index) => ({ ...row, id: index + 1, isNew: false })));
                console.log('rows :', rows);
            } catch (error) {
                console.error('Error fetching questions:', error);
            }
        }
        fetchData();
    }, [questions]);

    useEffect(() => {
        // console.log('Updated rows:', rows);
        setRows(rows);
    }, [rows]);

    const onSaveRow = async (id, updatedRow, oldRow, oldRows) => {
        console.log("updatedRow :", updatedRow);
        const newQuestion = {
            questionText: updatedRow.questionText,
            questionCategoryId: questionCategoryId,
            customerAdminId: CustomerAdminId,
        };

        if (updatedRow.isNew) {
            try {
                const apiData = await postQuestion(newQuestion);
                console.log(apiData);

                const newQuestionnaireQuestion = {
                    questionnaireId: questionnaireId,
                    questionId: apiData.questionId,
                    customerAdminId: CustomerAdminId,
                    serialNo: updatedRow.serialNo,
                };

                const response = await postQuestionnaireQuestion(newQuestionnaireQuestion);
                console.log(response);

                // Update the rows state directly with the new data
                setRows(prevRows => [
                    ...prevRows,
                    { ...updatedRow, ...apiData, isNew: false }
                ]);
                toast.success('Row added successfully!');
            } catch (error) {
                console.error('Error posting newQuestion :', error);
                toast.error('Failed to add row!');
            }
        } else {
            try {
                const apiData = await editQuestion(oldRow.questionId, updatedRow);
                console.log(apiData);

                const response = await getQuestionnaireQuestionByQuestionId(oldRow.questionId);
                console.log("response :", response);

                const updatedQuestionnaireQuestion = {
                    questionnaireQuestionId: response.questionnaireQuestionId,
                    questionnaireId: questionnaireId,
                    questionId: oldRow.questionId,
                    customerAdminId: CustomerAdminId,
                    serialNo: updatedRow.serialNo,
                    status: 'active'
                };

                const updateResponse = await editQuestionnaireQuestion(response.questionnaireQuestionId, updatedQuestionnaireQuestion);
                console.log("updateResponse", updateResponse);

                setRows(prevRows => prevRows.map(row => row.id === id ? { ...updatedRow, isNew: false } : row));
                toast.success('Row edited successfully!');
            } catch (error) {
                console.error('Error updating Question :', error);
                toast.error('Failed to edit row!');
            }
        }
    };

    const onDeleteRow = async (id, oldRow, oldRows) => {
        try {
            const response = await deleteQuestionnaireQuestionByQuestionId(oldRow.questionId);
            console.log(response);
            //const apiData = await deleteQuestion(oldRow.questionId);
            //console.log(apiData);
            const apiData = await editQuestionStatus(oldRow.questionId,'inactive');
            console.log(apiData);

            setRows(oldRows.filter(row => row.id !== id));
            toast.success('Row deleted successfully!');
        } catch (error) {
            console.error('Error deleting Question :', error);
            toast.error('Failed to delete row!');
        }
    };

    const createRowData = (rows) => {
        console.log("all rows", rows);

        // Get the maximum ID from the existing rows and add 1, default to 1 if rows is empty
        const newId = rows.length > 0 ? Math.max(...rows.map((r) => (r.id ? r.id : 0))) + 1 : 1;

        return { id: newId, questionText: '', serialNo: '', isNew: true, questionCategoryId: questionCategoryId };
    };

    const columns = [
        {
            field: 'questionId',
            headerName: 'questionID',
            flex: 0.2,
        },
        {
            field: 'id',
            headerName: 'ID',
            flex: 0.2,
        },
        {
            field: 'questionText',
            headerName: 'Question Text',
            flex: 1,
            editable: true
        },
        {
            field: 'serialNo',
            headerName: 'Serial No',
            flex: 1,
            editable: true,
        },
    ];

    return (
        <Box
            sx={{
                height: 300,
                width: '90%',
                '& .actions': {
                    color: 'text.secondary',
                },
                '& .textPrimary': {
                    color: 'text.primary',
                },
                '& .MuiDataGrid-toolbarContainer': {
                    backgroundColor: colors.grey[500],
                },
                "& .MuiDataGrid-cell": {
                    fontSize: 13,
                },
                "& .MuiDataGrid-columnHeaders": {
                    fontSize: 14,
                    backgroundColor: colors.grey[600],
                    fontWeight: "bold"
                },
            }}
        >
            <FullEditDataGrid
                columns={columns}
                rows={rows}
                onSaveRow={onSaveRow}
                onDeleteRow={onDeleteRow}
                columnVisibilityModel={{
                    questionId: false,
                }}
                createRowData={createRowData}
            />
            <ToastContainer />
        </Box>
    );
}
