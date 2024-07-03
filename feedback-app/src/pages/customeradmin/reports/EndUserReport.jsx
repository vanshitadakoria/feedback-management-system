import { useTheme } from '@emotion/react';
import React, { useEffect, useState } from 'react'
import { tokens } from '../../../theme';
import { Alert, Box, Button, TextField, Tooltip } from '@mui/material';
import FullEditDataGrid from 'mui-datagrid-full-edit';
import { Link } from 'react-router-dom';
import dayjs from 'dayjs';
import Header from '../../../components/Header';
import { GetFeedbackMastersByCustomerAdmin } from '../../../services/customeradmin';
import { getCurrentLoggedInUser } from '../../../services/authentication';

function EndUserReport() {

    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [filteredData, setFilteredData] = useState([]);
    const [feedbackDataMaster, setFeedbackDataMaster] = useState([]);
    const [selectedDate, setSelectedDate] = useState(null);

    const CustomerAdminId = getCurrentLoggedInUser().customerAdminId;



    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await GetFeedbackMastersByCustomerAdmin(CustomerAdminId);
                const data = response.map((row, index) => ({ ...row, id: index + 1, isNew: false }));
                const datas = processFeedbackData(data);
                setFeedbackDataMaster(datas);
                setFilteredData(datas);
                console.log("filtered data :", datas);
            } catch (error) {
                console.error('Error fetching GetFeedbackMastersByCustomerAdmin:', error);
            }
        };

        fetchData();
    }, []);

    const processFeedbackData = (response) => {
        const ratingsCount = {};
        response.forEach(entry => {
            const personName = entry.personName;
            if (!ratingsCount[personName]) {
                ratingsCount[personName] = { "0": 0, "1": 0, "2": 0, "3": 0, "4": 0, "5": 0 };
            }
            entry.feedbackDetails.forEach(detail => {
                const rating = detail.responseRating;
                ratingsCount[personName][rating]++;
            });
        });
        return response.map(entry => {
            const personName = entry.personName;
            return { ...entry, ...ratingsCount[personName] };
        });
    };

    const filterData = (startDate, endDate) => {
        const filtered = feedbackDataMaster.filter((item) => {
            const feedbackDate = dayjs(item.feedbackDate).startOf('day');
            return feedbackDate.isAfter(startDate) && feedbackDate.isBefore(endDate);
        });
        setFilteredData(filtered);
    };
    const filterDataSingle = (date) => {
        const filtered = feedbackDataMaster.filter((item) => {
            const feedbackDate = dayjs(item.feedbackDate).startOf('day');
            // return feedbackDate.isAfter(startDate) && feedbackDate.isBefore(endDate);
            return feedbackDate.isSame(date, 'day')
        });
        setFilteredData(filtered);
    };

    const handleTodayClick = () => {
        const today = dayjs().startOf('day');
        filterDataSingle(today);
    };

    const handleYesterdayClick = () => {
        const yesterday = dayjs().subtract(1, 'day').startOf('day');
        filterDataSingle(yesterday);
    };

    const handleDateChange = (event) => {
        const date = dayjs(event.target.value).startOf('day');
        setSelectedDate(date);
        filterDataSingle(date);
    };
    const handleLast5DaysClick = () => {
        const today = dayjs().startOf('day');
        const startDate = today.subtract(5, 'days');
        filterData(startDate, today.add(1, 'day'));
    };

    const handleLast10DaysClick = () => {
        const today = dayjs().startOf('day');
        const startDate = today.subtract(10, 'days');
        filterData(startDate, today.add(2, 'day'));
    };

    const getCurrentDate = () => {
        const today = new Date();
        const dd = String(today.getDate()).padStart(2, '0');
        const mm = String(today.getMonth() + 1).padStart(2, '0'); // January is 0!
        const yyyy = today.getFullYear();

        return `${yyyy}-${mm}-${dd}`;
    };


    const columns = [
        {
            field: "personName",
            headerName: "Person Name",
            flex: 0.5,
            cellClassName: "name-column--cell",
            renderCell: (params) => (
                <Tooltip title="Click here" arrow>
                    <Link to={`/details/${params.row.feedbackMasterId}` || 'NA'}
                        style={{ textDecoration: 'none', color: 'inherit', fontSize: '11pt' }}  >
                        {params.value || 'NA'}
                    </Link>
                </Tooltip>
            ),
        },
        { field: "0", headerName: "0 Rating", flex: 0.3 },
        { field: "1", headerName: "1 Rating", flex: 0.3 },
        { field: "2", headerName: "2 Rating", flex: 0.3 },
        { field: "3", headerName: "3 Rating", flex: 0.3 },
        { field: "4", headerName: "4 Rating", flex: 0.3 },
        { field: "5", headerName: "5 Rating", flex: 0.3 },
    ];

    return (
        <Box m="20px" >

            <Header
                title="End User Reports"
                subtitle="List of Response and Their details"
            />
            <Box display="flex" justifyContent="left" mb="20px" >

                <Button variant="contained" color="secondary" onClick={handleTodayClick}>
                    Today
                </Button>
                <Button sx={{ marginLeft: '2px' }} variant="contained" color="secondary" onClick={handleYesterdayClick}>
                    Yesterday
                </Button>
                <Button sx={{ marginLeft: '2px', }} variant="contained" color="secondary" onClick={handleLast5DaysClick}>
                    Last 5 Days
                </Button>
                <Button sx={{ marginLeft: '2px', }} variant="contained" color="secondary" onClick={handleLast10DaysClick}>
                    Last 10 Days
                </Button>
                <TextField
                    sx={{ marginLeft: '2px' }}

                    type="date"
                    value={selectedDate ? selectedDate.format('YYYY-MM-DD') : ''}
                    onChange={handleDateChange}
                    InputLabelProps={{ shrink: true }}
                    InputProps={{ inputProps: { max: getCurrentDate() } }}
                />
            </Box>
            <Box
                // overflow='auto'
                // m="40px 0 0 0"
                // height= 
                width="95%"

                sx={{

                    // height:100,
                    "& .MuiDataGrid-root": {
                        border: "none",
                    },
                    "& .MuiDataGrid-cell": {
                        borderBottom: "none",
                        paddingLeft: 3,
                        fontSize: 14,    //Added by Vanshita on 1-05-2024
                    },

                    "& ::-webkit-scrollbar": {
                        width: '0px',
                        background: 'transparent', /* make scrollbar transparent */
                    },
                    "& .name-column--cell": {
                        color: colors.greenAccent[300],
                        paddingLeft: 3,
                    },
                    "& .MuiDataGrid-columnHeaders": {
                        paddingLeft: 2,
                        backgroundColor: colors.blueAccent[700],
                        borderBottom: "none",
                        fontSize: 14,    //Added by Vanshita on 1-05-2024
                    },
                    "& .MuiDataGrid-virtualScroller": {
                        overflowY: 'scroll !important',
                        overflowX: 'hidden !important',
                        height: '220px',
                        backgroundColor: colors.primary[400],
                    },
                    "& .MuiDataGrid-footerContainer": {
                        borderTop: "none",
                        backgroundColor: colors.blueAccent[700],
                        padding: 0
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




                {filteredData.length > 0 ? (
                    <FullEditDataGrid rows={filteredData} columns={columns} noActionColumn />
                ) : (
                    <Alert severity="info">No data available.</Alert>
                )}
            </Box>
        </Box>
    )
}

export default EndUserReport;