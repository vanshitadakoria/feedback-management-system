import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import { deleteQuestionBank, editQuestionBank, getQuestionBanksByCategoryId, postQuestionBank } from '../../../services/superadmin';
import FullEditDataGrid from "mui-datagrid-full-edit";
import { tokens } from '../../../theme';
import { useTheme } from '@emotion/react';
import { getQuestionsByCategoryId } from '../../../services/customeradmin';
import { getCurrentLoggedInUser } from '../../../services/authentication';


// const getRowId = (row) => row.srNo;


export default function Index({ questionCategoryId }) {
    const [rows, setRows] = useState([]);
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const CustomerAdminId = getCurrentLoggedInUser().customerAdminId;


    useEffect(() => {
        async function fetchData() {
            try {
                //------------------TASK--------------- Assign customerAdminId in place of 1 in below method
                const data = await getQuestionsByCategoryId(questionCategoryId, CustomerAdminId);
                setRows(data.map((row, index) => ({ ...row, id: index + 1, isNew: false })));
            } catch (error) {
                console.error('Error fetching questions:', error);
            }
        }
        fetchData();
    }, []);




    const columns = [
        // {
        //     field: 'questionId',
        //     headerName: 'ID',
        //     flex: 0.2,
        // },
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

    ];

    return (
        <Box
            sx={{
                width: '90%',
                '& .textPrimary': {
                    color: 'text.primary',
                },
                // Added by Vanshita on 7-05-2024
                '& .MuiDataGrid-toolbarContainer': {
                    backgroundColor: colors.grey[500],
                    // backgroundColor:colors.blueAccent[600], 
                },
                "& ::-webkit-scrollbar": {
                    width: '0px',
                    background: 'transparent', /* make scrollbar transparent */
                },
                "& .MuiDataGrid-virtualScroller": {
                    maxHeight: '180px',
                    // width: 'inherit',
                    overflowY: 'auto !important',
                    overflowX: 'hidden !important',

                    backgroundColor: colors.primary[400],
                },
                "& .MuiDataGrid-cell": {
                    fontSize: 13,
                },
                "& .MuiDataGrid-columnHeaders": {
                    fontSize: 14,
                    backgroundColor: colors.grey[600],
                    // backgroundColor:colors.blueAccent[700], 
                    fontWeight: "bold"
                },
                "& .css-13qp4b7-MuiButtonBase-root-MuiButton-root": {    //Added on 03-06-2024
                    display: 'none'
                }

                //Ended
            }}
        >
            <FullEditDataGrid
                columns={columns}
                rows={rows.filter(r => r.status === 'active')}

                // onSaveRow={onSaveRow}
                // onDeleteRow={onDeleteRow}
                // createRowData={createRowData}

                //Added by vanshita on 7-05-2024
                // columnVisibilityModel={{
                //     questionBankId: false,
                // }}
                noActionColumn
            />
        </Box>
    );
}