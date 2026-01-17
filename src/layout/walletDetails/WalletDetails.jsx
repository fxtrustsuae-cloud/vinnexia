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
import Accordion from '@mui/material/Accordion';
import AccordionActions from '@mui/material/AccordionActions';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AccountBalanceWalletOutlinedIcon from '@mui/icons-material/AccountBalanceWalletOutlined';
import { useGetUserDataQuery } from '../../globalState/userState/userStateApis';
import { useDispatch, useSelector } from 'react-redux';
import { useMt5AccountListQuery } from '../../globalState/mt5State/mt5StateApis';
import AddIcon from '@mui/icons-material/Add';
import { Link, useNavigate } from 'react-router-dom';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import { setHideBalance } from '../../globalState/profileState/profileStateSlices';

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

function WalletDetails({ sidebarOpen, toggleSidebarOpen }) {

    const navigate = useNavigate()
    const dispatch = useDispatch()

    const { token } = useSelector((state) => state.auth);
    const { data, isLoading } = useGetUserDataQuery(undefined, {
        skip: !token,
        refetchOnMountOrArgChange: true,
    })

    const mainBalance = !isLoading && data?.data?.assetData?.mainBalance

    const [copied, setCopied] = useState(false);

    const handleCopy = (text) => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => {
            setCopied(false);
        }, 1500);
    };

    const handleNavigate = (url) => {
        navigate(url)
        if (sidebarOpen) {
            toggleSidebarOpen(false)
        }
    };

    const handleBalanceHide = (e) => {
        dispatch(setHideBalance(e.target.checked))
    }

    const { hideBalance } = useSelector(state => state.profile)

    return (
        <div>
            <Accordion sx={{ 
                boxShadow: "none", 
                m: 0, 
                p: 0,
                backgroundColor: COLORS.blackDark,
                '&:before': {
                    display: 'none',
                },
                '&.Mui-expanded': {
                    margin: 0,
                }
            }}>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon sx={{ color: COLORS.accentGold }} />}
                    aria-controls="panel1-content"
                    id="panel1-header"
                    sx={{ 
                        px: "1rem", 
                        py: "0.5rem",
                        minHeight: '48px',
                        '&.Mui-expanded': {
                            minHeight: '48px',
                        },
                        '& .MuiAccordionSummary-content': {
                            margin: '12px 0',
                            '&.Mui-expanded': {
                                margin: '12px 0',
                            }
                        }
                    }}
                >
                    <AccountBalanceWalletOutlinedIcon sx={{ 
                        color: COLORS.accentGold,
                        mr: 1 
                    }} />
                    <Typography fontWeight={"bold"} fontSize={"1.1rem"} sx={{ color: COLORS.accentGold }}>
                        {hideBalance ? (
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
                        ) : (
                            Number(mainBalance || 0).toLocaleString(undefined, {
                                minimumFractionDigits: 0,
                                maximumFractionDigits: 2,
                            })
                        )}
                        <Typography component={"span"} sx={{ color: COLORS.whiteMain, ml: 0.5 }}>
                            USD
                        </Typography>
                    </Typography>
                </AccordionSummary>
                
                <AccordionDetails sx={{ m: 0, p: 0 }}>
                    <Stack>
                        <MenuItem sx={{ 
                            justifyContent: "space-between",
                            px: "1rem",
                            py: "0.75rem",
                            '&:hover': {
                                backgroundColor: `${COLORS.accentGold}10`
                            }
                        }}>
                            <Typography sx={{ color: COLORS.whiteMain, fontWeight: 500 }}>
                                Hide balance
                            </Typography>
                            <SwitchComponent onChange={handleBalanceHide} checked={hideBalance} />
                        </MenuItem>
                        
                        <Divider sx={{ borderColor: COLORS.greyDark }} />
                        
                        <MenuItem sx={{ 
                            flexDirection: "column", 
                            alignItems: "flex-start",
                            px: "1rem",
                            py: "1rem",
                            '&:hover': {
                                backgroundColor: `${COLORS.accentGold}10`
                            }
                        }}>
                            <Stack sx={{ flexDirection: "row", gap: "10px", mt: ".8rem", width: "100%" }}>
                                <Button
                                    onClick={() => handleNavigate("/client/transactions/internalTransfer")}
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
                                    onClick={() => handleNavigate("/client/transactions/withdrawal")}
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
                        
                        <MenuItem sx={{ 
                            flexDirection: "column", 
                            alignItems: "flex-start",
                            px: "1rem",
                            py: "1rem",
                            '&:hover': {
                                backgroundColor: `${COLORS.accentGold}10`
                            }
                        }}>
                            <Typography fontWeight={"bold"} fontSize={"1.1rem"} sx={{ color: COLORS.accentGold }}>
                                {hideBalance ? (
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
                                ) : (
                                    Number(mainBalance || 0).toLocaleString(undefined, {
                                        minimumFractionDigits: 0,
                                        maximumFractionDigits: 2,
                                    })
                                )}
                                <Typography component={"span"} sx={{ color: COLORS.whiteMain, ml: 0.5 }}>
                                    USD
                                </Typography>
                            </Typography>
                        </MenuItem>
                    </Stack>
                </AccordionDetails>
            </Accordion>
        </div>
    );
}

export default WalletDetails;