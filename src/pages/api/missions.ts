import path from 'path';
import { promises as fs } from 'fs';
import type { NextApiRequest, NextApiResponse } from 'next'

const missions = async (req: NextApiRequest, res: NextApiResponse) => {
    const jsonDirectory = path.join(process.cwd(), 'data');
    try {
        const fileContents = await fs.readFile(jsonDirectory + '/missions.json', 'utf8');
        const jsonContents = JSON.parse(fileContents);
        res.status(200).json(jsonContents);
    } catch (error) {
        res.status(500).send('oops! mission data not available');
    }
}

export default missions;