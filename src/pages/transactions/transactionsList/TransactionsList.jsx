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
    alpha
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
import { useTransactionListQuery } from '../../../globalState/userState/userStateApis';
import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { TransactionsListHeaderColumn } from './TransactionsListHeaderColumn';
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
    { value: "PROCESSING", label: "Processing" },
    { value: "REJECTED", label: "Rejected" }
];

const TRANSACTION_TYPES = [
    { value: "", label: "All Types" },
    { value: "INTERNAL-DEPOSIT", label: "Internal Deposit" },
    { value: "INTERNAL-WITHDRAW", label: "Internal Withdraw" },
    { value: "WALLET-DEPOSIT", label: "Wallet Deposit" },
    { value: "WALLET-WITHDRAW", label: "Wallet Withdraw" },
    { value: "IB-WITHDRAW", label: "IB Withdraw" },
    { value: "INTERNAL-TRANSFER", label: "Internal Transfer" },
    { value: "CREDIT-DEPOSIT", label: "Credit Deposit" },
    { value: "BONUS-DEPOSIT", label: "Bonus Deposit" },
    { value: "CREDIT-WITHDRAW", label: "Credit Withdraw" },
    { value: "BONUS-WITHDRAW", label: "Bonus Withdraw" }
];

const PAYMENT_METHODS = [
    { value: "", label: "All Methods" },
    { value: "BANK", label: "Bank" },
    { value: "CASH", label: "Cash" },
    { value: "CRYPTO", label: "Crypto" }
];

function TransactionsList({ marginTop, login }) {
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

    const { data: listData, isLoading, isError, error, refetch } = useTransactionListQuery({
        page: pagination.pageIndex + 1,
        sizePerPage: pagination.pageSize,
        search: globalFilter,
        ...filters,
        fromDate: formattedFromDate,
        toDate: formattedToDate,
        login
    });

    const showError = error?.data?.message;
    const list = listData?.data?.usersList || [];
    const totalRecords = listData?.data?.totalRecords || 0;

    const handleDownloadExcel = () => {
        handleExportToExcel(list, `Transactions_${login}_${dayjs().format('YYYY-MM-DD')}.xlsx`, dispatch);
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

    const columns = useMemo(() => TransactionsListHeaderColumn, []);
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
        
        // Set dark mode for the table
        muiTableContainerProps: {
            sx: {
                backgroundColor: cardBgColor,
            }
        },

        // Table Styling - DARK THEME
        muiTablePaperProps: {
            elevation: 0,
            sx: {
                border: `1px solid ${borderColor}`,
                borderRadius: 2,
                overflow: 'hidden',
                backgroundColor: cardBgColor,
                backgroundImage: 'none',
                '& .MuiTable-root': {
                    backgroundColor: cardBgColor,
                }
            }
        },

        muiTableHeadRowProps: {
            sx: {
                backgroundColor: alpha(COLORS.darkBg, 0.95),
                '& .MuiTableCell-root': {
                    borderBottom: `1px solid ${borderColor}`,
                }
            }
        },

        muiTableHeadCellProps: {
            sx: {
                fontWeight: 600,
                fontSize: '0.875rem',
                py: 1.5,
                color: textPrimary,
                backgroundColor: alpha(COLORS.darkBg, 0.95),
                borderBottom: `2px solid ${alpha(COLORS.accentGold, 0.3)}`,
            }
        },

        muiTableBodyRowProps: {
            sx: {
                backgroundColor: cardBgColor,
                '&:hover': {
                    backgroundColor: hoverBackground,
                },
                borderBottom: `1px solid ${borderColor}`,
                '& .MuiTableCell-root': {
                    borderBottom: `1px solid ${borderColor}`,
                }
            }
        },

        muiTableBodyCellProps: {
            sx: {
                py: 1.5,
                fontSize: '0.875rem',
                color: textSecondary,
                backgroundColor: cardBgColor,
                borderBottom: `1px solid ${borderColor}`,
            }
        },

        muiTableFooterRowProps: {
            sx: {
                backgroundColor: alpha(COLORS.darkBg, 0.9),
                borderTop: `2px solid ${borderColor}`,
            }
        },

        muiPaginationProps: {
            rowsPerPageOptions: [5, 10, 25, 50],
            showRowsPerPage: true,
            sx: {
                backgroundColor: alpha(COLORS.darkBg, 0.9),
                borderTop: `1px solid ${borderColor}`,
                color: textSecondary,
                '& .MuiButtonBase-root': {
                    color: textSecondary,
                    backgroundColor: alpha(COLORS.darkBg, 0.7),
                    '&.Mui-selected': {
                        backgroundColor: alpha(COLORS.accentGold, 0.3),
                        color: COLORS.accentGold,
                        '&:hover': {
                            backgroundColor: alpha(COLORS.accentGold, 0.4),
                        }
                    },
                    '&:hover': {
                        backgroundColor: hoverBackground,
                    }
                },
                '& .MuiSelect-select': {
                    color: textSecondary,
                    backgroundColor: alpha(COLORS.darkBg, 0.7),
                },
                '& .MuiSvgIcon-root': {
                    color: iconColor,
                },
                '& .MuiInputBase-root': {
                    color: textSecondary,
                    backgroundColor: alpha(COLORS.darkBg, 0.7),
                    border: `1px solid ${borderColor}`,
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
                children: showError || 'Error loading transactions.',
                sx: {
                    backgroundColor: alpha('#f44336', 0.15),
                    border: `1px solid ${alpha('#f44336', 0.3)}`,
                    color: '#ff6b6b',
                    '& .MuiAlert-icon': {
                        color: '#ff6b6b'
                    }
                }
            }
            : undefined,

        // Render custom top toolbar
        renderTopToolbar: ({ table }) => (
            <Box sx={{
                p: 2,
                borderBottom: `1px solid ${borderColor}`,
                backgroundColor: alpha(COLORS.darkBg, 0.95),
                backgroundImage: `linear-gradient(135deg, ${alpha(COLORS.darkBg, 0.95)} 0%, ${alpha(COLORS.darkBg, 0.9)} 100%)`,
            }}>
                <Stack direction="row" alignItems="center" justifyContent="space-between">
                    <Stack direction="row" alignItems="center" spacing={1.5}>
                        <Typography variant="subtitle1" sx={{
                            fontWeight: 600,
                            color: textPrimary
                        }}>
                            Transaction Records
                        </Typography>
                        <Chip
                            label={`${totalRecords} records`}
                            size="small"
                            variant="outlined"
                            sx={{
                                fontSize: '0.75rem',
                                color: COLORS.accentGold,
                                borderColor: alpha(COLORS.accentGold, 0.5),
                                backgroundColor: alpha(COLORS.accentGold, 0.1)
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
                                backgroundColor: alpha(COLORS.darkBg, 0.7),
                                '&:hover': {
                                    backgroundColor: hoverBackground,
                                    borderColor: COLORS.accentGold,
                                    color: COLORS.accentGold
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
                                border: `1px solid ${alpha(COLORS.accentGold, 0.5)}`,
                                '&:hover': {
                                    backgroundColor: alpha(COLORS.accentGold, 0.8),
                                    boxShadow: `0 4px 12px ${alpha(COLORS.accentGold, 0.3)}`
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
                p: { xs: 2, md: 3 },
                mt: marginTop || 0
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
                            Accounts Transaction History
                        </Typography>
                        <Typography variant="body2" color={textSecondary}>
                            View and manage all transaction records
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
                            backgroundColor: cardBgColor,
                            backgroundImage: `linear-gradient(135deg, ${alpha("#2a2f34", 0.9)} 0%, ${alpha("#2a2f34", 0.95)} 100%)`,
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
                                <FilterListIcon sx={{ color: COLORS.accentGold, fontSize: 20 }} />
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
                                            borderColor: alpha(COLORS.accentGold, 0.5),
                                            backgroundColor: alpha(COLORS.accentGold, 0.1),
                                            '& .MuiChip-deleteIcon': {
                                                color: COLORS.accentGold,
                                                '&:hover': {
                                                    color: COLORS.whiteMain,
                                                    backgroundColor: alpha(COLORS.accentGold, 0.3)
                                                }
                                            }
                                        }}
                                    />
                                )}
                            </Stack>
                            {activeFilterCount > 0 && (
                                <Button
                                    variant="outlined"
                                    startIcon={<ClearIcon />}
                                    onClick={handleClearFilters}
                                    size="small"
                                    sx={{
                                        color: iconColor,
                                        fontSize: '0.875rem',
                                        borderColor: borderColor,
                                        backgroundColor: alpha(COLORS.darkBg, 0.5),
                                        '&:hover': { 
                                            color: '#ff6b6b',
                                            borderColor: '#ff6b6b',
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
                                    endAdornment: globalFilter && (
                                        <InputAdornment position="end">
                                            <IconButton
                                                size="small"
                                                onClick={() => setGlobalFilter("")}
                                                sx={{ color: iconColor }}
                                            >
                                                <ClearIcon fontSize="small" />
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                    sx: {
                                        backgroundColor: alpha(COLORS.darkBg, 0.7),
                                        borderRadius: 1,
                                        color: textPrimary,
                                        border: `1px solid ${borderColor}`,
                                        '&:hover': {
                                            borderColor: COLORS.accentGold
                                        },
                                        '&.Mui-focused': {
                                            borderColor: COLORS.accentGold,
                                            boxShadow: `0 0 0 2px ${alpha(COLORS.accentGold, 0.2)}`
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
                                            backgroundColor: alpha(COLORS.darkBg, 0.7),
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
                                            },
                                            '&.Mui-focused': {
                                                borderColor: COLORS.accentGold,
                                                boxShadow: `0 0 0 2px ${alpha(COLORS.accentGold, 0.2)}`
                                            }
                                        }}
                                        MenuProps={{
                                            PaperProps: {
                                                sx: {
                                                    backgroundColor: alpha(COLORS.darkBg, 0.95),
                                                    color: textPrimary,
                                                    border: `1px solid ${borderColor}`,
                                                    '& .MuiMenuItem-root': {
                                                        '&:hover': {
                                                            backgroundColor: hoverBackground
                                                        },
                                                        '&.Mui-selected': {
                                                            backgroundColor: alpha(COLORS.accentGold, 0.2),
                                                            color: COLORS.accentGold,
                                                            '&:hover': {
                                                                backgroundColor: alpha(COLORS.accentGold, 0.3)
                                                            }
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
                                            backgroundColor: alpha(COLORS.darkBg, 0.7),
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
                                            },
                                            '&.Mui-focused': {
                                                borderColor: COLORS.accentGold,
                                                boxShadow: `0 0 0 2px ${alpha(COLORS.accentGold, 0.2)}`
                                            }
                                        }}
                                        MenuProps={{
                                            PaperProps: {
                                                sx: {
                                                    backgroundColor: alpha(COLORS.darkBg, 0.95),
                                                    color: textPrimary,
                                                    border: `1px solid ${borderColor}`,
                                                    '& .MuiMenuItem-root': {
                                                        '&:hover': {
                                                            backgroundColor: hoverBackground
                                                        },
                                                        '&.Mui-selected': {
                                                            backgroundColor: alpha(COLORS.accentGold, 0.2),
                                                            color: COLORS.accentGold,
                                                            '&:hover': {
                                                                backgroundColor: alpha(COLORS.accentGold, 0.3)
                                                            }
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
                                            backgroundColor: alpha(COLORS.darkBg, 0.7),
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
                                            },
                                            '&.Mui-focused': {
                                                borderColor: COLORS.accentGold,
                                                boxShadow: `0 0 0 2px ${alpha(COLORS.accentGold, 0.2)}`
                                            }
                                        }}
                                        MenuProps={{
                                            PaperProps: {
                                                sx: {
                                                    backgroundColor: alpha(COLORS.darkBg, 0.95),
                                                    color: textPrimary,
                                                    border: `1px solid ${borderColor}`,
                                                    '& .MuiMenuItem-root': {
                                                        '&:hover': {
                                                            backgroundColor: hoverBackground
                                                        },
                                                        '&.Mui-selected': {
                                                            backgroundColor: alpha(COLORS.accentGold, 0.2),
                                                            color: COLORS.accentGold,
                                                            '&:hover': {
                                                                backgroundColor: alpha(COLORS.accentGold, 0.3)
                                                            }
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
                                                    backgroundColor: alpha(COLORS.darkBg, 0.7),
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
                                                    },
                                                    '&.Mui-focused': {
                                                        borderColor: COLORS.accentGold,
                                                        boxShadow: `0 0 0 2px ${alpha(COLORS.accentGold, 0.2)}`
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
                                                    backgroundColor: alpha(COLORS.darkBg, 0.7),
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
                                                    },
                                                    '&.Mui-focused': {
                                                        borderColor: COLORS.accentGold,
                                                        boxShadow: `0 0 0 2px ${alpha(COLORS.accentGold, 0.2)}`
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
                            minHeight: 400,
                            backgroundColor: alpha(COLORS.darkBg, 0.8),
                            borderRadius: 2,
                            border: `1px solid ${borderColor}`
                        }}>
                            <CircularProgress sx={{ color: COLORS.accentGold }} />
                            <Typography variant="body2" color={textSecondary} sx={{ ml: 2 }}>
                                Loading transactions...
                            </Typography>
                        </Box>
                    )}

                    {/* Error State */}
                    {isError && (
                        <Alert
                            severity="error"
                            sx={{ 
                                mb: 3,
                                backgroundColor: alpha('#f44336', 0.15),
                                border: `1px solid ${alpha('#f44336', 0.3)}`,
                                color: '#ff6b6b',
                                '& .MuiAlert-icon': {
                                    color: '#ff6b6b'
                                }
                            }}
                            action={
                                <Button
                                    color="inherit"
                                    size="small"
                                    onClick={handleRefresh}
                                    sx={{ 
                                        color: '#ff6b6b',
                                        backgroundColor: alpha('#f44336', 0.1),
                                        '&:hover': {
                                            backgroundColor: alpha('#f44336', 0.2)
                                        }
                                    }}
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
                                backgroundColor: cardBgColor,
                                backgroundImage: `linear-gradient(135deg, ${alpha("#2a2f34", 0.9)} 0%, ${alpha("#2a2f34", 0.95)} 100%)`,
                                '& .MuiTable-root': {
                                    backgroundColor: 'transparent',
                                },
                                '& .MuiTableCell-root': {
                                    borderColor: borderColor,
                                }
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
                                backgroundColor: cardBgColor,
                                backgroundImage: `linear-gradient(135deg, ${alpha("#2a2f34", 0.9)} 0%, ${alpha("#2a2f34", 0.95)} 100%)`,
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
                            <Typography variant="body2" color={textSecondary} sx={{ opacity: 0.7, mb: 3 }}>
                                Try adjusting your filters or search terms
                            </Typography>
                            <Button
                                variant="outlined"
                                startIcon={<ClearIcon />}
                                onClick={handleClearFilters}
                                sx={{
                                    color: textSecondary,
                                    borderColor: borderColor,
                                    '&:hover': {
                                        color: COLORS.accentGold,
                                        borderColor: COLORS.accentGold,
                                        backgroundColor: alpha(COLORS.accentGold, 0.1)
                                    }
                                }}
                            >
                                Clear All Filters
                            </Button>
                        </Paper>
                    )}
                </Container>
            </Box>
        </LocalizationProvider>
    );
}

export default TransactionsList;