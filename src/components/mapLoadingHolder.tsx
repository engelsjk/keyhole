import { NextPage } from "next";
// import WorldIcon from "~/components/worldIcon";
import Image from 'next/image';
import Logo from '~/components/svgs/logo.svg';
import Typography from '@mui/material/Typography';

interface Props {
    className: string
}

const MapLoadingHolder: NextPage<Props> = (props) => {
    return (
        <div className={props.className}>
            {/* <WorldIcon className="icon" /> */}
            {/* <Image src={Logo} width={100} height={100} /> */}
            <Logo className="icon" width={75} height={75} />
            <Typography
                variant="h4"
                sx={{ mt: 6 }}
            >Loading...</Typography>
        </div>
    );
}

export default MapLoadingHolder;
