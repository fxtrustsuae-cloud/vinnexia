import React, { useState } from 'react';
import {
  Box,
  Button,
  Typography,
  Stack,
  Container,
  useMediaQuery,
  Card,
  CardContent,
  Grid,
  TextField,
  Chip,
  CircularProgress,
  Alert,
  Modal,
  InputLabel,
  IconButton,
  InputAdornment,
  Avatar,
  Badge,
  Tabs,
  Tab,
} from '@mui/material';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import SearchIcon from '@mui/icons-material/Search';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PendingIcon from '@mui/icons-material/Pending';
import CancelIcon from '@mui/icons-material/Cancel';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import DescriptionIcon from '@mui/icons-material/Description';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import FolderIcon from '@mui/icons-material/Folder';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import ImageIcon from '@mui/icons-material/Image';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import DownloadIcon from '@mui/icons-material/Download';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import { useDispatch } from 'react-redux';
import { useGetDocumentDataQuery } from '../../../globalState/complianceState/complianceStateApis';
import { handleExportToExcel } from '../../../utils/exportToExcel';
import { useAddBankMutation } from '../../../globalState/complianceState/complianceStateApis';
import { setNotification } from "../../../globalState/notificationState/notificationStateSlice"
import FileUploadTextArea from '../../../components/FileUploadTextArea';
import { useForm } from 'react-hook-form';

// Dark theme color palette
const COLORS = {
  // Dark background colors
  background: '#121212',
  paper: '#1e1e1e',
  cardHeaderBg: '#2d2d2d',
  
  // Text colors for dark theme
  textPrimary: '#ffffff',
  textSecondary: '#b0b0b0',
  textDisabled: '#666666',
  
  // Border and divider colors
  border: '#333333',
  borderLight: '#404040',
  divider: '#2a2a2a',
  
  // Primary accent color (gold)
  primary: '#7E6233',
  primaryDark: '#5A4724',
  primaryLight: '#A68B5C',
  
  // Status colors
  success: '#4caf50',
  error: '#f44336',
  warning: '#ff9800',
  info: '#2196f3',
  
  // Additional colors
  white: '#ffffff',
  black: '#11191E',
};

function DocumentList() {
  const downSm = useMediaQuery('(max-width:600px)');
  const dispatch = useDispatch();

  // State for Search and Add Bank Modal
  const [globalFilter, setGlobalFilter] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [openBankModal, setOpenBankModal] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [viewerModal, setViewerModal] = useState({
    open: false,
    url: null,
    title: ''
  });

  // React Hook Form for Add Bank
  const { 
    register, 
    handleSubmit, 
    reset, 
    setValue, 
    formState: { errors, isSubmitting } 
  } = useForm({
    defaultValues: {
      holderName: "",
      accountNo: "",
      ifscCode: "",
      ibanNo: "",
      bankName: "",
      bankAddress: "",
      country: "",
      image: null,
    },
  });

  // Add Bank Mutation
  const [addBank, { isLoading: isAddingBank }] = useAddBankMutation();

  // Fetch Document Data
  const { data: listData, isLoading, isError, error } = useGetDocumentDataQuery({
    search: globalFilter,
  });

  // Document List Handlers
  const handleSearch = (e) => {
    e.preventDefault();
    setGlobalFilter(searchInput);
  };

  const handleDownloadExcel = () => {
    const list = listData?.data ? [listData.data] : [];
    handleExportToExcel(list, "DocumentList.xlsx", dispatch);
  };

  const handleViewDocument = (documentUrl, title = 'Document') => {
    if (!documentUrl) return;
    
    // Check if it's an image
    const isImage = /\.(jpg|jpeg|png|gif|bmp|webp)$/i.test(String(documentUrl));
    
    if (isImage) {
      // Open in modal for images
      setViewerModal({
        open: true,
        url: documentUrl,
        title: title
      });
    } else {
      // Open in new tab for PDFs and other files
      window.open(documentUrl, '_blank');
    }
  };

  const handleCloseViewer = () => {
    setViewerModal({
      open: false,
      url: null,
      title: ''
    });
  };

  // Add Bank Handlers
  const handleOpenBankModal = () => {
    setOpenBankModal(true);
  };

  const handleCloseBankModal = () => {
    setOpenBankModal(false);
    reset();
  };

  const onSubmitBank = async (data) => {
    try {
      const response = await addBank(data).unwrap();
      if (response?.status) {
        dispatch(setNotification({ 
          open: true, 
          message: response?.message || "Bank details added successfully", 
          severity: "success" 
        }));
        handleCloseBankModal();
      }
    } catch (error) {
      dispatch(setNotification({ 
        open: true, 
        message: error?.data?.message || "Failed to submit. Please try again later.", 
        severity: "error" 
      }));
    }
  };

  // Document Data Processing
  const document = listData?.data || null;

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    } catch (error) {
      return 'Invalid Date';
    }
  };

  const getStatusIcon = (status) => {
    if (!status) return <PendingIcon sx={{ fontSize: 16, color: COLORS.warning }} />;
    
    const statusUpper = String(status).toUpperCase();
    switch (statusUpper) {
      case 'APPROVED':
        return <CheckCircleIcon sx={{ fontSize: 16, color: COLORS.success }} />;
      case 'REJECTED':
        return <CancelIcon sx={{ fontSize: 16, color: COLORS.error }} />;
      case 'PENDING':
        return <PendingIcon sx={{ fontSize: 16, color: COLORS.warning }} />;
      default:
        return <PendingIcon sx={{ fontSize: 16, color: COLORS.warning }} />;
    }
  };

  const getStatusColor = (status) => {
    if (!status) return 'default';
    
    const statusUpper = String(status).toUpperCase();
    switch (statusUpper) {
      case 'APPROVED':
        return 'success';
      case 'REJECTED':
        return 'error';
      case 'PENDING':
        return 'warning';
      default:
        return 'default';
    }
  };

  // SAFE FUNCTIONS TO HANDLE NULL/UNDEFINED
  const getInitial = (value) => {
    if (!value) return 'U';
    const stringValue = String(value);
    return stringValue.charAt(0).toUpperCase();
  };

  const getUserIdString = (userId) => {
    if (!userId) return 'N/A';
    return String(userId);
  };

  const getDocumentIdString = (id) => {
    if (!id) return 'N/A';
    return `DOC-${id}`;
  };

  const getFileIcon = (url) => {
    if (!url) return <InsertDriveFileIcon />;
    
    const urlString = String(url);
    const extension = urlString.split('.').pop().toLowerCase();
    if (['pdf'].includes(extension)) {
      return <PictureAsPdfIcon sx={{ color: COLORS.error }} />;
    } else if (['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'].includes(extension)) {
      return <ImageIcon sx={{ color: COLORS.success }} />;
    } else {
      return <InsertDriveFileIcon sx={{ color: COLORS.info }} />;
    }
  };

  const isImageFile = (url) => {
    if (!url) return false;
    const urlString = String(url);
    const extension = urlString.split('.').pop().toLowerCase();
    return ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'].includes(extension);
  };

  const getFileNameFromUrl = (url) => {
    if (!url) return 'Document';
    const urlString = String(url);
    const parts = urlString.split('/');
    const fullName = parts[parts.length - 1];
    if (fullName.length > 35) {
      return `${fullName.substring(0, 32)}...`;
    }
    return fullName;
  };

  // Calculate total documents
  const totalDocuments = document ? 
    (document.poi ? 1 : 0) + 
    (document.poa ? 1 : 0) + 
    (document.extraDocs?.length || 0) 
    : 0;

  return (
    <Container maxWidth="xl" sx={{ 
      py: 3,
      backgroundColor: COLORS.background,
      minHeight: '100vh',
    }}>
      {/* Header Section */}
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant='h6' fontWeight={600} color={COLORS.textPrimary}>
            Document Details
          </Typography>
          <Stack direction="row" spacing={1}>
            <Button
              variant="outlined"
              onClick={handleDownloadExcel}
              startIcon={<FileDownloadIcon sx={{ fontSize: 16 }} />}
              size="small"
              sx={{
                textTransform: 'none',
                fontSize: '0.75rem',
                px: 2,
                borderColor: COLORS.border,
                color: COLORS.textSecondary,
                '&:hover': {
                  borderColor: COLORS.primary,
                  backgroundColor: 'rgba(126, 98, 51, 0.1)',
                }
              }}
            >
              Export
            </Button>

            <Button
              variant="contained"
              onClick={handleOpenBankModal}
              startIcon={<AddIcon sx={{ fontSize: 16 }} />}
              size="small"
              sx={{
                textTransform: 'none',
                fontSize: '0.75rem',
                px: 2,
                backgroundColor: COLORS.primary,
                color: COLORS.white,
                '&:hover': {
                  backgroundColor: COLORS.primaryDark,
                }
              }}
            >
              Add Bank
            </Button>
          </Stack>
        </Box>
        
        {/* Search Bar */}
        <Box component="form" onSubmit={handleSearch} sx={{ mb: 3 }}>
          <TextField
            fullWidth
            size="small"
            placeholder="Search documents by ID, user, or status..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: COLORS.textSecondary, fontSize: 20 }} />
                </InputAdornment>
              ),
              endAdornment: searchInput && (
                <InputAdornment position="end">
                  <IconButton
                    size="small"
                    onClick={() => {
                      setSearchInput("");
                      setGlobalFilter("");
                    }}
                    sx={{ p: 0.5, color: COLORS.textSecondary }}
                  >
                    <CloseIcon sx={{ fontSize: 16 }} />
                  </IconButton>
                </InputAdornment>
              ),
              sx: {
                backgroundColor: COLORS.paper,
                borderRadius: 1,
                '& .MuiInputBase-input': {
                  color: COLORS.textPrimary,
                  fontSize: '0.875rem',
                },
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: COLORS.border,
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: COLORS.primary,
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: COLORS.primary,
                  borderWidth: 1,
                }
              }
            }}
          />
        </Box>
      </Box>

      {/* Error Alert */}
      {isError && (
        <Alert 
          severity="error" 
          sx={{ 
            mb: 3,
            fontSize: '0.875rem',
            backgroundColor: 'rgba(244, 67, 54, 0.1)',
            color: COLORS.textPrimary,
          }}
        >
          {error?.data?.message || 'Error loading document'}
        </Alert>
      )}

      {/* Main Content Area */}
      <Box>
        {/* Loading State */}
        {isLoading ? (
          <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            justifyContent: 'center', 
            alignItems: 'center',
            py: 10
          }}>
            <CircularProgress size={40} sx={{ color: COLORS.primary }} />
            <Typography variant="body2" color={COLORS.textSecondary} sx={{ mt: 2 }}>
              Loading document...
            </Typography>
          </Box>
        ) : (
          <>
            {document ? (
              <>
                {/* Document Header Bar */}
                <Card sx={{ 
                  mb: 3,
                  border: '1px solid',
                  borderColor: COLORS.border,
                  backgroundColor: COLORS.paper,
                  boxShadow: 'none',
                }}>
                  <CardContent sx={{ p: 2 }}>
                    <Box sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'space-between',
                      flexWrap: 'wrap',
                      gap: 2
                    }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Avatar sx={{ 
                            width: 36, 
                            height: 36, 
                            bgcolor: COLORS.primary,
                            color: COLORS.white,
                            fontSize: '0.875rem',
                            fontWeight: 500
                          }}>
                            {getInitial(document.userId)}
                          </Avatar>
                          <Box>
                            <Typography variant="body1" fontWeight={600} color={COLORS.textPrimary}>
                              User: {getUserIdString(document.userId)}
                            </Typography>
                            <Typography variant="caption" color={COLORS.textSecondary}>
                              {getDocumentIdString(document.id)}
                            </Typography>
                          </Box>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <CalendarTodayIcon sx={{ fontSize: 16, color: COLORS.textSecondary }} />
                          <Typography variant="caption" color={COLORS.textSecondary}>
                            {formatDate(document.createdAt)}
                          </Typography>
                        </Box>
                      </Box>
                      <Chip
                        icon={getStatusIcon(document.status)}
                        label={document.status || 'PENDING'}
                        color={getStatusColor(document.status)}
                        size="medium"
                        sx={{
                          fontSize: '0.75rem',
                          fontWeight: 500,
                          backgroundColor: 'rgba(255, 152, 0, 0.1)',
                          color: COLORS.warning,
                        }}
                      />
                    </Box>
                  </CardContent>
                </Card>

                {/* Main Content Grid */}
                <Grid container spacing={3}>
                  {/* Left Column - Document Information */}
                  <Grid item xs={12} md={4} lg={3}>
                    <Card sx={{ 
                      border: '1px solid',
                      borderColor: COLORS.border,
                      backgroundColor: COLORS.paper,
                      boxShadow: 'none',
                      height: '100%'
                    }}>
                      <CardContent sx={{ p: 2.5 }}>
                        <Typography variant="subtitle1" fontWeight={600} gutterBottom color={COLORS.textPrimary}>
                          Document Information
                        </Typography>
                        <Stack spacing={2} sx={{ mt: 2 }}>
                          <Box>
                            <Typography variant="caption" color={COLORS.textSecondary} display="block" gutterBottom>
                              Status
                            </Typography>
                            <Chip
                              icon={getStatusIcon(document.status)}
                              label={document.status || 'PENDING'}
                              color={getStatusColor(document.status)}
                              size="small"
                              sx={{ 
                                fontWeight: 500,
                                backgroundColor: 'rgba(255, 152, 0, 0.1)',
                                color: COLORS.warning,
                              }}
                            />
                          </Box>

                          <Box>
                            <Typography variant="caption" color={COLORS.textSecondary} display="block" gutterBottom>
                              Created Date
                            </Typography>
                            <Typography variant="body2" color={COLORS.textPrimary} fontWeight={500}>
                              {formatDate(document.createdAt)}
                            </Typography>
                          </Box>

                          <Box>
                            <Typography variant="caption" color={COLORS.textSecondary} display="block" gutterBottom>
                              Updated Date
                            </Typography>
                            <Typography variant="body2" color={COLORS.textPrimary} fontWeight={500}>
                              {formatDate(document.updatedAt)}
                            </Typography>
                          </Box>

                          {document.approvedBy && (
                            <Box>
                              <Typography variant="caption" color={COLORS.textSecondary} display="block" gutterBottom>
                                Approved By
                              </Typography>
                              <Typography variant="body2" color={COLORS.textPrimary} fontWeight={500}>
                                {String(document.approvedBy)}
                              </Typography>
                            </Box>
                          )}

                          {document.remark && (
                            <Box sx={{ mt: 1 }}>
                              <Typography variant="caption" color={COLORS.textSecondary} display="block" gutterBottom>
                                Remark
                              </Typography>
                              <Typography variant="body2" color={COLORS.textPrimary} sx={{ 
                                fontStyle: 'italic',
                                fontSize: '0.875rem',
                                lineHeight: 1.5
                              }}>
                                {String(document.remark)}
                              </Typography>
                            </Box>
                          )}
                        </Stack>
                      </CardContent>
                    </Card>
                  </Grid>

                  {/* Right Column - Documents */}
                  <Grid item xs={12} md={8} lg={9}>
                    <Card sx={{ 
                      border: '1px solid',
                      borderColor: COLORS.border,
                      backgroundColor: COLORS.paper,
                      boxShadow: 'none',
                    }}>
                      <CardContent sx={{ p: 2.5 }}>
                        <Box sx={{ 
                          display: 'flex', 
                          justifyContent: 'space-between', 
                          alignItems: 'center',
                          mb: 3,
                          pb: 2,
                          borderBottom: `1px solid ${COLORS.divider}`
                        }}>
                          <Typography variant="subtitle1" fontWeight={600} color={COLORS.textPrimary}>
                            Documents ({totalDocuments} total)
                          </Typography>
                          <Badge 
                            badgeContent={document.extraDocs?.length || 0} 
                            sx={{ 
                              '& .MuiBadge-badge': { 
                                fontSize: '0.6rem', 
                                height: 16, 
                                minWidth: 16,
                                backgroundColor: COLORS.primary,
                                color: COLORS.white,
                              } 
                            }}
                          >
                            <FolderIcon sx={{ color: COLORS.textSecondary, fontSize: 22 }} />
                          </Badge>
                        </Box>

                        <Box>
                          {/* Tabs for different document types */}
                          <Tabs 
                            value={activeTab} 
                            onChange={(e, newValue) => setActiveTab(newValue)}
                            sx={{ 
                              mb: 3,
                              borderBottom: `1px solid ${COLORS.divider}`,
                              '& .MuiTab-root': {
                                textTransform: 'none',
                                fontSize: '0.875rem',
                                fontWeight: 500,
                                color: COLORS.textSecondary,
                                '&.Mui-selected': {
                                  color: COLORS.primary,
                                  fontWeight: 600,
                                }
                              },
                              '& .MuiTabs-indicator': {
                                backgroundColor: COLORS.primary,
                                height: 2,
                              }
                            }}
                          >
                            <Tab label={`POI (${document.poi ? '1' : '0'})`} />
                            <Tab label={`POA (${document.poa ? '1' : '0'})`} />
                            <Tab label={`Extra (${document.extraDocs?.length || 0})`} />
                          </Tabs>

                          {/* POI Tab Content */}
                          {activeTab === 0 && (
                            <Box>
                              {document.poi ? (
                                <Card variant="outlined" sx={{ 
                                  borderColor: COLORS.border,
                                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                                  '&:hover': {
                                    borderColor: COLORS.primary,
                                  }
                                }}>
                                  <CardContent sx={{ p: 2.5 }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                                      <Avatar sx={{ 
                                        bgcolor: 'rgba(126, 98, 51, 0.2)',
                                        width: 48,
                                        height: 48,
                                        color: COLORS.primary
                                      }}>
                                        {getFileIcon(document.poi)}
                                      </Avatar>
                                      <Box sx={{ flex: 1 }}>
                                        <Typography variant="body1" fontWeight={600} color={COLORS.textPrimary} gutterBottom>
                                          Proof of Identity
                                        </Typography>
                                        <Typography variant="body2" color={COLORS.textSecondary}>
                                          {getFileNameFromUrl(document.poi)}
                                        </Typography>
                                      </Box>
                                    </Box>
                                    <Stack direction="row" spacing={1.5}>
                                      <Button
                                        variant="outlined"
                                        size="medium"
                                        startIcon={<VisibilityIcon sx={{ fontSize: 18 }} />}
                                        onClick={() => handleViewDocument(document.poi, 'Proof of Identity')}
                                        sx={{
                                          textTransform: 'none',
                                          fontSize: '0.875rem',
                                          px: 2,
                                          py: 0.75,
                                          borderColor: COLORS.border,
                                          color: COLORS.textPrimary,
                                          '&:hover': {
                                            borderColor: COLORS.primary,
                                            backgroundColor: 'rgba(126, 98, 51, 0.1)',
                                          }
                                        }}
                                      >
                                        {isImageFile(document.poi) ? 'Preview' : 'View'}
                                      </Button>
                                      <Button
                                        variant="contained"
                                        size="medium"
                                        startIcon={<DownloadIcon sx={{ fontSize: 18 }} />}
                                        onClick={() => window.open(document.poi, '_blank')}
                                        sx={{
                                          textTransform: 'none',
                                          fontSize: '0.875rem',
                                          px: 2,
                                          py: 0.75,
                                          backgroundColor: COLORS.primary,
                                          color: COLORS.white,
                                          '&:hover': {
                                            backgroundColor: COLORS.primaryDark,
                                          }
                                        }}
                                      >
                                        Download
                                      </Button>
                                    </Stack>
                                  </CardContent>
                                </Card>
                              ) : (
                                <Box sx={{ 
                                  textAlign: 'center', 
                                  py: 6,
                                  border: `1px dashed ${COLORS.border}`,
                                  borderRadius: 1,
                                  backgroundColor: 'rgba(255, 255, 255, 0.03)',
                                }}>
                                  <DescriptionIcon sx={{ 
                                    fontSize: 48, 
                                    color: COLORS.textDisabled, 
                                    mb: 2 
                                  }} />
                                  <Typography variant="body1" color={COLORS.textSecondary}>
                                    No POI document uploaded
                                  </Typography>
                                </Box>
                              )}
                            </Box>
                          )}

                          {/* POA Tab Content */}
                          {activeTab === 1 && (
                            <Box>
                              {document.poa ? (
                                <Card variant="outlined" sx={{ 
                                  borderColor: COLORS.border,
                                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                                  '&:hover': {
                                    borderColor: COLORS.primary,
                                  }
                                }}>
                                  <CardContent sx={{ p: 2.5 }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                                      <Avatar sx={{ 
                                        bgcolor: 'rgba(126, 98, 51, 0.2)',
                                        width: 48,
                                        height: 48,
                                        color: COLORS.primary
                                      }}>
                                        {getFileIcon(document.poa)}
                                      </Avatar>
                                      <Box sx={{ flex: 1 }}>
                                        <Typography variant="body1" fontWeight={600} color={COLORS.textPrimary} gutterBottom>
                                          Proof of Address
                                        </Typography>
                                        <Typography variant="body2" color={COLORS.textSecondary}>
                                          {getFileNameFromUrl(document.poa)}
                                        </Typography>
                                      </Box>
                                    </Box>
                                    <Stack direction="row" spacing={1.5}>
                                      <Button
                                        variant="outlined"
                                        size="medium"
                                        startIcon={<VisibilityIcon sx={{ fontSize: 18 }} />}
                                        onClick={() => handleViewDocument(document.poa, 'Proof of Address')}
                                        sx={{
                                          textTransform: 'none',
                                          fontSize: '0.875rem',
                                          px: 2,
                                          py: 0.75,
                                          borderColor: COLORS.border,
                                          color: COLORS.textPrimary,
                                          '&:hover': {
                                            borderColor: COLORS.primary,
                                            backgroundColor: 'rgba(126, 98, 51, 0.1)',
                                          }
                                        }}
                                      >
                                        {isImageFile(document.poa) ? 'Preview' : 'View'}
                                      </Button>
                                      <Button
                                        variant="contained"
                                        size="medium"
                                        startIcon={<DownloadIcon sx={{ fontSize: 18 }} />}
                                        onClick={() => window.open(document.poa, '_blank')}
                                        sx={{
                                          textTransform: 'none',
                                          fontSize: '0.875rem',
                                          px: 2,
                                          py: 0.75,
                                          backgroundColor: COLORS.primary,
                                          color: COLORS.white,
                                          '&:hover': {
                                            backgroundColor: COLORS.primaryDark,
                                          }
                                        }}
                                      >
                                        Download
                                      </Button>
                                    </Stack>
                                  </CardContent>
                                </Card>
                              ) : (
                                <Box sx={{ 
                                  textAlign: 'center', 
                                  py: 6,
                                  border: `1px dashed ${COLORS.border}`,
                                  borderRadius: 1,
                                  backgroundColor: 'rgba(255, 255, 255, 0.03)',
                                }}>
                                  <DescriptionIcon sx={{ 
                                    fontSize: 48, 
                                    color: COLORS.textDisabled, 
                                    mb: 2 
                                  }} />
                                  <Typography variant="body1" color={COLORS.textSecondary}>
                                    No POA document uploaded
                                  </Typography>
                                </Box>
                              )}
                            </Box>
                          )}

                          {/* Extra Documents Tab Content */}
                          {activeTab === 2 && (
                            <Box>
                              {document.extraDocs && document.extraDocs.length > 0 ? (
                                <Grid container spacing={2}>
                                  {document.extraDocs.map((docUrl, index) => (
                                    <Grid item xs={12} sm={6} md={4} key={index}>
                                      <Card variant="outlined" sx={{ 
                                        borderColor: COLORS.border,
                                        backgroundColor: 'rgba(255, 255, 255, 0.05)',
                                        height: '100%',
                                        transition: 'all 0.2s',
                                        '&:hover': {
                                          borderColor: COLORS.primary,
                                        }
                                      }}>
                                        <CardContent sx={{ p: 2 }}>
                                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                                            <Avatar sx={{ 
                                              bgcolor: 'rgba(126, 98, 51, 0.2)',
                                              width: 40,
                                              height: 40,
                                              color: COLORS.primary
                                            }}>
                                              {getFileIcon(docUrl)}
                                            </Avatar>
                                            <Box sx={{ flex: 1, minWidth: 0 }}>
                                              <Typography 
                                                variant="body2" 
                                                fontWeight={600} 
                                                color={COLORS.textPrimary}
                                                noWrap
                                              >
                                                Extra Document {index + 1}
                                              </Typography>
                                              <Typography 
                                                variant="caption" 
                                                color={COLORS.textSecondary}
                                                noWrap
                                              >
                                                {getFileNameFromUrl(docUrl)}
                                              </Typography>
                                            </Box>
                                          </Box>
                                          <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                                            <Button
                                              variant="outlined"
                                              size="small"
                                              startIcon={isImageFile(docUrl) ? 
                                                <ZoomInIcon sx={{ fontSize: 14 }} /> : 
                                                <VisibilityIcon sx={{ fontSize: 14 }} />
                                              }
                                              onClick={() => handleViewDocument(docUrl, `Extra Document ${index + 1}`)}
                                              sx={{
                                                textTransform: 'none',
                                                fontSize: '0.75rem',
                                                px: 1.5,
                                                py: 0.5,
                                                borderColor: COLORS.border,
                                                color: COLORS.textPrimary,
                                                '&:hover': {
                                                  borderColor: COLORS.primary,
                                                  backgroundColor: 'rgba(126, 98, 51, 0.1)',
                                                }
                                              }}
                                            >
                                              {isImageFile(docUrl) ? 'Preview' : 'View'}
                                            </Button>
                                            <Button
                                              variant="contained"
                                              size="small"
                                              startIcon={<DownloadIcon sx={{ fontSize: 14 }} />}
                                              onClick={() => window.open(docUrl, '_blank')}
                                              sx={{
                                                textTransform: 'none',
                                                fontSize: '0.75rem',
                                                px: 1.5,
                                                py: 0.5,
                                                backgroundColor: COLORS.primary,
                                                color: COLORS.white,
                                                '&:hover': {
                                                  backgroundColor: COLORS.primaryDark,
                                                }
                                              }}
                                            >
                                              Download
                                            </Button>
                                          </Stack>
                                        </CardContent>
                                      </Card>
                                    </Grid>
                                  ))}
                                </Grid>
                              ) : (
                                <Box sx={{ 
                                  textAlign: 'center', 
                                  py: 6,
                                  border: `1px dashed ${COLORS.border}`,
                                  borderRadius: 1,
                                  backgroundColor: 'rgba(255, 255, 255, 0.03)',
                                }}>
                                  <FolderIcon sx={{ 
                                    fontSize: 48, 
                                    color: COLORS.textDisabled, 
                                    mb: 2 
                                  }} />
                                  <Typography variant="body1" color={COLORS.textSecondary}>
                                    No extra documents uploaded
                                  </Typography>
                                </Box>
                              )}
                            </Box>
                          )}
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
              </>
            ) : (
              /* Empty State - No Document Found */
              <Card sx={{ 
                border: '1px solid',
                borderColor: COLORS.border,
                backgroundColor: COLORS.paper,
                boxShadow: 'none',
              }}>
                <CardContent sx={{ 
                  textAlign: 'center', 
                  py: 8
                }}>
                  <DescriptionIcon sx={{ 
                    fontSize: 56, 
                    color: COLORS.textDisabled, 
                    mb: 2 
                  }} />
                  <Typography variant="h6" color={COLORS.textSecondary} gutterBottom fontWeight={600}>
                    No Document Found
                  </Typography>
                  <Typography variant="body1" color={COLORS.textSecondary} sx={{ maxWidth: 400, mx: 'auto', mb: 3 }}>
                    {globalFilter 
                      ? `No document matches "${globalFilter}"`
                      : 'No document data available'
                    }
                  </Typography>
                  {!globalFilter && (
                    <Button
                      variant="contained"
                      onClick={handleOpenBankModal}
                      startIcon={<AddIcon />}
                      sx={{
                        backgroundColor: COLORS.primary,
                        color: COLORS.white,
                        '&:hover': {
                          backgroundColor: COLORS.primaryDark,
                        }
                      }}
                    >
                      Add Bank Details
                    </Button>
                  )}
                </CardContent>
              </Card>
            )}
          </>
        )}
      </Box>

      {/* Image Viewer Modal */}
      <Modal 
        open={viewerModal.open} 
        onClose={handleCloseViewer}
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Box sx={{
          position: 'relative',
          maxWidth: '90vw',
          maxHeight: '90vh',
          bgcolor: COLORS.paper,
          borderRadius: 1,
          boxShadow: 24,
          overflow: 'hidden',
        }}>
          {/* Modal Header */}
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            p: 2,
            borderBottom: `1px solid ${COLORS.border}`,
            bgcolor: COLORS.cardHeaderBg
          }}>
            <Typography variant="h6" color={COLORS.textPrimary}>
              {viewerModal.title}
            </Typography>
            <IconButton 
              onClick={handleCloseViewer} 
              sx={{ color: COLORS.textSecondary }}
            >
              <CloseIcon />
            </IconButton>
          </Box>
          
          {/* Image Content */}
          <Box sx={{ 
            p: 3,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '300px',
            maxHeight: '70vh',
            overflow: 'auto'
          }}>
            {viewerModal.url && (
              <img
                src={viewerModal.url}
                alt={viewerModal.title}
                style={{
                  maxWidth: '100%',
                  maxHeight: '100%',
                  objectFit: 'contain',
                  borderRadius: '4px'
                }}
              />
            )}
          </Box>
          
          {/* Modal Footer */}
          <Box sx={{ 
            p: 2,
            borderTop: `1px solid ${COLORS.border}`,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            bgcolor: COLORS.cardHeaderBg
          }}>
            <Typography variant="body2" color={COLORS.textSecondary}>
              {viewerModal.url && getFileNameFromUrl(viewerModal.url)}
            </Typography>
            <Button
              variant="contained"
              startIcon={<DownloadIcon />}
              onClick={() => window.open(viewerModal.url, '_blank')}
              sx={{
                textTransform: 'none',
                backgroundColor: COLORS.primary,
                color: COLORS.white,
                '&:hover': {
                  backgroundColor: COLORS.primaryDark,
                }
              }}
            >
              Download
            </Button>
          </Box>
        </Box>
      </Modal>

      {/* Add Bank Details Modal */}
      <Modal open={openBankModal} onClose={handleCloseBankModal}>
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: downSm ? '95%' : 700,
          maxHeight: '90vh',
          overflowY: 'auto',
          bgcolor: COLORS.paper,
          borderRadius: 1,
          boxShadow: 24,
          p: 4,
        }}>
          {/* Modal Header */}
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            mb: 3,
            pb: 2, 
            borderBottom: `1px solid ${COLORS.border}` 
          }}>
            <Typography variant="h5" fontWeight={600} color={COLORS.textPrimary}>
              Add Bank Details
            </Typography>
            <IconButton 
              onClick={handleCloseBankModal} 
              sx={{ color: COLORS.textSecondary }}
            >
              <CloseIcon />
            </IconButton>
          </Box>

          {/* Add Bank Form */}
          <Box component="form" onSubmit={handleSubmit(onSubmitBank)}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6} md={4}>
                <InputLabel sx={{ mb: 1, fontWeight: 600, color: COLORS.textPrimary }}>
                  Account holder Name *
                </InputLabel>
                <TextField 
                  {...register("holderName", { required: "Account holder name is required" })} 
                  size='small' 
                  fullWidth 
                  placeholder="Enter account Name" 
                  variant="outlined" 
                  error={!!errors.holderName}
                  helperText={errors.holderName?.message}
                  sx={{
                    '& .MuiInputBase-input': {
                      color: COLORS.textPrimary,
                    },
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: COLORS.border,
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: COLORS.primary,
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: COLORS.primary,
                      borderWidth: 1,
                    }
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <InputLabel sx={{ mb: 1, fontWeight: 600, color: COLORS.textPrimary }}>
                  Account No. *
                </InputLabel>
                <TextField 
                  {...register("accountNo", { required: "Account number is required" })} 
                  size='small' 
                  fullWidth 
                  placeholder="Enter account No." 
                  variant="outlined" 
                  error={!!errors.accountNo}
                  helperText={errors.accountNo?.message}
                  sx={{
                    '& .MuiInputBase-input': {
                      color: COLORS.textPrimary,
                    },
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: COLORS.border,
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: COLORS.primary,
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: COLORS.primary,
                      borderWidth: 1,
                    }
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <InputLabel sx={{ mb: 1, fontWeight: 600, color: COLORS.textPrimary }}>
                  IFSC/Swift Code *
                </InputLabel>
                <TextField 
                  {...register("ifscCode", { required: "IFSC/Swift Code is required" })} 
                  size='small' 
                  fullWidth 
                  placeholder="Enter IFSC/Swift Code" 
                  variant="outlined" 
                  error={!!errors.ifscCode}
                  helperText={errors.ifscCode?.message}
                  sx={{
                    '& .MuiInputBase-input': {
                      color: COLORS.textPrimary,
                    },
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: COLORS.border,
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: COLORS.primary,
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: COLORS.primary,
                      borderWidth: 1,
                    }
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <InputLabel sx={{ mb: 1, fontWeight: 600, color: COLORS.textPrimary }}>
                  IBAN No.
                </InputLabel>
                <TextField 
                  {...register("ibanNo")} 
                  size='small' 
                  fullWidth 
                  placeholder="Enter IBAN No." 
                  variant="outlined" 
                  error={!!errors.ibanNo}
                  helperText={errors.ibanNo?.message}
                  sx={{
                    '& .MuiInputBase-input': {
                      color: COLORS.textPrimary,
                    },
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: COLORS.border,
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: COLORS.primary,
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: COLORS.primary,
                      borderWidth: 1,
                    }
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <InputLabel sx={{ mb: 1, fontWeight: 600, color: COLORS.textPrimary }}>
                  Bank Name *
                </InputLabel>
                <TextField 
                  {...register("bankName", { required: "Bank name is required" })} 
                  size='small' 
                  fullWidth 
                  placeholder="Enter bank name" 
                  variant="outlined" 
                  error={!!errors.bankName}
                  helperText={errors.bankName?.message}
                  sx={{
                    '& .MuiInputBase-input': {
                      color: COLORS.textPrimary,
                    },
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: COLORS.border,
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: COLORS.primary,
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: COLORS.primary,
                      borderWidth: 1,
                    }
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <InputLabel sx={{ mb: 1, fontWeight: 600, color: COLORS.textPrimary }}>
                  Bank address *
                </InputLabel>
                <TextField 
                  {...register("bankAddress", { required: "Bank address is required" })} 
                  size='small' 
                  fullWidth 
                  placeholder="Enter bank address" 
                  variant="outlined" 
                  error={!!errors.bankAddress}
                  helperText={errors.bankAddress?.message}
                  sx={{
                    '& .MuiInputBase-input': {
                      color: COLORS.textPrimary,
                    },
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: COLORS.border,
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: COLORS.primary,
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: COLORS.primary,
                      borderWidth: 1,
                    }
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <InputLabel sx={{ mb: 1, fontWeight: 600, color: COLORS.textPrimary }}>
                  Country *
                </InputLabel>
                <TextField 
                  {...register("country", { required: "Country is required" })} 
                  size='small' 
                  fullWidth 
                  placeholder="Enter your country name" 
                  variant="outlined" 
                  error={!!errors.country}
                  helperText={errors.country?.message}
                  sx={{
                    '& .MuiInputBase-input': {
                      color: COLORS.textPrimary,
                    },
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: COLORS.border,
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: COLORS.primary,
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: COLORS.primary,
                      borderWidth: 1,
                    }
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <InputLabel sx={{ mb: 1, fontWeight: 600, color: COLORS.textPrimary }}>
                  Bank Document *
                </InputLabel>
                <FileUploadTextArea
                  onChange={(fileData) => setValue("image", fileData, { shouldValidate: true })}
                  extentionType={['image/jpeg', 'image/png']}
                  acceptType={"image/jpeg,image/png,application/pdf"}
                />
                {errors.image && <Typography color="error" fontSize={"14px"}>{errors.image.message}</Typography>}
              </Grid>
            </Grid>

            {/* Form Actions */}
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'flex-end', 
              gap: 2, 
              mt: 4, 
              pt: 3, 
              borderTop: `1px solid ${COLORS.border}` 
            }}>
              <Button
                variant="outlined"
                onClick={handleCloseBankModal}
                sx={{
                  textTransform: "none",
                  fontWeight: 600,
                  px: 4,
                  py: 1,
                  borderColor: COLORS.border,
                  color: COLORS.textPrimary,
                  '&:hover': {
                    borderColor: COLORS.primary,
                    backgroundColor: 'rgba(126, 98, 51, 0.1)',
                  }
                }}
              >
                Cancel
              </Button>
              <Button
                type='submit'
                variant='contained'
                disabled={isSubmitting || isAddingBank}
                sx={{
                  textTransform: "none",
                  boxShadow: "none",
                  fontWeight: 600,
                  px: 4,
                  py: 1,
                  backgroundColor: COLORS.primary,
                  color: COLORS.white,
                  "&:hover": {
                    boxShadow: "none",
                    backgroundColor: COLORS.primaryDark,
                  },
                  "&:disabled": {
                    backgroundColor: COLORS.textDisabled,
                    color: COLORS.white,
                  }
                }}
              >
                {(isSubmitting || isAddingBank) ? 'Submitting...' : 'Submit'}
              </Button>
            </Box>
          </Box>
        </Box>
      </Modal>
    </Container>
  );
}

export default DocumentList;