import { createContext, useContext, ReactNode, useState, Dispatch, SetStateAction } from 'react';
import { MissionData, Mission, Frame } from '~/shared/types';

type controlContextType = {
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
    openUSGSMetadata: () => void;
    mission: Mission | undefined;
    setMission: Dispatch<SetStateAction<Mission | undefined>>,
    frame: Frame | null;
    setFrame: Dispatch<SetStateAction<Frame | null>>,
    dataLoading: boolean,
    setDataLoading: Dispatch<SetStateAction<boolean>>,
    missionData: MissionData | null;
    setMissionData: Dispatch<SetStateAction<MissionData | null>>,

};

const controlContextDefaultValues: controlContextType = {
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
    openUSGSMetadata: () => { },
    mission: undefined,
    setMission: () => { },
    frame: null,
    setFrame: () => { },
    dataLoading: true,
    setDataLoading: () => { },
    missionData: null,
    setMissionData: () => { },
};

const ControlContext = createContext<controlContextType>(controlContextDefaultValues);

export function useControl() {
    return useContext(ControlContext);
}

type Props = {
    children: ReactNode;
};

export function ControlProvider({ children }: Props) {

    const [selectedDesignator, setSelectedDesignator] = useState<string>('');
    const [selectedResolution, setSelectedResolution] = useState<string>('');
    const [selectedMission, setSelectedMission] = useState<string | null>(null);
    const [mission, setMission] = useState<Mission | undefined>(undefined);
    const [frame, setFrame] = useState<Frame | null>(null);

    const [rangeAcquisitionYears, setRangeAcquisitionYears] = useState<number[] | null>(null);
    const [selectedCameraType, setSelectedCameraType] = useState<string | null>(null);
    const [showDownloads, setShowDownloads] = useState<boolean>(true);
    const [showFrame, setShowFrame] = useState<boolean>(false);

    const [dataLoading, setDataLoading] = useState<boolean>(false);
    const [missionData, setMissionData] = useState<MissionData | null>(null);

    const openUSGSMetadata = () => {
        console.log('openUSGSMetadata')
    };

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
        missionData,
        setMissionData,
        openUSGSMetadata,
    }

    return (
        <>
            <ControlContext.Provider value={value}>
                {children}
            </ControlContext.Provider>
        </>
    );
}


