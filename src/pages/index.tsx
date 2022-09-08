import type { NextPage } from "next";
import { useEffect, useRef, useState, Fragment, useCallback } from "react";

import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import Map from '~/components/map';
import FilterPane from '~/components/filterPane';
import MissionPane from '~/components/missionPane';
import FramePane from '~/components/framePane';
import MapPane from '~/components/mapPane';
import MapLoadingHolder from "../components/mapLoadingHolder";
import Modal from '~/components/modal';
import IconButton from '@mui/material/IconButton';
import HelpIcon from '@mui/icons-material/Help';


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
          flexDirection: "column",
          overflow: "hidden",
          overflowY: "scroll",
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
          borderWidth: 1,
        }}>
          <div style={{ display: 'flex' }}>
            <Typography
              variant="h5"
              color="primary.main"
              gutterBottom
            >
              KEYHOLE //SWATHS//
            </Typography>
            <IconButton
              color="primary"
              aria-label="open modal"
              component="label"
              onClick={handleOpen}
              size="medium"
              sx={{
                ml: 6,
                mb: '0.35em',
                p: 0
              }}
            >
              <HelpIcon />
            </IconButton>
          </div>
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