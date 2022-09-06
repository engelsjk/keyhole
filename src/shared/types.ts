export type Mission = {
    m: string   // mission
    d: string   // designator
    r: number   // resolution index
    f: number   // num. frames
    e: number   // earliest acquisition
    l: number   // latest acquisition
    c: string[] // camera types
}

export type Frame = {
    a: string   // download available
    c: string   // camera type
    d: number   // acquisition date
    e: number   // frame id
    f: number   // frame number
    m: string   // mission id
    p: string   // frame sequence/pass
    r: number   // resolution index
    s: string   // dataset id
}

export type MissionData = Mission[]

export type Filters = {
    designator: string | null;
    resolution: number | null;
    mission: string | null;
    years: number[] | null;
}