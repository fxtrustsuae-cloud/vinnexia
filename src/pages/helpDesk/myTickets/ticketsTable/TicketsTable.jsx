import {
    MaterialReactTable,
    useMaterialReactTable
} from 'material-react-table';
import { Stack, Box, Typography, Chip, alpha } from '@mui/material';
import { useState, useMemo } from 'react';
import { TicketsTableColumnHeade } from './TicketsTableColumnHeade';
import Selector from '../../../../components/Selector';
import { useSupportTicketListQuery } from '../../../../globalState/supportState/supportStateApis';
import FilterListIcon from '@mui/icons-material/FilterList';

// Color palette - DARK THEME
const COLORS = {
    accentGold: "#7E6233",
    whiteMain: "#FEFEFE",
    blackDark: "#11191E",
    greyLight: "#CACDCC",
    greyMedium: "#B3B6B6",
    greyDark: "#848F94",
    darkBg: "#1a1f24",
};

function TicketsTable() {
    // Dark theme color variables
    const cardBgColor = alpha("#2a2f34", 0.9);
    const borderColor = alpha(COLORS.greyDark, 0.2);
    const textPrimary = COLORS.whiteMain;
    const textSecondary = COLORS.greyMedium;
    const headerBackground = alpha(COLORS.darkBg, 0.9);
    const inputBackground = alpha("#2a2f34", 0.7);
    const iconColor = COLORS.greyMedium;
    const hoverBackground = alpha(COLORS.greyDark, 0.1);
    const scrollbarTrack = alpha(COLORS.greyDark, 0.1);
    const scrollbarThumb = alpha(COLORS.accentGold, 0.5);

    const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });
    const [status, setStatus] = useState("");

    const { data: listData, isLoading, isError, error } = useSupportTicketListQuery({
        page: pagination.pageIndex + 1,
        sizePerPage: pagination.pageSize,
        status
    });

    const showError = error?.data?.message;

    const list = listData?.data?.ticketList || [];

    const columns = useMemo(() => TicketsTableColumnHeade, []);
    const data = useMemo(() => list, [list]);
    const rowCount = useMemo(() => listData?.data?.totalRecords || 0, [listData]);

    const table = useMaterialReactTable({
        columns: columns,
        data: isError ? [] : data,
        enableColumnFilters: false,
        enableSorting: false,
        enableColumnActions: false,
        manualPagination: true,
        manualFiltering: true,
        rowCount: rowCount,
        state: {
            pagination,
            isLoading,
            showAlertBanner: isError,
        },
        onPaginationChange: setPagination,
        columnFilterDisplayMode: "popover",
        paginationDisplayMode: 'pages',
        positionToolbarAlertBanner: 'bottom',
        muiTablePaperProps: {
            elevation: 0,
            sx: {
                border: 'none',
                borderRadius: '12px',
                overflow: 'hidden',
                backgroundColor: 'transparent',
            }
        },
        muiTableContainerProps: {
            sx: {
                maxHeight: '600px',
                backgroundColor: cardBgColor,
                '&::-webkit-scrollbar': {
                    width: '8px',
                    height: '8px',
                },
                '&::-webkit-scrollbar-track': {
                    background: scrollbarTrack,
                    borderRadius: '4px',
                },
                '&::-webkit-scrollbar-thumb': {
                    background: scrollbarThumb,
                    borderRadius: '4px',
                }
            }
        },
        muiTableHeadCellProps: {
            sx: {
                backgroundColor: headerBackground,
                fontWeight: 600,
                fontSize: '0.875rem',
                color: textPrimary,
                borderBottom: `2px solid ${alpha(COLORS.accentGold, 0.3)}`,
                '&:hover': {
                    backgroundColor: alpha(COLORS.accentGold, 0.1),
                }
            }
        },
        muiTableBodyRowProps: {
            sx: {
                backgroundColor: cardBgColor,
                '&:hover': {
                    backgroundColor: hoverBackground,
                },
                borderBottom: `1px solid ${borderColor}`,
            }
        },
        muiTableBodyCellProps: {
            sx: {
                fontSize: '0.875rem',
                color: textSecondary,
                borderBottom: `1px solid ${borderColor}`,
                '&:hover': {
                    backgroundColor: hoverBackground,
                }
            }
        },
        muiPaginationProps: {
            rowsPerPageOptions: [5, 10, 20, 50],
            showFirstButton: true,
            showLastButton: true,
            sx: {
                backgroundColor: headerBackground,
                borderTop: `1px solid ${borderColor}`,
                color: textSecondary,
                '& .MuiPaginationItem-root': {
                    fontSize: '0.875rem',
                    color: textSecondary,
                    backgroundColor: 'transparent',
                    '&.Mui-selected': {
                        backgroundColor: COLORS.accentGold,
                        color: COLORS.whiteMain,
                        '&:hover': {
                            backgroundColor: alpha(COLORS.accentGold, 0.8),
                        }
                    },
                    '&:hover': {
                        backgroundColor: hoverBackground,
                    }
                },
                '& .MuiSvgIcon-root': {
                    color: iconColor,
                }
            }
        },
        muiToolbarAlertBannerProps: isError
            ? {
                color: 'error',
                children: showError || 'Error loading tickets.',
                sx: {
                    borderRadius: '8px',
                    margin: '8px',
                    backgroundColor: alpha('#f44336', 0.1),
                    border: `1px solid ${alpha('#f44336', 0.2)}`,
                    color: '#ff6b6b'
                }
            }
            : undefined,
        renderTopToolbarCustomActions: () => (
            <Stack direction="row" alignItems="center" spacing={2}>
                <Typography 
                    variant="subtitle2" 
                    fontWeight={600}
                    sx={{ 
                        color: textSecondary,
                        display: { xs: 'none', sm: 'flex' },
                        alignItems: 'center',
                        gap: 1
                    }}
                >
                    <FilterListIcon fontSize="small" />
                    Filter by Status:
                </Typography>
                <Selector
                    items={["", "OPEN", "CLOSED", "PROCESSING"]}
                    itemLabels={["All Tickets", "Open", "Closed", "Processing"]}
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    width={{ xs: '100%', sm: 180 }}
                    sx={{
                        '& .MuiOutlinedInput-root': {
                            borderRadius: '8px',
                            backgroundColor: inputBackground,
                            color: textPrimary,
                            border: `1px solid ${borderColor}`,
                            height: '40px',
                            '&:hover': {
                                borderColor: COLORS.accentGold,
                            },
                            '&.Mui-focused': {
                                borderColor: COLORS.accentGold,
                                boxShadow: `0 0 0 2px ${alpha(COLORS.accentGold, 0.2)}`
                            }
                        },
                        '& .MuiSelect-icon': {
                            color: iconColor,
                        },
                        '& .MuiInputBase-input::placeholder': {
                            color: textSecondary,
                            opacity: 0.7
                        }
                    }}
                />
            </Stack>
        ),
        renderBottomToolbarCustomActions: ({ table }) => (
            <Typography 
                variant="caption" 
                sx={{ 
                    color: textSecondary,
                    px: 2
                }}
            >
                Showing {table.getRowModel().rows.length} of {rowCount} tickets
            </Typography>
        ),
    });

    return (
        <Stack spacing={3}>
            {/* Filter Section - Mobile */}
            <Box sx={{ display: { xs: 'block', sm: 'none' } }}>
                <Typography 
                    variant="caption" 
                    fontWeight={600}
                    sx={{ 
                        color: textSecondary,
                        mb: 1,
                        display: 'block'
                    }}
                >
                    Filter by Status
                </Typography>
                <Selector
                    items={["", "OPEN", "CLOSED", "PROCESSING"]}
                    itemLabels={["All Tickets", "Open", "Closed", "Processing"]}
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    fullWidth
                    sx={{
                        '& .MuiOutlinedInput-root': {
                            borderRadius: '8px',
                            backgroundColor: inputBackground,
                            color: textPrimary,
                            border: `1px solid ${borderColor}`,
                            height: '40px',
                            '&:hover': {
                                borderColor: COLORS.accentGold,
                            },
                            '&.Mui-focused': {
                                borderColor: COLORS.accentGold,
                                boxShadow: `0 0 0 2px ${alpha(COLORS.accentGold, 0.2)}`
                            }
                        },
                        '& .MuiSelect-icon': {
                            color: iconColor,
                        },
                        '& .MuiInputBase-input::placeholder': {
                            color: textSecondary,
                            opacity: 0.7
                        }
                    }}
                />
            </Box>

            {/* Table */}
            <Box sx={{ 
                borderRadius: '12px', 
                overflow: 'hidden',
                border: `1px solid ${borderColor}`,
                backgroundColor: cardBgColor
            }}>
                <MaterialReactTable table={table} />
            </Box>
        </Stack>
    )
};

export default TicketsTable;