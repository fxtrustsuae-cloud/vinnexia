import { useSelector } from 'react-redux'
import { Container, Divider, Typography } from '@mui/material'
import Grid from '@mui/material/Grid2'
// import CryptoDepositQR from './CryptoDepositQR'
// import CryptoDepositDetails from './CryptoDepositDetails'
import CryptoWithdrawalForm from './CryptoWithdrawalForm'


function CryptoWithdrawal() {

    // const { depositQRData } = useSelector(state => state.payment)

    return (
        <Container>
            <Grid container size={12} spacing={3} >
                <Grid size={{ xs: 12, md: 12 }}>
                    <CryptoWithdrawalForm />
                    {/* <CryptoDepositDetails /> */}
                </Grid>
                {/* <Grid size={{ xs: 12, md: 6 }}>
                    {depositQRData && <CryptoDepositQR />}
                </Grid> */}
            </Grid>
        </Container >
    )
}

export default CryptoWithdrawal