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
                <p className='name'>Items</p>
                <p className='price'>Prices</p>
            </div>

            {catalogue.map((item, index) => (
                <div key={index} className='flex'>

                    <div className='name'>
                        {item.name}
                    </div>

                    <div className='price'>
                        ${item.old_price}
                    </div>

                </div>
            ))}
        </div>
    </div>
);

}