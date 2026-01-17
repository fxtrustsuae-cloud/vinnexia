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
    alpha, 
    useTheme,
    Radio,
    RadioGroup,
    FormControlLabel,
    FormControl
} from '@mui/material';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import { useState, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { MT5AccountListColumnHeader } from "./MT5AccountListColumnHeader"
import { useMt5AccountListQuery } from '../../../globalState/mt5State/mt5StateApis';
import { handleExportToExcel } from '../../../utils/exportToExcel';

// Color palette from your logo
const COLORS = {
  accentGold: "#7E6233",
  goldLight: "#B08D5C",
  whiteMain: "#FEFEFE",
  blackDark: "#11191E",
  greyLight: "#E8EAE9",
  greyMedium: "#B3B6B6",
  greyDark: "#848F94",
  darkBg: "#1a1f24",
  darkBgLight: "#22282d",
  darkBgLighter: "#2a3036",
};

function MT5AccountList() {
    const theme = useTheme();
    const dispatch = useDispatch()

    const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });
    const [accountType, setAccountType] = useState("REAL"); // REAL is pre-selected

    const { data: listData, isLoading, isError, error } = useMt5AccountListQuery({
        page: pagination.pageIndex + 1,
        sizePerPage: pagination.pageSize,
        type: accountType === "ALL" ? "" : accountType
    });

    const showError = error?.data?.message;
    const list = listData?.data?.mt5AccountList || [];
    const columns = useMemo(() => MT5AccountListColumnHeader, []);

    // Calculate stats
    const accountStats = useMemo(() => {
        const realAccounts = list.filter(item => item.accountType === 'REAL').length;
        const demoAccounts = list.filter(item => item.accountType === 'DEMO').length;
        const totalAccounts = list.length;
        const totalBalance = list.reduce((sum, item) => sum + (parseFloat(item.Balance) || 0), 0);
        
        return { realAccounts, demoAccounts, totalAccounts, totalBalance };
    }, [list]);

    const handleDownloadExcel = () => {
        handleExportToExcel(list, "MT5AccountList.xlsx", dispatch);
    };

    const rowCount = useMemo(() => listData?.data?.totalRecords || 0, [listData]);
    const data = useMemo(() => list, [list]);

    const handleAccountTypeChange = (event) => {
        setAccountType(event.target.value);
    };

    const table = useMaterialReactTable({
        columns: columns,
        data: isError ? [] : data,
        enableColumnFilters: false,
        enableSorting: false,
        enableColumnActions: false,
        manualPagination: true,
        manualFiltering: true,
        rowCount: rowCount,
        enableStickyHeader: true,
        enableStickyFooter: true,
        state: {
            pagination,
            isLoading,
            showAlertBanner: isError,
        },
        onPaginationChange: setPagination,
        columnFilterDisplayMode: "popover",
        paginationDisplayMode: 'pages',
        positionToolbarAlertBanner: 'bottom',
        
        // Enable dark mode for the table
        muiTableBodyRowDragHandleProps: {
            sx: {
                color: COLORS.goldLight,
            }
        },
        
        // Bottom Toolbar Styling
        muiBottomToolbarProps: {
            sx: {
                backgroundColor: COLORS.darkBgLight,
                borderTop: `1px solid ${COLORS.greyDark}60`,
                '& .MuiSvgIcon-root': {
                    color: COLORS.goldLight,
                }
            }
        },
        
        // Top Toolbar Styling
        muiTopToolbarProps: {
            sx: {
                backgroundColor: COLORS.darkBgLight,
                borderBottom: `1px solid ${COLORS.greyDark}60`,
                '& .MuiSvgIcon-root': {
                    color: COLORS.goldLight,
                }
            }
        },
        
        // Toolbar Internal Box
        muiToolbarInternalButtonsProps: {
            sx: {
                color: COLORS.greyLight,
                '& .MuiButton-root': {
                    color: COLORS.goldLight,
                    '&:hover': {
                        backgroundColor: `${COLORS.accentGold}20`,
                    },
                    '& .MuiSvgIcon-root': {
                        color: COLORS.goldLight,
                    }
                }
            }
        },
        
        // Density Selector
        muiTablePaginationProps: {
            sx: {
                color: COLORS.greyLight,
                '& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows': {
                    color: COLORS.greyLight,
                },
                '& .MuiSelect-select': {
                    color: COLORS.greyLight,
                    backgroundColor: COLORS.darkBg,
                },
                '& .MuiSvgIcon-root': {
                    color: COLORS.goldLight,
                }
            }
        },
        
        // Table Paper
        muiTablePaperProps: {
            elevation: 0,
            sx: {
                border: `1px solid ${COLORS.greyDark}80`,
                borderRadius: '12px',
                overflow: 'hidden',
                backgroundColor: COLORS.darkBg,
                background: `linear-gradient(135deg, ${COLORS.darkBg} 0%, ${COLORS.darkBgLight} 100%)`,
                '& .MuiSvgIcon-root': {
                    color: COLORS.goldLight,
                }
            }
        },
        
        // Main Table Container
        muiTableContainerProps: {
            sx: {
                maxHeight: '600px',
                backgroundColor: COLORS.darkBgLight,
                '&::-webkit-scrollbar': {
                    width: '8px',
                    height: '8px',
                },
                '&::-webkit-scrollbar-track': {
                    background: COLORS.darkBg,
                    borderRadius: '4px',
                },
                '&::-webkit-scrollbar-thumb': {
                    background: COLORS.accentGold,
                    borderRadius: '4px',
                    '&:hover': {
                        background: COLORS.goldLight,
                    }
                },
                '& .MuiSvgIcon-root': {
                    color: COLORS.goldLight,
                }
            }
        },
        
        // Table Props
        muiTableProps: {
            sx: {
                backgroundColor: COLORS.darkBgLight,
                '& .MuiTable-root': {
                    backgroundColor: COLORS.darkBgLight,
                    borderCollapse: 'collapse',
                },
                '& .MuiSvgIcon-root': {
                    color: COLORS.goldLight,
                }
            }
        },
        
        // Table Head Props
        muiTableHeadProps: {
            sx: {
                backgroundColor: COLORS.darkBgLight,
                '& .MuiSvgIcon-root': {
                    color: COLORS.goldLight,
                }
            }
        },
        
        // Table Head Cell Props
        muiTableHeadCellProps: {
            sx: {
                backgroundColor: `${COLORS.accentGold}20`,
                fontWeight: 700,
                fontSize: '0.875rem',
                color: COLORS.goldLight,
                borderBottom: `2px solid ${COLORS.accentGold}50`,
                padding: '16px',
                '&:hover': {
                    backgroundColor: `${COLORS.accentGold}30`,
                },
                '& .Mui-TableHeadCell-Content': {
                    color: COLORS.goldLight,
                },
                '& .Mui-TableHeadCell-Content-Labels': {
                    color: COLORS.goldLight,
                },
                '& .Mui-TableHeadCell-Content-Wrapper': {
                    color: COLORS.goldLight,
                },
                '& .MuiButton-root': {
                    color: COLORS.goldLight,
                    '& .MuiSvgIcon-root': {
                        color: COLORS.goldLight,
                    }
                },
                '& svg': {
                    color: COLORS.goldLight,
                }
            }
        },
        
        // Table Body Props
        muiTableBodyProps: {
            sx: {
                backgroundColor: COLORS.darkBgLight,
                '& .MuiTableBody-root': {
                    backgroundColor: COLORS.darkBgLight,
                },
                '& .MuiSvgIcon-root': {
                    color: COLORS.goldLight,
                }
            }
        },
        
        // Table Body Row Props
        muiTableBodyRowProps: ({ row }) => ({
            sx: {
                backgroundColor: row.index % 2 === 0 ? COLORS.darkBgLight : COLORS.darkBgLighter,
                '&:hover': {
                    backgroundColor: `${COLORS.accentGold}15`,
                },
                '& .MuiTableRow-root': {
                    backgroundColor: 'inherit',
                },
                '& .MuiSvgIcon-root': {
                    color: COLORS.goldLight,
                }
            }
        }),
        
        // Table Body Cell Props
        muiTableBodyCellProps: {
            sx: {
                fontSize: '0.875rem',
                color: COLORS.greyLight,
                borderBottom: `1px solid ${COLORS.greyDark}40`,
                fontWeight: 500,
                backgroundColor: 'inherit',
                padding: '12px 16px',
                '&:hover': {
                    backgroundColor: `${COLORS.accentGold}10`,
                },
                '& .MuiTypography-root': {
                    color: 'inherit',
                },
                '& .MuiSvgIcon-root': {
                    color: COLORS.goldLight,
                },
                '& svg': {
                    color: COLORS.goldLight,
                }
            }
        },
        
        // Pagination Props
        muiPaginationProps: {
            rowsPerPageOptions: [10, 20, 50],
            showFirstButton: true,
            showLastButton: true,
            sx: {
                backgroundColor: COLORS.darkBgLight,
                borderTop: `1px solid ${COLORS.greyDark}60`,
                padding: '16px',
                '& .MuiPaginationItem-root': {
                    color: COLORS.greyLight,
                    fontSize: '0.875rem',
                    fontWeight: 500,
                    '&.Mui-selected': {
                        backgroundColor: COLORS.accentGold,
                        color: COLORS.whiteMain,
                        fontWeight: 600,
                        '&:hover': {
                            backgroundColor: COLORS.goldLight,
                        }
                    },
                    '&:hover': {
                        backgroundColor: `${COLORS.accentGold}25`,
                        color: COLORS.whiteMain,
                    }
                },
                '& .MuiPaginationItem-ellipsis': {
                    color: COLORS.greyMedium,
                },
                '& .MuiSelect-select, & .MuiInputBase-root': {
                    color: COLORS.greyLight,
                    backgroundColor: COLORS.darkBg,
                    borderColor: `${COLORS.greyDark}60`,
                    '& .MuiSelect-icon': {
                        color: COLORS.goldLight,
                    }
                },
                '& .MuiTablePagination-selectLabel': {
                    color: COLORS.greyLight,
                },
                '& .MuiTablePagination-displayedRows': {
                    color: COLORS.greyLight,
                },
                '& .MuiSvgIcon-root': {
                    color: COLORS.goldLight,
                }
            }
        },
        
        // Toolbar Alert Banner
        muiToolbarAlertBannerProps: isError
            ? {
                color: 'error',
                children: showError || 'Error loading MT5 accounts.',
                sx: {
                    borderRadius: '8px',
                    margin: '8px',
                    backgroundColor: '#ff6b6b20',
                    border: '1px solid #ff6b6b50',
                    color: '#ff6b6b',
                    fontWeight: 500,
                    '& .MuiSvgIcon-root': {
                        color: '#ff6b6b',
                    }
                }
            }
            : undefined,
            
        // Empty State
        muiEmptyTableRowProps: {
            sx: {
                backgroundColor: COLORS.darkBgLight,
                '& .MuiTableCell-root': {
                    color: COLORS.greyMedium,
                    textAlign: 'center',
                    padding: '40px',
                    fontSize: '1rem',
                    fontWeight: 500,
                },
                '& .MuiSvgIcon-root': {
                    color: COLORS.goldLight,
                }
            }
        },
        
        // Column Filter TextField
        muiFilterTextFieldProps: {
            sx: {
                color: COLORS.greyLight,
                '& .MuiInputBase-input': {
                    color: COLORS.greyLight,
                },
                '& .MuiInputLabel-root': {
                    color: COLORS.greyLight,
                },
                '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                        borderColor: COLORS.greyDark,
                    },
                    '&:hover fieldset': {
                        borderColor: COLORS.goldLight,
                    },
                },
                '& .MuiSvgIcon-root': {
                    color: COLORS.goldLight,
                }
            }
        },
        
        // Progress bar
        muiLinearProgressProps: {
            sx: {
                backgroundColor: COLORS.darkBg,
                '& .MuiLinearProgress-bar': {
                    backgroundColor: COLORS.goldLight,
                }
            }
        },
        
        // Global icon styling
        muiSelectCheckboxProps: {
            sx: {
                color: COLORS.goldLight,
                '&.Mui-checked': {
                    color: COLORS.goldLight,
                }
            }
        },
        
        // Sort icons
        muiTableSortLabelProps: {
            sx: {
                color: COLORS.goldLight,
                '& .MuiTableSortLabel-icon': {
                    color: COLORS.goldLight,
                }
            }
        },
        
        // Expansion icons
        muiExpandButtonProps: {
            sx: {
                color: COLORS.goldLight,
            }
        },
        
        // Detail panel icons
        muiDetailPanelProps: {
            sx: {
                backgroundColor: COLORS.darkBgLighter,
                '& .MuiSvgIcon-root': {
                    color: COLORS.goldLight,
                }
            }
        },
        
        renderTopToolbarCustomActions: ({ table }) => (
            <Stack 
                direction="row" 
                alignItems="center" 
                spacing={2}
                sx={{ 
                    px: 2,
                    py: 1.5,
                    borderBottom: `1px solid ${COLORS.greyDark}60`,
                    backgroundColor: COLORS.darkBg,
                    minHeight: '60px',
                }}
            >
                <Typography 
                    variant="subtitle1" 
                    fontWeight={700}
                    sx={{ 
                        color: COLORS.goldLight,
                        fontSize: '1rem',
                        textShadow: '0 1px 1px rgba(0,0,0,0.3)',
                    }}
                >
                    {accountType === "ALL" ? "All Trading Accounts" : 
                     accountType === "REAL" ? "Real Trading Accounts" : "Demo Trading Accounts"}
                </Typography>
                
                <Box sx={{ flex: 1 }} />
                
                <Button
                    variant="contained"
                    onClick={handleDownloadExcel}
                    startIcon={<FileDownloadIcon sx={{ color: COLORS.whiteMain }} />}
                    sx={{
                        textTransform: 'none',
                        fontWeight: 600,
                        borderRadius: '8px',
                        px: 2.5,
                        py: 1,
                        background: `linear-gradient(135deg, ${COLORS.accentGold}, ${COLORS.goldLight})`,
                        color: COLORS.whiteMain,
                        border: `1px solid ${COLORS.goldLight}80`,
                        boxShadow: `0 4px 12px ${COLORS.accentGold}40`,
                        transition: 'all 0.3s ease',
                        fontSize: '0.875rem',
                        '&:hover': {
                            background: `linear-gradient(135deg, ${COLORS.goldLight}, ${COLORS.accentGold})`,
                            boxShadow: `0 6px 20px ${COLORS.accentGold}60`,
                            transform: "translateY(-2px)",
                        }
                    }}
                >
                    Export Excel
                </Button>
            </Stack>
        ),
        
        renderBottomToolbarCustomActions: ({ table }) => (
            <Typography 
                variant="caption" 
                sx={{ 
                    color: COLORS.greyMedium,
                    px: 2,
                    py: 1.5,
                    backgroundColor: COLORS.darkBg,
                    borderTop: `1px solid ${COLORS.greyDark}60`,
                    width: '100%',
                    fontSize: '0.75rem',
                    fontWeight: 500,
                }}
            >
                Showing {table.getRowModel().rows.length} of {rowCount} accounts
            </Typography>
        ),
    });

    return (
        <Container maxWidth="xl" sx={{ 
            py: { xs: 2, md: 3 },
            backgroundColor: COLORS.blackDark,
            minHeight: '100vh',
        }}>
            {/* Header Section */}
            <Box sx={{ mb: 3 }}>
                <Stack direction="row" alignItems="center" spacing={2} mb={1}>
                    <AccountBalanceIcon 
                        sx={{ 
                            color: COLORS.goldLight,
                            fontSize: '1.75rem',
                            filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.3))'
                        }} 
                    />
                    <Typography 
                        variant="h5" 
                        fontWeight={700}
                        sx={{ 
                            fontSize: { xs: '1.5rem', md: '1.75rem' },
                            color: COLORS.goldLight,
                            textShadow: '0 1px 2px rgba(0,0,0,0.3)',
                        }}
                    >
                        Trading Accounts
                    </Typography>
                </Stack>
            </Box>

            {/* Filter Section with Radio Buttons */}
            <Paper 
                elevation={0}
                sx={{
                    p: 3,
                    mb: 3,
                    borderRadius: '12px',
                    background: `linear-gradient(135deg, ${COLORS.darkBg} 0%, ${COLORS.darkBgLight} 100%)`,
                    border: `1px solid ${COLORS.greyDark}80`,
                    boxShadow: `0 4px 20px ${COLORS.blackDark}80`,
                    position: 'relative',
                    overflow: 'hidden',
                    '&:before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        height: '2px',
                        background: `linear-gradient(90deg, transparent, ${COLORS.accentGold}80, ${COLORS.goldLight}, ${COLORS.accentGold}80, transparent)`,
                    }
                }}
            >
                <Stack 
                    direction={{ xs: 'column', sm: 'row' }} 
                    spacing={3}
                    alignItems={{ xs: 'flex-start', sm: 'center' }}
                    justifyContent="space-between"
                >
                    <Box sx={{ flex: 1 }}>
                        <Typography 
                            variant="subtitle1" 
                            fontWeight={600}
                            sx={{ 
                                color: COLORS.goldLight,
                                mb: 2,
                                fontSize: '1rem',
                                textShadow: '0 1px 1px rgba(0,0,0,0.2)',
                            }}
                        >
                            Account Type
                        </Typography>
                        
                        <FormControl component="fieldset">
                            <RadioGroup
                                row
                                aria-label="account-type"
                                name="account-type-radio-group"
                                value={accountType}
                                onChange={handleAccountTypeChange}
                                sx={{ gap: { xs: 1, sm: 3 } }}
                            >
                                <FormControlLabel 
                                    value="ALL" 
                                    control={
                                        <Radio 
                                            size="small"
                                            sx={{
                                                color: COLORS.greyMedium,
                                                '&.Mui-checked': {
                                                    color: COLORS.goldLight,
                                                },
                                                '&:hover': {
                                                    backgroundColor: `${COLORS.accentGold}15`,
                                                }
                                            }}
                                        />
                                    } 
                                    label={
                                        <Typography variant="body2" sx={{ 
                                            fontWeight: accountType === "ALL" ? 700 : 500,
                                            color: accountType === "ALL" ? COLORS.goldLight : COLORS.greyLight,
                                            fontSize: '0.875rem',
                                        }}
                                        >
                                            All Accounts
                                        </Typography>
                                    }
                                    sx={{ mr: 0 }}
                                />
                                
                                <FormControlLabel 
                                    value="REAL" 
                                    control={
                                        <Radio 
                                            size="small"
                                            sx={{
                                                color: COLORS.greyMedium,
                                                '&.Mui-checked': {
                                                    color: COLORS.goldLight,
                                                },
                                                '&:hover': {
                                                    backgroundColor: `${COLORS.accentGold}15`,
                                                }
                                            }}
                                        />
                                    } 
                                    label={
                                        <Typography variant="body2" sx={{ 
                                            fontWeight: accountType === "REAL" ? 700 : 500,
                                            color: accountType === "REAL" ? COLORS.goldLight : COLORS.greyLight,
                                            fontSize: '0.875rem',
                                        }}
                                        >
                                            Real Accounts
                                        </Typography>
                                    }
                                    sx={{ mr: 0 }}
                                />
                                
                                <FormControlLabel 
                                    value="DEMO" 
                                    control={
                                        <Radio 
                                            size="small"
                                            sx={{
                                                color: COLORS.greyMedium,
                                                '&.Mui-checked': {
                                                    color: COLORS.goldLight,
                                                },
                                                '&:hover': {
                                                    backgroundColor: `${COLORS.accentGold}15`,
                                                }
                                            }}
                                        />
                                    } 
                                    label={
                                        <Typography variant="body2" sx={{ 
                                            fontWeight: accountType === "DEMO" ? 700 : 500,
                                            color: accountType === "DEMO" ? COLORS.goldLight : COLORS.greyLight,
                                            fontSize: '0.875rem',
                                        }}
                                        >
                                            Demo Accounts
                                        </Typography>
                                    }
                                    sx={{ mr: 0 }}
                                />
                            </RadioGroup>
                        </FormControl>
                    </Box>
                    
                    <Stack direction="row" alignItems="center" spacing={2}>
                        {/* Account Stats */}
                        <Box sx={{ 
                            display: { xs: 'none', sm: 'flex' },
                            alignItems: 'center',
                            gap: 1
                        }}>
                            {accountType === "ALL" && (
                                <>
                                    <Chip
                                        label={`${accountStats.realAccounts} Real`}
                                        size="small"
                                        variant="outlined"
                                        sx={{
                                            fontWeight: 600,
                                            fontSize: '0.75rem',
                                            height: '28px',
                                            borderColor: `${COLORS.goldLight}50`,
                                            color: COLORS.goldLight,
                                            backgroundColor: `${COLORS.accentGold}15`,
                                            '&:hover': {
                                                backgroundColor: `${COLORS.accentGold}25`,
                                            }
                                        }}
                                    />
                                    <Chip
                                        label={`${accountStats.demoAccounts} Demo`}
                                        size="small"
                                        variant="outlined"
                                        sx={{
                                            fontWeight: 600,
                                            fontSize: '0.75rem',
                                            height: '28px',
                                            borderColor: `${COLORS.greyLight}50`,
                                            color: COLORS.greyLight,
                                            backgroundColor: `${COLORS.greyDark}15`,
                                            '&:hover': {
                                                backgroundColor: `${COLORS.greyDark}25`,
                                            }
                                        }}
                                    />
                                </>
                            )}
                            
                            {accountType === "REAL" && (
                                <Chip
                                    label={`${accountStats.realAccounts} Real Accounts`}
                                    size="small"
                                    variant="outlined"
                                    sx={{
                                        fontWeight: 600,
                                        fontSize: '0.75rem',
                                        height: '28px',
                                        borderColor: `${COLORS.goldLight}50`,
                                        color: COLORS.goldLight,
                                        backgroundColor: `${COLORS.accentGold}15`,
                                        '&:hover': {
                                            backgroundColor: `${COLORS.accentGold}25`,
                                        }
                                    }}
                                />
                            )}
                            
                            {accountType === "DEMO" && (
                                <Chip
                                    label={`${accountStats.demoAccounts} Demo Accounts`}
                                    size="small"
                                    variant="outlined"
                                    sx={{
                                        fontWeight: 600,
                                        fontSize: '0.75rem',
                                        height: '28px',
                                        borderColor: `${COLORS.greyLight}50`,
                                        color: COLORS.greyLight,
                                        backgroundColor: `${COLORS.greyDark}15`,
                                        '&:hover': {
                                            backgroundColor: `${COLORS.greyDark}25`,
                                        }
                                    }}
                                />
                            )}
                        </Box>
                        
                        {/* Total Accounts Chip */}
                        <Chip
                            label={`${accountStats.totalAccounts} accounts found`}
                            size="medium"
                            variant="filled"
                            sx={{
                                fontWeight: 700,
                                fontSize: '0.875rem',
                                height: '36px',
                                backgroundColor: COLORS.accentGold,
                                color: COLORS.whiteMain,
                                boxShadow: `0 4px 12px ${COLORS.accentGold}30`,
                                border: `1px solid ${COLORS.goldLight}50`,
                                '&:hover': {
                                    backgroundColor: COLORS.goldLight,
                                    transform: 'translateY(-2px)',
                                },
                                transition: 'all 0.3s ease',
                            }}
                        />
                    </Stack>
                </Stack>
            </Paper>

            {/* Table Section */}
            <Box sx={{ 
                borderRadius: '12px',
                overflow: 'hidden',
                boxShadow: `0 4px 20px ${COLORS.blackDark}80`,
                position: 'relative',
                '&:before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '2px',
                    background: `linear-gradient(90deg, transparent, ${COLORS.accentGold}80, ${COLORS.goldLight}, ${COLORS.accentGold}80, transparent)`,
                    zIndex: 1,
                },
                // Global icon styling for the entire table container
                '& .MuiSvgIcon-root': {
                    color: `${COLORS.goldLight} !important`,
                },
                '& svg': {
                    color: `${COLORS.goldLight} !important`,
                }
            }}>
                <MaterialReactTable 
                    table={table} 
                    // Additional dark mode overrides
                    muiTableBodyCellProps={{
                        sx: {
                            color: COLORS.greyLight,
                            backgroundColor: 'inherit',
                            '& svg': {
                                color: COLORS.goldLight,
                            }
                        }
                    }}
                />
            </Box>
        </Container>
    );
};

export default MT5AccountList;