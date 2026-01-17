import {
    MaterialReactTable,
    useMaterialReactTable
} from 'material-react-table';
import {
    Box,
    Button,
    Container,
    Typography,
    Stack,
    Paper,
    Chip,
    IconButton,
    TextField,
    InputAdornment,
    CircularProgress,
    Alert,
    Grid,
    FormControl,
    Select,
    MenuItem,
    alpha  // ADD THIS IMPORT
} from '@mui/material';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import SearchIcon from '@mui/icons-material/Search';
import RefreshIcon from '@mui/icons-material/Refresh';
import ClearIcon from '@mui/icons-material/Clear';
import FilterListIcon from '@mui/icons-material/FilterList';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { useState, useMemo } from 'react';
import dayjs from 'dayjs';
import { depositWithdrawListHeaderColumn } from './depositWithdrawListHeaderColumn';
import { useDepositWithdrawaListQuery } from '../../../globalState/userState/userStateApis';
import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { handleExportToExcel } from '../../../utils/exportToExcel';

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

const STATUS_OPTIONS = [
    { value: "", label: "All Status" },
    { value: "PENDING", label: "Pending" },
    { value: "COMPLETED", label: "Completed" },
    { value: "REJECTED", label: "Rejected" }
];

const TRANSACTION_TYPES = [
    { value: "", label: "All Types" },
    { value: "WITHDRAW", label: "Withdraw" },
    { value: "DEPOSIT", label: "Deposit" }
];

const PAYMENT_METHODS = [
    { value: "", label: "All Methods" },
    { value: "BANK", label: "Bank" },
    { value: "CASH", label: "Cash" },
    { value: "CRYPTO", label: "Crypto" }
];

function DepositWithdrawList() {
    const dispatch = useDispatch();
    
    // Dark theme colors
    const pageBgColor = COLORS.darkBg;
    const cardBgColor = alpha("#2a2f34", 0.9);
    const borderColor = alpha(COLORS.greyDark, 0.2);
    const textPrimary = COLORS.whiteMain;
    const textSecondary = COLORS.greyMedium;
    const headerBackground = alpha(COLORS.darkBg, 0.9);
    const inputBackground = alpha("#2a2f34", 0.7);
    const iconColor = COLORS.greyMedium;
    const paperBackground = alpha("#2a2f34", 0.8);
    const hoverBackground = alpha(COLORS.greyDark, 0.1);

    const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });
    const [globalFilter, setGlobalFilter] = useState("");
    const [filters, setFilters] = useState({
        status: "",
        transactionType: "",
        paymentMethod: "",
        fromDate: null,
        toDate: null,
    });

    const formattedFromDate = filters.fromDate ? dayjs(filters.fromDate).format('YYYY-MM-DD') : undefined;
    const formattedToDate = filters.toDate ? dayjs(filters.toDate).format('YYYY-MM-DD') : undefined;

    const { data: listData, isLoading, isError, error, refetch } = useDepositWithdrawaListQuery({
        page: pagination.pageIndex + 1,
        sizePerPage: pagination.pageSize,
        search: globalFilter,
        ...filters,
        fromDate: formattedFromDate,
        toDate: formattedToDate,
    });

    const showError = error?.data?.message;
    const list = listData?.data?.depositWithdrawList || [];
    const totalRecords = listData?.data?.totalRecords || 0;

    const handleDownloadExcel = () => {
        handleExportToExcel(list, "DepositWithdrawList.xlsx", dispatch);
    };

    const handleRefresh = () => {
        refetch();
    };

    const handleClearFilters = () => {
        setFilters({
            status: "",
            transactionType: "",
            paymentMethod: "",
            fromDate: null,
            toDate: null,
        });
        setGlobalFilter("");
    };

    const columns = useMemo(() => depositWithdrawListHeaderColumn, []);
    const data = useMemo(() => list, [list]);
    const rowCount = useMemo(() => totalRecords, [totalRecords]);

    const activeFilterCount = Object.values(filters).filter(value =>
        value !== "" && value !== null
    ).length + (globalFilter ? 1 : 0);

    const table = useMaterialReactTable({
        columns: columns,
        data: isError ? [] : data,
        enableColumnFilters: false,
        enableSorting: false,
        enableColumnActions: false,
        manualPagination: true,
        manualFiltering: true,
        rowCount: rowCount,

        // Table Styling - DARK THEME
        muiTablePaperProps: {
            elevation: 0,
            sx: {
                border: `1px solid ${borderColor}`,
                borderRadius: 2,
                overflow: 'hidden',
                background: cardBgColor,
            }
        },

        muiTableHeadRowProps: {
            sx: {
                backgroundColor: headerBackground,
            }
        },

        muiTableHeadCellProps: {
            sx: {
                fontWeight: 600,
                fontSize: '0.875rem',
                py: 1.5,
                color: textPrimary,
                borderBottom: `1px solid ${borderColor}`,
            }
        },

        muiTableBodyRowProps: {
            sx: {
                '&:hover': {
                    backgroundColor: hoverBackground,
                },
                borderBottom: `1px solid ${borderColor}`,
            }
        },

        muiTableBodyCellProps: {
            sx: {
                py: 1.5,
                fontSize: '0.875rem',
                color: textSecondary,
                borderBottom: `1px solid ${borderColor}`,
            }
        },

        muiPaginationProps: {
            rowsPerPageOptions: [5, 10, 25, 50],
            showRowsPerPage: true,
            sx: {
                background: paperBackground,
                borderTop: `1px solid ${borderColor}`,
                color: textSecondary,
                '& .MuiButtonBase-root': {
                    color: textSecondary,
                    '&.Mui-selected': {
                        backgroundColor: alpha(COLORS.accentGold, 0.2),
                        color: COLORS.accentGold,
                    }
                },
                '& .MuiSelect-select': {
                    color: textSecondary,
                },
                '& .MuiSvgIcon-root': {
                    color: iconColor,
                }
            }
        },

        // State
        state: {
            pagination,
            globalFilter,
            isLoading,
            showAlertBanner: isError,
        },

        // Handlers
        onPaginationChange: setPagination,
        onGlobalFilterChange: setGlobalFilter,

        // Display
        columnFilterDisplayMode: "popover",
        paginationDisplayMode: 'pages',
        positionToolbarAlertBanner: 'bottom',

        muiToolbarAlertBannerProps: isError
            ? {
                color: 'error',
                children: showError || 'Error loading deposit and withdrawal transactions.',
                sx: {
                    backgroundColor: alpha('#f44336', 0.1),
                    border: `1px solid ${alpha('#f44336', 0.2)}`,
                    color: '#ff6b6b'
                }
            }
            : undefined,

        // Render custom top toolbar
        renderTopToolbar: ({ table }) => (
            <Box sx={{
                p: 2,
                borderBottom: `1px solid ${borderColor}`,
                background: headerBackground,
            }}>
                <Stack direction="row" alignItems="center" justifyContent="space-between">
                    <Stack direction="row" alignItems="center" spacing={1.5}>
                        <Typography variant="subtitle1" sx={{
                            fontWeight: 600,
                            color: textPrimary
                        }}>
                            Deposit & Withdrawal Records
                        </Typography>
                        <Chip
                            label={`${totalRecords} records`}
                            size="small"
                            variant="outlined"
                            sx={{
                                fontSize: '0.75rem',
                                color: textSecondary,
                                borderColor: borderColor,
                                backgroundColor: alpha(COLORS.greyDark, 0.1)
                            }}
                        />
                    </Stack>
                    <Stack direction="row" spacing={1}>
                        <IconButton
                            onClick={handleRefresh}
                            size="small"
                            sx={{
                                border: `1px solid ${borderColor}`,
                                color: iconColor,
                                backgroundColor: inputBackground,
                                '&:hover': {
                                    backgroundColor: hoverBackground
                                }
                            }}
                        >
                            <RefreshIcon fontSize="small" />
                        </IconButton>
                        <Button
                            variant="contained"
                            startIcon={<FileDownloadIcon />}
                            onClick={handleDownloadExcel}
                            size="small"
                            sx={{
                                textTransform: 'none',
                                fontWeight: 500,
                                backgroundColor: COLORS.accentGold,
                                color: COLORS.whiteMain,
                                '&:hover': {
                                    backgroundColor: alpha(COLORS.accentGold, 0.8)
                                }
                            }}
                        >
                            Export Excel
                        </Button>
                    </Stack>
                </Stack>
            </Box>
        ),
    });

    const handleFilterChange = useCallback((key, value) => {
        setFilters((prev) => ({ ...prev, [key]: value }));
    }, []);

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Box sx={{ 
                bgcolor: pageBgColor, 
                minHeight: '100vh',
                p: { xs: 2, md: 3 }
            }}>
                <Container maxWidth="xl" sx={{ py: 3 }}>
                    {/* Title Section */}
                    <Box sx={{ mb: 4 }}>
                        <Typography
                            variant='h5'
                            fontWeight={600}
                            fontSize="1.5rem"
                            color={textPrimary}
                            gutterBottom
                        >
                            Wallet Transactions History
                        </Typography>
                        <Typography variant="body2" color={textSecondary}>
                            View and manage all deposit and withdrawal transactions
                        </Typography>
                    </Box>

                    {/* Filters Section */}
                    <Paper
                        elevation={0}
                        sx={{
                            p: 3,
                            mb: 3,
                            border: `1px solid ${borderColor}`,
                            borderRadius: 2,
                            background: cardBgColor,
                        }}
                    >
                        {/* Filters Header */}
                        <Box sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            mb: 3
                        }}>
                            <Stack direction="row" alignItems="center" spacing={1.5}>
                                <FilterListIcon sx={{ color: iconColor, fontSize: 20 }} />
                                <Typography variant="subtitle1" fontWeight={600} color={textPrimary}>
                                    Filters
                                </Typography>
                                {activeFilterCount > 0 && (
                                    <Chip
                                        label={`${activeFilterCount} active`}
                                        size="small"
                                        onDelete={handleClearFilters}
                                        sx={{
                                            color: COLORS.accentGold,
                                            borderColor: COLORS.accentGold,
                                            backgroundColor: alpha(COLORS.accentGold, 0.1)
                                        }}
                                    />
                                )}
                            </Stack>
                            {activeFilterCount > 0 && (
                                <Button
                                    variant="text"
                                    startIcon={<ClearIcon />}
                                    onClick={handleClearFilters}
                                    size="small"
                                    sx={{
                                        color: iconColor,
                                        fontSize: '0.875rem',
                                        '&:hover': {
                                            color: '#ff6b6b',
                                            backgroundColor: alpha('#ff6b6b', 0.1)
                                        }
                                    }}
                                >
                                    Clear All
                                </Button>
                            )}
                        </Box>

                        {/* Search Bar */}
                        <Box sx={{ mb: 3 }}>
                            <TextField
                                fullWidth
                                placeholder="Search by reference, amount, remark, or any transaction detail..."
                                value={globalFilter}
                                onChange={(e) => setGlobalFilter(e.target.value)}
                                size="medium"
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <SearchIcon sx={{ color: iconColor }} />
                                        </InputAdornment>
                                    ),
                                    sx: {
                                        backgroundColor: inputBackground,
                                        borderRadius: 1,
                                        color: textPrimary,
                                        border: `1px solid ${borderColor}`,
                                        '&:hover': {
                                            borderColor: COLORS.accentGold
                                        },
                                        '& .MuiInputBase-input::placeholder': {
                                            color: textSecondary,
                                            opacity: 0.7
                                        },
                                        '& .MuiOutlinedInput-notchedOutline': {
                                            borderColor: 'transparent'
                                        }
                                    }
                                }}
                            />
                        </Box>

                        {/* Filter Grid */}
                        <Grid container spacing={2.5} sx={{ alignItems: 'flex-end' }}>
                            {/* Status Filter */}
                            <Grid item xs={12} sm={6} md={3}>
                                <FormControl fullWidth size="small">
                                    <Select
                                        value={filters.status}
                                        onChange={(e) => handleFilterChange('status', e.target.value)}
                                        displayEmpty
                                        sx={{
                                            backgroundColor: inputBackground,
                                            color: textPrimary,
                                            border: `1px solid ${borderColor}`,
                                            '& .MuiSelect-icon': {
                                                color: iconColor
                                            },
                                            '& .MuiOutlinedInput-notchedOutline': {
                                                borderColor: 'transparent'
                                            },
                                            '&:hover': {
                                                borderColor: COLORS.accentGold
                                            }
                                        }}
                                        MenuProps={{
                                            PaperProps: {
                                                sx: {
                                                    backgroundColor: paperBackground,
                                                    color: textPrimary,
                                                    border: `1px solid ${borderColor}`,
                                                    '& .MuiMenuItem-root': {
                                                        '&:hover': {
                                                            backgroundColor: hoverBackground
                                                        }
                                                    }
                                                }
                                            }
                                        }}
                                    >
                                        {STATUS_OPTIONS.map((option) => (
                                            <MenuItem
                                                key={option.value}
                                                value={option.value}
                                                sx={{
                                                    color: textPrimary
                                                }}
                                            >
                                                {option.label}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>

                            {/* Transaction Type Filter */}
                            <Grid item xs={12} sm={6} md={3}>
                                <FormControl fullWidth size="small">
                                    <Select
                                        value={filters.transactionType}
                                        onChange={(e) => handleFilterChange('transactionType', e.target.value)}
                                        displayEmpty
                                        sx={{
                                            backgroundColor: inputBackground,
                                            color: textPrimary,
                                            border: `1px solid ${borderColor}`,
                                            '& .MuiSelect-icon': {
                                                color: iconColor
                                            },
                                            '& .MuiOutlinedInput-notchedOutline': {
                                                borderColor: 'transparent'
                                            },
                                            '&:hover': {
                                                borderColor: COLORS.accentGold
                                            }
                                        }}
                                        MenuProps={{
                                            PaperProps: {
                                                sx: {
                                                    backgroundColor: paperBackground,
                                                    color: textPrimary,
                                                    border: `1px solid ${borderColor}`,
                                                    '& .MuiMenuItem-root': {
                                                        '&:hover': {
                                                            backgroundColor: hoverBackground
                                                        }
                                                    }
                                                }
                                            }
                                        }}
                                    >
                                        {TRANSACTION_TYPES.map((option) => (
                                            <MenuItem
                                                key={option.value}
                                                value={option.value}
                                                sx={{
                                                    color: textPrimary
                                                }}
                                            >
                                                {option.label}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>

                            {/* Payment Method Filter */}
                            <Grid item xs={12} sm={6} md={3}>
                                <FormControl fullWidth size="small">
                                    <Select
                                        value={filters.paymentMethod}
                                        onChange={(e) => handleFilterChange('paymentMethod', e.target.value)}
                                        displayEmpty
                                        sx={{
                                            backgroundColor: inputBackground,
                                            color: textPrimary,
                                            border: `1px solid ${borderColor}`,
                                            '& .MuiSelect-icon': {
                                                color: iconColor
                                            },
                                            '& .MuiOutlinedInput-notchedOutline': {
                                                borderColor: 'transparent'
                                            },
                                            '&:hover': {
                                                borderColor: COLORS.accentGold
                                            }
                                        }}
                                        MenuProps={{
                                            PaperProps: {
                                                sx: {
                                                    backgroundColor: paperBackground,
                                                    color: textPrimary,
                                                    border: `1px solid ${borderColor}`,
                                                    '& .MuiMenuItem-root': {
                                                        '&:hover': {
                                                            backgroundColor: hoverBackground
                                                        }
                                                    }
                                                }
                                            }
                                        }}
                                    >
                                        {PAYMENT_METHODS.map((option) => (
                                            <MenuItem
                                                key={option.value}
                                                value={option.value}
                                                sx={{
                                                    color: textPrimary
                                                }}
                                            >
                                                {option.label}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>

                            {/* Date Range Filter */}
                            <Grid item xs={12} sm={6} md={3}>
                                <Box sx={{ display: 'flex', gap: 1 }}>
                                    <DatePicker
                                        value={filters.fromDate}
                                        onChange={(newValue) => handleFilterChange('fromDate', newValue)}
                                        slotProps={{
                                            textField: {
                                                size: 'small',
                                                fullWidth: true,
                                                placeholder: "Start Date",
                                                sx: {
                                                    backgroundColor: inputBackground,
                                                    color: textPrimary,
                                                    border: `1px solid ${borderColor}`,
                                                    '& .MuiInputBase-input': {
                                                        fontSize: '0.875rem',
                                                        color: textPrimary,
                                                    },
                                                    '& .MuiOutlinedInput-notchedOutline': {
                                                        borderColor: 'transparent'
                                                    },
                                                    '& .MuiInputBase-input::placeholder': {
                                                        color: textSecondary,
                                                        opacity: 0.7
                                                    },
                                                    '& .MuiIconButton-root': {
                                                        color: iconColor
                                                    },
                                                    '&:hover': {
                                                        borderColor: COLORS.accentGold
                                                    }
                                                }
                                            },
                                            field: { clearable: true },
                                        }}
                                    />
                                    <DatePicker
                                        value={filters.toDate}
                                        onChange={(newValue) => handleFilterChange('toDate', newValue)}
                                        slotProps={{
                                            textField: {
                                                size: 'small',
                                                fullWidth: true,
                                                placeholder: "End Date",
                                                sx: {
                                                    backgroundColor: inputBackground,
                                                    color: textPrimary,
                                                    border: `1px solid ${borderColor}`,
                                                    '& .MuiInputBase-input': {
                                                        fontSize: '0.875rem',
                                                        color: textPrimary,
                                                    },
                                                    '& .MuiOutlinedInput-notchedOutline': {
                                                        borderColor: 'transparent'
                                                    },
                                                    '& .MuiInputBase-input::placeholder': {
                                                        color: textSecondary,
                                                        opacity: 0.7
                                                    },
                                                    '& .MuiIconButton-root': {
                                                        color: iconColor
                                                    },
                                                    '&:hover': {
                                                        borderColor: COLORS.accentGold
                                                    }
                                                }
                                            },
                                            field: { clearable: true },
                                        }}
                                    />
                                </Box>
                            </Grid>
                        </Grid>
                    </Paper>

                    {/* Loading State */}
                    {isLoading && (
                        <Box sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            minHeight: 400
                        }}>
                            <CircularProgress sx={{ color: COLORS.accentGold }} />
                        </Box>
                    )}

                    {/* Error State */}
                    {isError && (
                        <Alert
                            severity="error"
                            sx={{ 
                                mb: 3,
                                backgroundColor: alpha('#f44336', 0.1),
                                border: `1px solid ${alpha('#f44336', 0.2)}`,
                                color: '#ff6b6b'
                            }}
                            action={
                                <Button
                                    color="inherit"
                                    size="small"
                                    onClick={handleRefresh}
                                    sx={{ color: '#ff6b6b' }}
                                >
                                    Retry
                                </Button>
                            }
                        >
                            {showError || 'Failed to load transactions. Please try again.'}
                        </Alert>
                    )}

                    {/* Table Section */}
                    {!isLoading && !isError && (
                        <Paper
                            elevation={0}
                            sx={{
                                borderRadius: 2,
                                overflow: 'hidden',
                                border: `1px solid ${borderColor}`,
                                background: cardBgColor,
                            }}
                        >
                            <MaterialReactTable table={table} />
                        </Paper>
                    )}

                    {/* Empty State */}
                    {!isLoading && !isError && list.length === 0 && (
                        <Paper
                            sx={{
                                p: 6,
                                textAlign: 'center',
                                border: `1px dashed ${borderColor}`,
                                background: cardBgColor,
                                borderRadius: 2
                            }}
                        >
                            <SearchIcon sx={{
                                fontSize: 48,
                                color: textSecondary,
                                mb: 2,
                                opacity: 0.5
                            }} />
                            <Typography variant="h6" color={textSecondary} gutterBottom sx={{ opacity: 0.8 }}>
                                No transactions found
                            </Typography>
                            <Typography variant="body2" color={textSecondary} sx={{ opacity: 0.7 }}>
                                Try adjusting your filters or search terms
                            </Typography>
                        </Paper>
                    )}
                </Container>
            </Box>
        </LocalizationProvider>
    );
}

export default DepositWithdrawList;