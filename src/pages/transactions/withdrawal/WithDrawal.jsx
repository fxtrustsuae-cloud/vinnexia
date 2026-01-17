import { Container, Stack, Typography } from "@mui/material";
import WithdrawalMethods from "./withdrawalMethods/WithdrawalMethods";
// import TransferWithdrawalMethods from "./transferWithdrawalMethods/TransferWithdrawalMethods";
import VerificationRequiredWithdrawal from "./verificationRequiredWithdrawal/VerificationRequiredWithdrawal"

function WithDrawal() {

    return (
        <Container>
            <WithdrawalMethods />
            {/* <TransferWithdrawalMethods /> */}
            {/* <VerificationRequiredWithdrawal /> */}
        </Container>
    )
}

export default WithDrawal;