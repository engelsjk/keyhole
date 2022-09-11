import { createContext, useContext, ReactNode, useState, Dispatch, SetStateAction } from 'react';
import { MissionData, Mission, Frame } from '~/shared/types';

type appContextType = {
    selectedDesignator: string;
    setSelectedDesignator: Dispatch<SetStateAction<string>>
    selectedResolution: string;
    setSelectedResolution: Dispatch<SetStateAction<string>>
    selectedMission: string | null;
    setSelectedMission: Dispatch<SetStateAction<string | null>>
    rangeAcquisitionYears: number[] | null;
    setRangeAcquisitionYears: Dispatch<SetStateAction<number[] | null>>
    selectedCameraType: string | null;
    setSelectedCameraType: Dispatch<SetStateAction<string | null>>
    showDownloads: boolean;
    setShowDownloads: Dispatch<SetStateAction<boolean>>,
    showFrame: boolean;
    setShowFrame: Dispatch<SetStateAction<boolean>>,
    mission: Mission | undefined;
    setMission: Dispatch<SetStateAction<Mission | undefined>>,
    frame: Frame | null;
    setFrame: Dispatch<SetStateAction<Frame | null>>,
    dataLoading: boolean,
    setDataLoading: Dispatch<SetStateAction<boolean>>,
    mapLoading: boolean,
    setMapLoading: Dispatch<SetStateAction<boolean>>,
    missionData: MissionData | null;
    setMissionData: Dispatch<SetStateAction<MissionData | null>>,
    projection: string;
    setProjection: Dispatch<SetStateAction<string>>,
    showLabels: boolean;
    setShowLabels: Dispatch<SetStateAction<boolean>>,
};

const appContextDefaultValues: appContextType = {
    selectedDesignator: '',
    setSelectedDesignator: () => { },
    selectedResolution: '',
    setSelectedResolution: () => { },
    selectedMission: null,
    setSelectedMission: () => { },
    rangeAcquisitionYears: null,
    setRangeAcquisitionYears: () => { },
    selectedCameraType: null,
    setSelectedCameraType: () => { },
    showDownloads: true,
    setShowDownloads: () => { },
    showFrame: false,
    setShowFrame: () => { },
    mission: undefined,
    setMission: () => { },
    frame: null,
    setFrame: () => { },
    dataLoading: true,
    setDataLoading: () => { },
    mapLoading: true,
    setMapLoading: () => { },
    missionData: null,
    setMissionData: () => { },
    projection: 'globe',
    setProjection: () => { },
    showLabels: true,
    setShowLabels: () => { },
};

const AppContext = createContext<appContextType>(appContextDefaultValues);

export function useAppContext() {
    return useContext(AppContext);
}

type Props = {
    children: ReactNode;
};

export function AppContextProvider({ children }: Props) {

    const [selectedDesignator, setSelectedDesignator] = useState<string>('');
    const [selectedResolution, setSelectedResolution] = useState<string>('');
    const [selectedMission, setSelectedMission] = useState<string | null>(null);
    const [mission, setMission] = useState<Mission | undefined>(undefined);
    const [frame, setFrame] = useState<Frame | null>(null);

    const [rangeAcquisitionYears, setRangeAcquisitionYears] = useState<number[] | null>(null);

    const [selectedCameraType, setSelectedCameraType] = useState<string | null>(null);
    const [showDownloads, setShowDownloads] = useState<boolean>(true);
    const [showFrame, setShowFrame] = useState<boolean>(false);

    const [dataLoading, setDataLoading] = useState<boolean>(true);
    const [mapLoading, setMapLoading] = useState<boolean>(true);

    const [missionData, setMissionData] = useState<MissionData | null>(null);

    const [projection, setProjection] = useState<string>('globe');
    const [showLabels, setShowLabels] = useState<boolean>(true);

    const value = {
        selectedDesignator,
        setSelectedDesignator,
        selectedResolution,
        setSelectedResolution,
        selectedMission,
        setSelectedMission,
        rangeAcquisitionYears,
        setRangeAcquisitionYears,
        selectedCameraType,
        setSelectedCameraType,
        showDownloads,
        setShowDownloads,
        showFrame,
        setShowFrame,
        mission,
        setMission,
        frame,
        setFrame,
        dataLoading,
        setDataLoading,
        mapLoading,
        setMapLoading,
        missionData,
        setMissionData,
        projection,
        setProjection,
        showLabels,
        setShowLabels,
    }

    return (
        <>
            <AppContext.Provider value={value}>
                {children}
            </AppContext.Provider>
        </>
    );
}


