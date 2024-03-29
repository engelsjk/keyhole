import type { NextPage } from "next";
import { useEffect, useState } from "react";

import { Container, Box, Drawer, Typography, AppBar, Toolbar, IconButton } from '@mui/material';
import HelpIcon from '@mui/icons-material/Help';

import Head from '~/components/head';
import Map from '~/components/map';
import FilterPane from '~/components/filterPane';
import MissionPane from '~/components/missionPane';
import FramePane from '~/components/framePane';
import MapLoadingHolder from "../components/mapLoadingHolder";
import Modal from '~/components/modal';
import MapPane from '~/components/mapPane';

import { useAppContext } from "~/context/appContext";

const Home: NextPage = () => {

  const {
    mission,
    frame,
    missionData,
    setMissionData,
    dataLoading,
    setDataLoading,
    mapLoading
  } = useAppContext();

  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const handleOpenModal = () => setModalOpen(true);
  const handleCloseModal = () => setModalOpen(false);

  useEffect(() => {
    if (missionData) {
      return;
    }

    const fetchData = async () => {
      const response = await fetch('api/missions', {
        method: "GET",
        headers: {
          "Content-Type": "application/json"
        },
      });
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      const missions = await response.json();
      setMissionData(missions);
      setDataLoading(false);
    }

    fetchData()
      .catch(console.error);

  }, [])

  return (
    <div>
      <Head></Head>
      <Container
        sx={{
          padding: 0,
          margin: 0,
          top: 0,
          bottom: 0,
          height: '100vh',
          width: '100vw',
          maxWidth: '100%',
          minWidth: '100%',
          display: 'flex',
          flexDirection: 'column',
          overflowX: 'hidden',
          visibility: (mapLoading || dataLoading) ? 'hidden' : 'visible',
        }}
        disableGutters
      >
        <AppBar
          position="relative"
          sx={{
            bgcolor: "primary.dark",
            '& .MuiToolbar-root': {
              minHeight: 50,
              pl: 2,
            },
          }}
        >
          <Toolbar>
            <Typography
              variant="h6"
              color="primary.main"
            >
              KEYHOLE //SWATHS//
            </Typography>
            <IconButton
              color="primary"
              onClick={handleOpenModal}
              size="medium"
            >
              <HelpIcon />
            </IconButton>
          </Toolbar>
        </AppBar>

        <Box sx={{
          flex: '1 1 auto',
          display: 'flex',
          position: 'relative',
          flexDirection: {
            xs: 'column',
            sm: 'row',
          },
        }}>

          <Box sx={{
            flexDirection: 'column',
            flex: '1 1 auto',
            display: 'flex',
            position: 'relative',
          }}>
            <Map />
          </Box>

          <Box sx={{
            width: {
              xs: '100%',
              sm: '300px',
              md: '450px',
            },
            height: {
              xs: '50%',
              sm: '100%',
            },
            position: 'relative',
          }}>

            {(!dataLoading && !mapLoading) &&
              <Drawer
                anchor='right'
                variant="persistent"
                open={true}
                sx={{
                  '& .MuiDrawer-paper': {
                    border: 'none',
                    backgroundColor: 'secondary.main',
                    boxSizing: 'border-box',
                    position: 'relative',
                  },
                  bgcolor: 'secondary.main',
                  position: "absolute",
                  height: '100%',
                  width: '100%',
                }}
              >
                <Box sx={{
                  // height: '100vh',
                  width: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  flex: '1 1 auto',
                  bgcolor: 'primary.dark',
                  overflowY: 'hidden',
                }}>
                  <Typography
                    variant="h6"
                    color="primary.main"
                    sx={{
                      ml: 2,
                      mb: 1,
                      mt: 1,
                    }}
                  >
                    TOOLKIT
                  </Typography>

                  <Box sx={{
                    pl: 1,
                    pr: 1,
                    mt: 1,
                    flex: '1 1 auto',
                    overflowY: 'scroll',
                  }}>
                    <FilterPane />
                    {mission && <MissionPane />}
                    {frame && <FramePane />}
                    <MapPane />
                  </Box>
                </Box>
              </Drawer>
            }
          </Box>
        </Box>

        <Modal
          open={modalOpen}
          handleClose={handleCloseModal}
        />
      </Container>
      {(dataLoading || mapLoading) && <MapLoadingHolder className="loading-holder" />}

    </div >
  );
}

export default Home;