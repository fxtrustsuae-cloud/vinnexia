import {
    MaterialReactTable,
    useMaterialReactTable,
} from 'material-react-table';
import { Typography, Stack } from '@mui/material';
import { useEffect, useState } from 'react';
import { OrderHistoryTableHeaderColumn } from './OrderHistoryTableHeaderColumn';


function OrderHistoryTable({ data, activeTab, isLoading }) {

    const [globalFilter, setGlobalFilter] = useState("");
    const [finalData, setFinalData] = useState(null)

    useEffect(() => {
        const filteredData = globalFilter ? data?.filter(item => (item?.Symbol)?.toUpperCase() === globalFilter.toUpperCase()) : data || []
        setFinalData(filteredData)
    }, [data])

    const table = useMaterialReactTable({
        columns: OrderHistoryTableHeaderColumn(activeTab) || [],
        data: Array.isArray(finalData) ? finalData : [],
        enableColumnFilters: false,
        enableSorting: false,
        enableColumnActions: false,
        // manualPagination: true,
        manualFiltering: true,
        rowCount: finalData?.length || 0,
        state: {
            // pagination,
            globalFilter,
            // isLoading: !data,
            isLoading
            // showAlertBanner: isError,
        },
        initialState: {
            showGlobalFilter: true,
        },
        // enablePagination: false,
        // onPaginationChange: setPagination,
        onGlobalFilterChange: setGlobalFilter,
        columnFilterDisplayMode: "popover",
        paginationDisplayMode: 'pages',
        positionToolbarAlertBanner: 'bottom',
        renderTopToolbarCustomActions: () => (
            activeTab == "Closed positions" ? <Typography p={".5rem"} fontSize={"1.2rem"} color='primary.main'>Last 30 days</Typography> : null
        ),
    });

    return (
        <Stack >
                <MaterialReactTable table={table} />
        </Stack>
    )
};

export default OrderHistoryTable;