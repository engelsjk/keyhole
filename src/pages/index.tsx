import type { NextPage } from "next";
import { useEffect, useState } from "react";

import { Container, Box, Drawer, Typography, AppBar, Toolbar, IconButton } from '@mui/material';
import HelpIcon from '@mui/icons-material/Help';
import ChevronLeftRoundedIcon from '@mui/icons-material/ChevronLeftRounded';
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded';

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
    setRangeAcquisitionYears,
    setSelectedCameraType,
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

  const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);
  const handleOpenSidebar = () => setSidebarOpen(true);
  const handleCloseSidebar = () => setSidebarOpen(false);

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

    setRangeAcquisitionYears([1960, 1984]);
    setSelectedCameraType("ALL");

  }, [])

  return (
    <div>
      <Head></Head>
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
        }}
        disableGutters
      >

        <Box sx={{
          flexGrow: 1,
          color: "primary.dark",
        }}>
          <AppBar
            position="absolute"
            sx={{
              bgcolor: "primary.dark"
            }}
          >
            <Toolbar>
              <Typography
                variant="h6"
                color="primary.main"
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  flexGrow: 1
                }}
              >
                KEYHOLE //SWATHS//
                <IconButton
                  color="primary"
                  onClick={handleOpenModal}
                  size="medium"
                >
                  <HelpIcon />
                </IconButton>
              </Typography>

              {!sidebarOpen &&
                <Typography
                  variant="h6"
                  color="primary.main"
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                  }}
                >
                  TOOLKIT
                  <IconButton
                    color="primary"
                    onClick={handleOpenSidebar}
                    size="medium"
                  >
                    <ChevronLeftRoundedIcon />
                  </IconButton>
                </Typography>
              }
            </Toolbar>
          </AppBar>
        </Box>

        <Box sx={{
          height: '100%',
          width: 'auto',
        }}>
          <Map />
        </Box>

        {(!dataLoading && !mapLoading) &&
          <Drawer
            anchor='right'
            variant="persistent"
            open={sidebarOpen}
            sx={{
              '& .MuiDrawer-paper': {
                border: 'none',
                backgroundColor: 'secondary.main',
              },
            }}
          >
            <Box sx={{
              width: 375,
              ml: 1,
              bgcolor: 'secondary.main',
              overflow: 'hidden',
              height: '100%',
              display: 'flex',
              flexFlow: 'column',
            }}>
              <Typography
                variant="h6"
                color="primary.main"
                sx={{
                  ml: 1,
                  display: 'flex',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  position: 'static',
                  minHeight: '64px',
                }}
              >
                TOOLKIT
                <IconButton
                  color="primary"
                  onClick={handleCloseSidebar}
                  size="medium"
                >
                  <ChevronRightRoundedIcon />
                </IconButton>
              </Typography>

              <Box sx={{
                flexGrow: 1,
                flex: 1,
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
        <Modal
          open={modalOpen}
          handleClose={handleCloseModal}
        />
        {/* <CtrlMap
            projection={projection}
            setProjection={setProjection}
          /> */}
      </Container>
      {(dataLoading || mapLoading) && <MapLoadingHolder className="loading-holder" />}
    </div >
  );
}

export default Home;