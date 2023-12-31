import Summary from '@/ui/weaklyPrices/summary'
import fs from 'node:fs';
import Card from '@/app/weaklyPrices/card'

// TODO: Move all the file stuff to the backend api for this pages GET

//import { }

interface Item {
    name: string;
    old_price: string;
    new_price: string;
}

function readColesSummary(fileName: string): Item[] {

    const dir = './src/scripts/weaklyPrices/coles_catalogue/';
    const filePath = dir + fileName;
    console.log(`Attempting to read from ${filePath}`);

    try {
        const data = fs.readFileSync(filePath, 'utf8');
        return parseData(data);
    } catch (err) {
        console.error(err);
    }
    return [];
}

function parseData(data: string): Item[] {

    let items = [];

    let lines = data.split('\r\n');

    for (let line of lines) {

        let substrings = line.split(',');

        const item: Item = {
            name: substrings[0],
            old_price: substrings[1],
            new_price: substrings[2]
        };

        items.push(item);
    }

    // Removing elements
    items.splice(0, 1)                  // First element, headings
    items.splice(items.length - 1, 1)   // Last element, empty

    return items;
}

function readWoolSummary() {

}

export default function Page() {

    const colesCatalogue = readColesSummary('Baby.csv');
    const Other = readColesSummary('Pet.csv');

    console.log(colesCatalogue);

    return (
        // This is the container for the catalogue summaries
        <div className='
        w-full p-20 
        flex flex-col md:flex-row
        items-center'>

            <Card 
                title={"BabyCo"}
                catalogue={colesCatalogue}
            />

            <Card 
                title={"PetsCo"}
                catalogue={Other}
            />

        </div>
    
    );
}