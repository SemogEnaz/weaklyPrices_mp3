import '@/app/weaklyPrices/weaklyPrices.css'

function getValidDates(): string {

    const currentDate = new Date();

    let priorDate = new Date();
    let henceDate = new Date();

    let dayCount = 0

    while (priorDate.getDay() != 1) {
        priorDate.setDate(currentDate.getDate() + dayCount);
        dayCount--;
    }

    dayCount = 0;

    while (henceDate.getDay() != 1) {
        henceDate.setDate(currentDate.getDate() + dayCount);
        dayCount++;
    }

    const priorDay = getDateStr(priorDate);
    const henceDay = getDateStr(henceDate);

    return priorDay + ' to ' + henceDay;
}

function getDateStr(dateObj: Date): string {
    return `${dateObj.getDate()}/${dateObj.getMonth()+1}`;
}

export default function Card({ title, catalogue, titleClasses }) {

    const validThru = getValidDates();

    return (
    <div className="card">

        {/* Headings */}
        <div className='title'>

            <h2 className={`brand ${titleClasses}`}>
                {title}
            </h2>

            {/* The className can be set to company color from the prop */}
            <p className='validDates'>{validThru} (Every <span className={''}>Monday</span>)</p>
        </div>

        {/* Item tables */}
        <div className="table">

            {/* Heading */}
            <div className='heading'>
                <p className='name'>Items</p>
                <p className='price'>Prices</p>
            </div>

            {catalogue.map((item, index) => (
                <div key={index} className='flex'>

                    <div className='name'>
                        {item.name}
                    </div>

                    <div className='price'>
                            <p className='text-gray-400'>${item.oldPrice}</p> 
                            &nbsp;${item.newPrice}
                    </div>

                </div>
            ))}
        </div>
    </div>
);

}