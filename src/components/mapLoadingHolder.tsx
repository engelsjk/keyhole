import { NextPage } from "next";
import { Container, Typography } from '@mui/material';
import Logo from '~/components/svgs/logo.svg';
import styles from '~/styles/MapLoader.module.css'

interface Props {
    className: string
}

const MapLoadingHolder: NextPage<Props> = (props) => {
    return (
        <div>
            <Container
                sx={{
                    padding: 0,
                    margin: 0,
                    position: 'absolute',
                    top: 0,
                    bottom: 0,
                    height: '100%',
                    width: '100%',
                    maxWidth: '100%',
                    minWidth: '100%',
                    backgroundColor: 'primary.dark',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    flexDirection: 'column',
                    // background:' -webkit-linear-gradient(45deg,
                    //     rgba(152, 207, 195, 0.7),
                    //     rgb(86, 181, 184))',
                    // background: '-moz-linear-gradient(45deg,
                    //     rgba(152, 207, 195, 0.7),
                    //     rgb(86, 181, 184))',
                    // background: 'linear-gradient(45deg,
                    //     rgba(152, 207, 195, 0.7),
                    //     rgb(86, 181, 184),
                    //     0.9)', */
                }}
            >
                <Logo
                    width={75}
                    height={75}
                    className={styles.logo}
                />
                <Typography
                    variant="h4"
                    sx={{
                        mt: 6,
                        // textShadow: '0px 0px 10px rgba(152, 207, 195, 0.7)',
                    }}
                >
                    LOADING...
                </Typography>
            </Container >
        </div >
    );
}

export default MapLoadingHolder;
