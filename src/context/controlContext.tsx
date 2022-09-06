import { createContext, useContext, ReactNode, useState, Dispatch, SetStateAction } from 'react';
import { Mission, Frame } from '~/shared/types';

type controlContextType = {
    selectedDesignator: string | null;
    setSelectedDesignator: Dispatch<SetStateAction<string | null>>
    selectedResolution: number | null;
    setSelectedResolution: Dispatch<SetStateAction<number | null>>
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

};

const controlContextDefaultValues: controlContextType = {
    selectedDesignator: null,
    setSelectedDesignator: () => { },
    selectedResolution: null,
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
};

const ControlContext = createContext<controlContextType>(controlContextDefaultValues);

export function useControl() {
    return useContext(ControlContext);
}

type Props = {
    children: ReactNode;
};

export function ControlProvider({ children }: Props) {

    const [selectedDesignator, setSelectedDesignator] = useState<string | null>(null);
    const [selectedResolution, setSelectedResolution] = useState<number | null>(null);
    const [selectedMission, setSelectedMission] = useState<string | null>(null);
    const [mission, setMission] = useState<Mission | undefined>(undefined);
    const [frame, setFrame] = useState<Frame | null>(null);

    const [rangeAcquisitionYears, setRangeAcquisitionYears] = useState<number[] | null>(null);
    const [selectedCameraType, setSelectedCameraType] = useState<string | null>(null);
    const [showDownloads, setShowDownloads] = useState<boolean>(true);
    const [showFrame, setShowFrame] = useState<boolean>(false);

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


