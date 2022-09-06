export const getDesignatorLabel = (value: string) => {
    const labels: { [key: string]: string } = {
        'KH-1': 'KH-1 CORONA',
        'KH-2': 'KH-2 CORONA',
        'KH-3': 'KH-3 CORONA',
        'KH-4': 'KH-4 CORONA',
        'KH-4A': 'KH-4A CORONA',
        'KH-4B': 'KH-4B CORONA',
        'KH-5': 'KH-5 ARGON',
        'KH-6': 'KH-6 LANYARD',
        'KH-7': 'KH-7 GAMBIT',
        'KH-9': 'KH-9 HEXAGON',
    }
    return labels[value];
}
export const getResolutionLabel = (value: number) => {
    const labels: { [key: number]: string } = {
        1: '0.6 to 1.2 m',
        2: '1.8 m',
        3: '2.7 m',
        4: '6.1 to 9.1 m',
        5: '7.6 m',
        6: '9.1 m',
        7: '12.2 m',
        8: '140.2 m'
    }
    return labels[value];
};

