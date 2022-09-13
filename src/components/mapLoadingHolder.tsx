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
                        color: 'primary.light'
                    }}
                >
                    LOADING...
                </Typography>
            </Container >
        </div >
    );
}

export default MapLoadingHolder;
