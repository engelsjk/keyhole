export type Mission = {
    m: string   // mission
    d: string   // designator
    r: number   // resolution index
    f: number   // num. frames
    e: number   // earliest acquisition
    l: number   // latest acquisition
    c: string[] // camera types
}

export type MissionData = Mission[]

export type Filters = {
    designator: string | null;
    resolution: number | null;
    mission: string | null;
    years: number[] | null;
}