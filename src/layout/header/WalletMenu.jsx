import { useState } from 'react';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Tooltip from '@mui/material/Tooltip';
import PersonAdd from '@mui/icons-material/PersonAdd';
import Settings from '@mui/icons-material/Settings';
import Logout from '@mui/icons-material/Logout';
import SwitchComponent from '../../components/SwitchComponent';
import { Stack, Button } from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { useGetUserDataQuery } from "../../globalState/userState/userStateApis"
import { Link } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';
import { useDispatch, useSelector } from 'react-redux';
import { useMt5AccountListQuery } from '../../globalState/mt5State/mt5StateApis';
import { setHideBalance } from '../../globalState/profileState/profileStateSlices';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';

// Color palette from your logo
const COLORS = {
  accentGold: "#7E6233",
  whiteMain: "#FEFEFE",
  blackDark: "#11191E",
  greyLight: "#CACDCC",
  greyMedium: "#B3B6B6",
  greyDark: "#848F94",
  darkBg: "#1a1f24",
};

function WalletMenu({ Icon, tooltip, iconColor = COLORS.accentGold }) {

    const dispatch = useDispatch()

    const { token } = useSelector((state) => state.auth);
    const { data, isLoading } = useGetUserDataQuery(undefined, {
        skip: !token,
        refetchOnMountOrArgChange: true,
    })

    const mainBalance = !isLoading && data?.data?.assetData?.mainBalance

    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    const [copied, setCopied] = useState(false);

    const handleCopy = (text) => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => {
            setCopied(false);
        }, 1500);
    };

    const handleBalanceHide = (e) => {
        dispatch(setHideBalance(e.target.checked))
    }

    const { hideBalance } = useSelector(state => state.profile)

    return (
        <>
            <Box sx={{ display: 'flex', alignItems: 'center', textAlign: 'center' }}>
                <Tooltip title={tooltip}>
                    <IconButton
                        onClick={handleClick}
                        size="small"
                        sx={{ 
                            ml: 2,
                            color: iconColor, // Use the passed iconColor prop
                            transition: 'all 0.3s ease',
                            '&:hover': {
                                backgroundColor: `${COLORS.accentGold}20`,
                                color: "#8f7040", // Lighter gold on hover
                                transform: 'scale(1.1)',
                            }
                        }}
                    >
                        <Icon />
                    </IconButton>
                </Tooltip>
            </Box>
            <Menu
                anchorEl={anchorEl}
                id="account-menu"
                open={open}
                onClose={handleClose}
                slotProps={{
                    paper: {
                        elevation: 0,
                        sx: {
                            overflow: 'visible',
                            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                            mt: 1.5,
                            width: "300px",
                            bgcolor: COLORS.darkBg,
                            color: COLORS.whiteMain,
                            '& .MuiAvatar-root': {
                                width: 32,
                                height: 32,
                                ml: -0.5,
                                mr: 1,
                            },
                            '&::before': {
                                content: '""',
                                display: 'block',
                                position: 'absolute',
                                top: 0,
                                right: 14,
                                width: 10,
                                height: 10,
                                bgcolor: COLORS.darkBg,
                                transform: 'translateY(-50%) rotate(45deg)',
                                zIndex: 0,
                            },
                        },
                    },
                }}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
                <MenuItem
                    key="hide-balance"
                    sx={{
                        justifyContent: "space-between",
                        '&:hover': {
                            backgroundColor: `${COLORS.accentGold}10`
                        }
                    }}>
                    <Typography sx={{ color: COLORS.whiteMain, fontWeight: 500 }}>
                        Hide balance
                    </Typography>
                    <SwitchComponent onChange={handleBalanceHide} checked={hideBalance} />
                </MenuItem>
                
                <Divider key="divider-1" sx={{ borderColor: COLORS.greyDark }} />
                
                <MenuItem
                    key="main-balance"
                    sx={{
                        flexDirection: "column",
                        alignItems: "flex-start",
                        '&:hover': {
                            backgroundColor: `${COLORS.accentGold}10`
                        }
                    }}>
                    <Typography fontWeight={"bold"} fontSize={"1.1rem"} sx={{ 
                        color: COLORS.accentGold,
                        textDecoration: "wavy" 
                    }}>
                        {
                            hideBalance ?
                                <>
                                    <FiberManualRecordIcon sx={{ 
                                        fontSize: "10px", 
                                        color: COLORS.accentGold 
                                    }} />
                                    <FiberManualRecordIcon sx={{ 
                                        fontSize: "10px", 
                                        color: COLORS.accentGold 
                                    }} />
                                    <FiberManualRecordIcon sx={{ 
                                        fontSize: "10px", 
                                        color: COLORS.accentGold 
                                    }} />
                                    <FiberManualRecordIcon sx={{ 
                                        fontSize: "10px", 
                                        color: COLORS.accentGold 
                                    }} />
                                    <FiberManualRecordIcon sx={{ 
                                        fontSize: "10px", 
                                        color: COLORS.accentGold 
                                    }} />
                                </>
                                :
                                Number(mainBalance || 0).toLocaleString(undefined, {
                                    minimumFractionDigits: 0,
                                    maximumFractionDigits: 2,
                                })
                        } 
                        <Typography component={"span"} sx={{ color: COLORS.whiteMain }}>
                            USD
                        </Typography>
                    </Typography>
                    
                    <Stack sx={{ flexDirection: "row", gap: "10px", mt: ".8rem", width: "100%" }}>
                        <Button
                            component={Link}
                            to={"/client/transactions/internalTransfer"}
                            variant='contained'
                            size='small'
                            sx={{
                                textTransform: "capitalize",
                                boxShadow: "none",
                                bgcolor: COLORS.accentGold,
                                color: COLORS.whiteMain,
                                flex: 1,
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                    bgcolor: "#8f7040",
                                    boxShadow: `0 4px 12px ${COLORS.accentGold}40`,
                                    transform: 'translateY(-2px)',
                                },
                            }}
                        >
                            Transfer
                        </Button>
                        <Button
                            component={Link}
                            to={"/client/transactions/withdrawal"}
                            variant='contained'
                            size='small'
                            sx={{
                                textTransform: "capitalize",
                                boxShadow: "none",
                                bgcolor: COLORS.accentGold,
                                color: COLORS.whiteMain,
                                flex: 1,
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                    bgcolor: "#8f7040",
                                    boxShadow: `0 4px 12px ${COLORS.accentGold}40`,
                                    transform: 'translateY(-2px)',
                                },
                            }}
                        >
                            Withdraw
                        </Button>
                    </Stack>
                </MenuItem>
                
                <MenuItem
                    key="trading-account-info"
                    sx={{
                        flexDirection: "column",
                        alignItems: "flex-start",
                        '&:hover': {
                            backgroundColor: `${COLORS.accentGold}10`
                        }
                    }}>
                    {/* Trading account info section - customize as needed */}
                </MenuItem>
            </Menu>
        </>
    );
}

export default WalletMenu;