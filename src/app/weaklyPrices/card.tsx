export default function Card({ title, catalogue }) {
    return (
        <div className="m-8">

            {/* Headings */}
            <h2 className='
            text-center justify-center
            font-bold text-9xl
            w-1/2 min-w-[600px]
            p-4
            '>
                {title}
            </h2>

            {/* Item tables */}
            <div className='border-2 w-1/2 pb-4 min-w-[600px]'>

                <div className='flex text-center font-bold pt-4 pb-4'>
                    <p className='w-3/4'>Items</p>
                    <p className='w-1/4'>Prices</p>
                </div>

                {catalogue.map((item, index) => (

                    <div key={index} className='flex'>

                        <div className='flex flex-auto w-3/4 justify-center text-center border-r-2 border-white p-4'>
                            <p>{item.name}</p>
                        </div>
                        
                        <div className='flex flex-auto w-1/4 justify-center text-center items-center p-4'>
                            <p>${item.old_price}</p>
                        </div>

                    </div>
                ))}
            </div>
        </div>
    );
}