import '@/app/weaklyPrices/weaklyPrices.css';

import { Poppins } from 'next/font/google';
import { Open_Sans } from 'next/font/google';

import Card from '@/app/weaklyPrices/card'
import { Button, TopButton } from '@/ui/button';
import CatalogueReader, { Item } from '@/app/weaklyPrices/catalogueReader';

const poppins = Poppins({
    weight: '500',
    subsets: ['latin'],
});

const openSans = Open_Sans({
    weight: '300',
    subsets: ['latin'],
});

function readItems(fileName: string) {
    const reader = new CatalogueReader(fileName);
    return reader.readColesSummary();
}

function getTopDrops(fileName: string, itemCount: number): Item[] {
    let items = readItems(fileName);

    let sortedItmes = items.sort((a: Item, b: Item) => {
        return (b.oldPrice - b.newPrice) - (a.oldPrice - a.newPrice)
    });
    
    return sortedItmes.slice(0, itemCount);
}

function getCuratedColes() {
    const catagories = [
        "Frozen",
        'Healthy Living',
        'Meat, Seafood & Deli',
        'Household'
    ];

    let items: Item[] = [];

    for (const catagory of catagories) {

        let drops = getTopDrops(catagory, 2);
        items.push(...drops);
    }

    return items;
}

function getCuratedWoolies() {

}

export default function Page() {

    const colesCatalogue = getCuratedColes();
    const wooliesCatalogue = readItems('Pet');

    const colesColor = 'text-[#ed1c22]';
    const wooliesColor = 'text-[#60AB31]';
    // Another green is #099950

    return (
        <div className='col-center'>

            <TopButton link={"/"} text={'Home'}/>

            <div className='cardDisplay'>

                <div className='col-center'>
                    <Card 
                        title={"coles"} 
                        catalogue={colesCatalogue}
                        titleClasses={`
                            ${poppins.className} 
                            ${colesColor}
                        `}
                    />
                    <Button link={'/weaklyPrices/details/coles'} text={'View More'}/>
                </div>

                <div className='col-center'>
                    <Card
                        title={"Woolies"}
                        catalogue={wooliesCatalogue}
                        titleClasses={`
                            ${openSans.className}
                            ${wooliesColor}
                            ${'tracking-[-0.09em]'}
                        `}
                    />
                    <Button link={'/weaklyPrices/details/woolies'} text={'View More'}/>
                </div>
                
            </div>
        </div>
        
      );
      
}