import { createContext, useContext, ReactNode, useState } from 'react';

type controlContextType = {
    selectedDesignator: string | null;
    selectedResolution: number | null;
    selectedMission: string | null;
    rangeAcquisitionYears: number[];
    selectedCameraType: string | null;
    showDownloads: boolean;
    showFrame: boolean;
    openUSGSMetadata: () => void;
};

const controlContextDefaultValues: controlContextType = {
    selectedDesignator: null,
    selectedResolution: null,
    selectedMission: null,
    rangeAcquisitionYears: [1960, 1984],
    selectedCameraType: null,
    showDownloads: true,
    showFrame: false,
    openUSGSMetadata: () => { },
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

    const [rangeAcquisitionYears, setRangeAcquisitionYears] = useState<number[]>([1960, 1984]);
    const [selectedCameraType, setSelectedCameraType] = useState<string | null>(null);
    const [showDownloads, setShowDownloads] = useState<boolean>(false);
    const [showFrame, setShowFrame] = useState<boolean>(false);

    const openUSGSMetadata = () => {
        console.log('openUSGSMetadata')
    };

    const value = {
        selectedDesignator,
        selectedResolution,
        selectedMission,
        rangeAcquisitionYears,
        selectedCameraType,
        showDownloads,
        showFrame,
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


