import CatalogueReader from '@/app/weaklyPrices/catalogueReader'
import Card from '@/app/weaklyPrices/card'
import { HomeButton } from '@/ui/button';

export default function Page() {
    const items = new CatalogueReader('top.csv').readColesSummary()

    return (
        <div className='col-center'>
            <HomeButton />
        </div>
    );
}

function getCatagories() {
    return [
        'All',
        'Baby',
        'Bread & Bakery',
        'Cloathing',
        'Dairy, Eggs & Meals',
        'Drinks',
        'Frozen',
        'Fruit & Vegetables',
        'Half Price Specials',
        'Health & Beauty',
        'Healthy Living',
        'Household',
        'Liquor',
        'Meat, Seafood & Deli',
        'Pantry',
        'Pet',
        'Stationery & Media',
    ]
}