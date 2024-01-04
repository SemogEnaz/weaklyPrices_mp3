import fs from 'node:fs';

export type Item = {
    name: string;
    oldPrice: number;
    newPrice: number;
}

export default class CatalogueReader {
    fileName: string;

    constructor(fileName: string) {
        this.fileName = fileName + '.csv';
    }

    readColesSummary(): Item[] {

        const dir = './src/scripts/weaklyPrices/coles_catalogue/';
        const filePath = dir + this.fileName;
        console.log(`Attempting to read from ${filePath}`);
    
        try {
            const data = fs.readFileSync(filePath, 'utf8');
            return this._parseData(data);
        } catch (err) {
            console.error(err);
        }
        return [];
    }
    
    _parseData(data: string): Item[] {
    
        let items = [];
    
        let lines = data.split('\r\n');
    
        for (let line of lines) {
    
            let substrings = line.split(',');
    
            const item: Item = {
                name: substrings[0],
                oldPrice: parseFloat(substrings[1]),
                newPrice: parseFloat(substrings[2])
            };
    
            items.push(item);
        }
    
        // Removing elements
        items.splice(0, 1)                  // First element, headings
        items.splice(items.length - 1, 1)   // Last element, empty
    
        return items;
    }
}