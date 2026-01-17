import { createMRTColumnHelper } from 'material-react-table';
import { Typography } from '@mui/material';
import { Link } from 'react-router-dom';

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
};

const columnHelper = createMRTColumnHelper();

export const MT5AccountListColumnHeader = [
    columnHelper.accessor('Login', {
        header: 'MT5 Log in',
        Cell: ({ row }) => {
            const value = row.original.Login
            return (
                <Typography
                    component={Link}
                    to={`/client/MT5AccountsDetails/MT5AccountAction/${value}`}
                    state={row.original}
                    sx={{ 
                        textDecoration: "none",
                        color: COLORS.goldLight,
                        fontWeight: 600,
                        fontSize: '0.875rem',
                        transition: 'all 0.2s ease',
                        '&:hover': {
                            color: COLORS.whiteMain,
                            textDecoration: 'underline',
                            textUnderlineOffset: '3px',
                            textDecorationColor: COLORS.accentGold,
                        }
                    }}
                >
                    {value}
                </Typography>
            )
        },
    }),
    columnHelper.accessor('accountType', {
        header: 'Account type',
        Cell: ({ cell }) => (
            <Typography
                sx={{
                    color: cell.getValue() === 'REAL' ? COLORS.goldLight : COLORS.greyLight,
                    fontWeight: 600,
                    fontSize: '0.875rem',
                    backgroundColor: cell.getValue() === 'REAL' 
                        ? `${COLORS.accentGold}20` 
                        : `${COLORS.greyDark}20`,
                    px: 1.5,
                    py: 0.5,
                    borderRadius: 1,
                    display: 'inline-block',
                }}
            >
                {cell.getValue()}
            </Typography>
        ),
    }),
    columnHelper.display({
        id: "group",
        header: 'Group',
        Cell: ({ row }) => {
            const value = row.original.group.name
            return (
                <Typography
                    sx={{
                        color: COLORS.greyLight,
                        fontWeight: 500,
                        fontSize: '0.875rem',
                        fontFamily: 'monospace',
                    }}
                >
                    {value}
                </Typography>
            )
        },
    }),
    columnHelper.accessor('Leverage', {
        header: 'Leverage',
        Cell: ({ cell }) => (
            <Typography
                sx={{
                    color: COLORS.whiteMain,
                    fontWeight: 600,
                    fontSize: '0.875rem',
                    backgroundColor: `${COLORS.accentGold}30`,
                    px: 1.5,
                    py: 0.5,
                    borderRadius: 1,
                    display: 'inline-block',
                }}
            >
                {cell.getValue()}
            </Typography>
        ),
    }),
    columnHelper.accessor('createdAt', {
        header: 'Date',
        Cell: ({ row }) => (
            <Typography
                sx={{
                    color: COLORS.greyLight,
                    fontWeight: 500,
                    fontSize: '0.875rem',
                    fontFamily: 'monospace',
                }}
            >
                {new Date(row.original.createdAt).toLocaleString()}
            </Typography>
        ),
    })
];