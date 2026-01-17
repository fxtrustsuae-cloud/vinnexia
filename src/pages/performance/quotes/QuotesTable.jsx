import { MaterialReactTable, useMaterialReactTable } from 'material-react-table';
import { Stack } from '@mui/material';
import { useState } from 'react';
import { QuotesTableHeaderColumn } from './QuotesTableHeaderColumn';

function QuotesTable({ data }) {
    const [globalFilter, setGlobalFilter] = useState("");

    const filteredData = globalFilter
        ? data?.filter(item => item.Symbol.toUpperCase().startsWith(globalFilter.toUpperCase()))
        : data;

    const table = useMaterialReactTable({
        columns: QuotesTableHeaderColumn,
        data: Array.isArray(filteredData) ? filteredData : [],
        enableColumnFilters: false,
        enableSorting: false,
        enableColumnActions: false,
        enablePagination: true,
        enableRowSelection: false,
        enableGlobalFilter: true,
        rowCount: data?.length || 0,
        state: {
            globalFilter,
            isLoading: !data,
        },
        initialState: {
            showGlobalFilter: true,
            pagination: { pageSize: 10, pageIndex: 0 }
        },
        onGlobalFilterChange: setGlobalFilter,
        columnFilterDisplayMode: "popover",
        paginationDisplayMode: 'pages',
        positionToolbarAlertBanner: 'bottom',
        muiTablePaperProps: {
            sx: {
                borderRadius: '8px',
                overflow: 'hidden'
            }
        }
    });

    return (
        <Stack sx={{ width: '100%' }}>
            <MaterialReactTable table={table} />
        </Stack>
    );
}

export default QuotesTable;