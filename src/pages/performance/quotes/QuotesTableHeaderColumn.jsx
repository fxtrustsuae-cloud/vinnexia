import { createMRTColumnHelper } from 'material-react-table';
import { Typography } from '@mui/material';
import { useDispatch } from 'react-redux';
import { setSelectedSymbol } from "../../../globalState/terminalState/terminalSlice";
import { allSymbol } from '../../../utils/allSymbol';

const columnHelper = createMRTColumnHelper();

export const QuotesTableHeaderColumn = [
    columnHelper.accessor('Symbol', {
        header: 'Symbol',
        size: 150,
        Cell: ({ row }) => {
            const dispatch = useDispatch();
            const value = row?.original?.Symbol;
            const symbolData = allSymbol.filter(item => item?.name === value);
            
            const handleSymbolClick = () => {
                if (symbolData[0]) {
                    dispatch(setSelectedSymbol(symbolData[0]));
                    window.open("/terminal", "_blank");
                }
            };

            return (
                <Typography
                    onClick={handleSymbolClick}
                    sx={{ 
                        textDecoration: "underline", 
                        cursor: "pointer",
                        color: 'primary.main',
                        fontWeight: 500,
                        '&:hover': {
                            opacity: 0.8
                        }
                    }}
                >
                    {value}
                </Typography>
            );
        },
    }),
    columnHelper.accessor('Ask', {
        header: 'Ask',
        size: 120,
        Cell: ({ row }) => {
            const value = row?.original?.Ask;
            return <Typography sx={{ color: 'green', fontWeight: 500 }}>{value}</Typography>;
        },
    }),
    columnHelper.accessor('Bid', {
        header: 'Bid',
        size: 120,
        Cell: ({ row }) => {
            const value = row?.original?.Bid;
            return <Typography sx={{ color: 'red', fontWeight: 500 }}>{value}</Typography>;
        },
    }),
    columnHelper.display({
        header: 'Spread',
        size: 120,
        Cell: ({ row }) => {
            const ask = row?.original?.Ask || 0;
            const bid = row?.original?.Bid || 0;
            const value = ask - bid;
            return (
                <Typography sx={{ fontWeight: 500 }}>
                    {Number(value).toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 5,
                    })}
                </Typography>
            );
        },
    }),


    // columnHelper.accessor('Action', {
    //     header: 'Action',
    //     size: 100,
    //     Cell: ({ row }) => {
    //         const value = row?.original?.Action;
    //         return <Typography sx={{ color: value == 1 ? "red" : "green" }}>{value == 1 ? "Sell" : "Buy"}</Typography>
    //     },
    // }),
    // columnHelper.accessor('PriceOpen', {
    //     header: 'Open price',
    //     size: 100,
    // }),
    // columnHelper.accessor('PriceCurrent', {
    //     header: 'Current price',
    //     size: 100,
    // }),
    // columnHelper.accessor('PriceSL', {
    //     header: 'SL price',
    //     size: 100,
    // }),
    // columnHelper.accessor('PriceTP', {
    //     header: 'TP price',
    //     size: 100,
    // }),
    // columnHelper.accessor('Volume', {
    //     header: 'Volume',
    //     size: 100,
    //     Cell: ({ row }) => {
    //         const value = row?.original?.Volume;
    //         return <Typography>{value / 10000}</Typography>
    //     },
    // }),
    // columnHelper.accessor('Profit', {
    //     header: 'Profit',
    //     size: 100,
    // }),
    // columnHelper.accessor('TimeCreate', {
    //     header: 'Created AT',
    //     size: 200,
    //     Cell: ({ row }) => {
    //         const timestamp = row.original.TimeCreate;
    //         const date = new Date(timestamp * 1000);

    //         const formattedDateTime = date.toLocaleString('en-CA', {
    //             year: 'numeric',
    //             month: '2-digit',
    //             day: '2-digit',
    //             hour: '2-digit',
    //             minute: '2-digit',
    //             second: '2-digit',
    //             hour12: false,
    //         }).replace(',', '');

    //         return (
    //             <Typography>
    //                 {formattedDateTime}
    //             </Typography>
    //         );
    //     },
    // }),
];