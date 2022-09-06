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

import { MissionData, Mission, Filters } from '~/shared/types';

import styles from "../styles/Home.module.css";
import Switch from "@mui/material/Switch";

const label = { inputProps: { "aria-label": "Switch demo" } };

// mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN!;

const Home: NextPage = () => {

  const [isLoading, setLoading] = useState<boolean>(false);
  const [missionData, setMissionData] = useState<MissionData | null>(null);

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
      setLoading(false);
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
          overflow: 'none',
          display: 'flex',
          '@media (min-width: 600px)': {
            padding: 0,
          },
          '@media (min-width: 1200px)': {
            maxWidth: '100%',
          }
        }}
      >
        <Box sx={{
          flex: 7,
          '@media (max-width: 600px)': {
            flex: 1,
          }
        }}>
          <Map />
        </Box>
        <Box sx={{
          flex: 1,
          '@media (max-width: 600px)': {
            flex: 0,
          },
          overflow: 'none',
          backgroundColor: 'rgba(255,0,0,0.5)',
        }}>
          <Typography
            color="inherit"
            noWrap
            sx={{ flexGrow: 1 }}
          >
            KEYHOLE
          </Typography>
          <ControlPane
            missionData={missionData}
          />
          {mission &&
            <MissionPane
              mission={mission}
            />
          }
          {frame &&
            <FramePane
              frame={frame}
            />
          }
          {/* <CtrlMap
            projection={projection}
            setProjection={setProjection}
          /> */}
        </Box>
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