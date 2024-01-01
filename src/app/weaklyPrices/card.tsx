import '@/app/weaklyPrices/weaklyPrices.css'

export default function Card({ title, catalogue }) {
    return (
    <div className="card">

        {/* Headings */}
        <h2 className='title'>
            {title}
        </h2>

        {/* Item tables */}
        <div className="table">

            <div className='heading'>
                <p className='w-3/4 pr-8'>Items</p>
                <p className='w-1/4 pl-8'>Prices</p>
            </div>

            {catalogue.map((item, index) => (
                <div key={index} className='flex'>

                    <div className='name'>
                        <p className='pr-8'>{item.name}</p>
                    </div>

                    <div className='price'>
                        <p className='pl-8'>${item.old_price}</p>
                    </div>

                </div>
            ))}
        </div>
    </div>
);

}