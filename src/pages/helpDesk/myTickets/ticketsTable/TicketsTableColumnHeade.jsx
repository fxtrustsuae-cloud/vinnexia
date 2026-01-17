import { createMRTColumnHelper } from 'material-react-table';
import { Stack, Typography, Chip, Box } from '@mui/material';
import { Button } from '@mui/material';
import { Link } from 'react-router-dom';
import DialogBox from '../../../../components/DialogBox';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CloseIcon from '@mui/icons-material/Close';
import CircleIcon from '@mui/icons-material/Circle';

const columnHelper = createMRTColumnHelper();

export const TicketsTableColumnHeade = [
    columnHelper.accessor('subject', {
        header: 'Subject',
        size: 250,
        Cell: ({ row }) => {
            const value = row.original.subject;
            return (
                <Typography 
                    sx={{ 
                        fontWeight: 500,
                        fontSize: '0.875rem',
                        color: 'text.primary'
                    }}
                >
                    {value}
                </Typography>
            );
        },
    }),
    columnHelper.accessor('status', {
        header: 'Status',
        size: 120,
        Cell: ({ row }) => {
            const status = row.original.status;
            const getStatusColor = (status) => {
                switch(status) {
                    case 'OPEN': return 'warning';
                    case 'CLOSED': return 'success';
                    case 'PROCESSING': return 'info';
                    default: return 'default';
                }
            };
            const getStatusIcon = (status) => {
                switch(status) {
                    case 'OPEN': return <CircleIcon sx={{ fontSize: '8px', mr: 0.5 }} />;
                    case 'CLOSED': return <CircleIcon sx={{ fontSize: '8px', mr: 0.5 }} />;
                    case 'PROCESSING': return <CircleIcon sx={{ fontSize: '8px', mr: 0.5 }} />;
                    default: return null;
                }
            };
            
            return (
                <Chip
                    label={status}
                    color={getStatusColor(status)}
                    size="small"
                    icon={getStatusIcon(status)}
                    sx={{
                        fontWeight: 600,
                        fontSize: '0.75rem',
                        height: '24px',
                        '& .MuiChip-icon': {
                            ml: 0.5
                        }
                    }}
                />
            );
        },
    }),
    columnHelper.accessor('priority', {
        header: 'Priority',
        size: 120,
        Cell: ({ row }) => {
            const priority = row.original.priority;
            const getPriorityColor = (priority) => {
                switch(priority) {
                    case 'HIGH': return 'error';
                    case 'MEDIUM': return 'warning';
                    case 'LOW': return 'success';
                    default: return 'default';
                }
            };
            
            return (
                <Chip
                    label={priority}
                    color={getPriorityColor(priority)}
                    size="small"
                    variant="outlined"
                    sx={{
                        fontWeight: 600,
                        fontSize: '0.75rem',
                        height: '24px'
                    }}
                />
            );
        },
    }),
    columnHelper.accessor('createdAt', {
        header: 'Created Date',
        size: 150,
        Cell: ({ row }) => (
            <Box>
                <Typography 
                    variant="body2" 
                    sx={{ 
                        fontWeight: 500,
                        fontSize: '0.875rem',
                        color: 'text.primary'
                    }}
                >
                    {new Date(row.original.createdAt).toLocaleDateString()}
                </Typography>
                <Typography 
                    variant="caption" 
                    sx={{ 
                        color: 'text.secondary',
                        fontSize: '0.75rem'
                    }}
                >
                    {new Date(row.original.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </Typography>
            </Box>
        ),
    }),
    columnHelper.display({
        header: 'Actions',
        size: 150,
        Cell: ({ row }) => {
            const ticketId = row?.original?.id;
            const ticketStatus = row?.original?.status !== "CLOSED";
            
            return (
                <Stack direction="row" spacing={1}>
                    <Button
                        variant='contained'
                        component={Link}
                        to="/client/helpDesk/showTicket"
                        state={{ ticketId }}
                        size='small'
                        startIcon={<VisibilityIcon />}
                        sx={{
                            textTransform: "none",
                            borderRadius: '6px',
                            px: 2,
                            py: 0.5,
                            fontSize: '0.75rem',
                            fontWeight: 500,
                            boxShadow: 'none',
                            '&:hover': {
                                boxShadow: 'none'
                            }
                        }}
                    >
                        View
                    </Button>
                    
                    {ticketStatus && (
                        <DialogBox
                            ticketId={ticketId}
                            btnName="Close"
                            btnStartIcon={<CloseIcon />}
                            btnSx={{
                                textTransform: "none",
                                borderRadius: '6px',
                                px: 2,
                                py: 0.5,
                                fontSize: '0.75rem',
                                fontWeight: 500,
                                backgroundColor: 'error.main',
                                color: 'white',
                                boxShadow: 'none',
                                '&:hover': {
                                    backgroundColor: 'error.dark',
                                    boxShadow: 'none'
                                }
                            }}
                        />
                    )}
                </Stack>
            );
        },
    }),
];