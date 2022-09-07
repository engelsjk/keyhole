import type { NextPage } from "next";
import { useEffect, useRef, useState, Fragment, useCallback } from "react";

import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import Map from '~/components/map';
import ControlPane from '~/components/controlPane';
import MissionPane from '~/components/missionPane';
import FramePane from '~/components/framePane';
import MapPane from '~/components/mapPane';

import { useControl } from "~/context/controlContext";

import styles from "../styles/Home.module.css";
import Switch from "@mui/material/Switch";

const label = { inputProps: { "aria-label": "Switch demo" } };

// mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN!;

const Home: NextPage = () => {

  // INTERFACE
  // const [open, setOpen] = useState(true);
  // const toggleDrawer = () => {
  //   setOpen(!open);
  // };

  const {
    selectedDesignator,
    selectedResolution,
    selectedMission,
    rangeAcquisitionYears,
    setRangeAcquisitionYears,
    selectedCameraType,
    setSelectedCameraType,
    showDownloads,
    showFrame,
    mission,
    frame,
    dataLoading,
    setDataLoading,
    missionData,
    setMissionData,
  } = useControl();

  useEffect(() => {
    console.log("[]")
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
          overflow: 'none',
        }}
        disableGutters
      >
        <Box sx={{
          height: '100%',
          width: '100%',
        }}>
          <Map />
        </Box>

        <Box sx={{
          position: 'absolute',
          height: 350,
          width: 200,
          top: 5,
          right: 5,
        }}>
          <ControlPane
          />
        </Box>

        {mission && <Box sx={{
          position: 'absolute',
          height: 300,
          width: 300,
          top: 5,
          left: 5,
        }}>
          <MissionPane />
        </Box>
        }

        {frame && <Box sx={{
          position: 'absolute',
          height: 300,
          width: 300,
          maxWidth: 300,
          bottom: 5,
          left: 5,
        }}>
          <FramePane />
        </Box>
        }

        {/* <CtrlMap
            projection={projection}
            setProjection={setProjection}
          /> */}
        {/*       
        <BottomToolBar
          projection={projection}
          onChangeProjection={onChangeProjection}
        /> */}
      </Container>
    </div >
  );
}

export default Home;