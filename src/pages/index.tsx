import type { NextPage } from "next";
import { useEffect, useRef, useState, Fragment, useCallback } from "react";

import { Container, Box, Typography, AppBar, Toolbar, IconButton } from '@mui/material';
import HelpIcon from '@mui/icons-material/Help';

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

  const [open, setOpen] = useState<boolean>(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

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
      {<Container
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
          height: '100%',
          width: '100%',
        }}>
          <Map />
        </Box>

        {(!dataLoading && !mapLoading) && <Box sx={{
          position: 'absolute',
          height: 'auto',
          width: 350,
          top: 5,
          right: 5,
          padding: 2,
          color: '#424242',
          bgcolor: 'secondary.main',
          borderColor: 'primary.main',
          borderStyle: 'solid',
          borderRadius: 2,
          borderWidth: 2,
          boxShadow: 'rgba(0, 0, 0, 0.25) 0px 54px 55px, rgba(0, 0, 0, 0.12) 0px -12px 30px, rgba(0, 0, 0, 0.12) 0px 4px 6px, rgba(0, 0, 0, 0.17) 0px 12px 13px, rgba(0, 0, 0, 0.09) 0px -3px 5px',
          flexGrow: 1,
          maxHeight: '99%',
          // overflow: "hidden",
          // overflowY: "scroll",
        }}>
          <Box sx={{
            flexGrow: 1,
            color: "primary.dark",
          }}>
            <AppBar
              position="static"
              sx={{
                bgcolor: "primary.dark"
              }}
            >
              <Toolbar>
                <Typography
                  variant="h6"
                  color="primary.main"
                  component="div"
                  sx={{ flexGrow: 1 }}
                // gutterBottom
                >
                  KEYHOLE //SWATHS//
                </Typography>
                <IconButton
                  color="primary"
                  onClick={handleOpen}
                  size="medium"
                  sx={{
                    // ml: 6,
                    // r: 0,
                    // mb: '0.35em',
                    // p: 0
                  }}
                >
                  <HelpIcon />
                </IconButton>
              </Toolbar>
            </AppBar>
          </Box>
          <FilterPane />
          {mission &&
            <Box sx={{}}>
              <MissionPane />
            </Box>
          }
          {frame &&
            <Box sx={{}}>
              <FramePane />
            </Box>
          }
        </Box>
        }
        <Modal
          open={open}
          handleClose={handleClose}
        />
        {/* <CtrlMap
            projection={projection}
            setProjection={setProjection}
          /> */}
      </Container>
      }
      {(dataLoading || mapLoading) && <MapLoadingHolder className="loading-holder" />}
    </div >
  );
}

export default Home;