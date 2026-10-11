import './App.css'
type Data = {
    label:string,
    val:any,
    iden:string
}
export default function Card({label,val,iden}:Data){
    if(label === 'Air Quality: '){
        delete val['gb-defra-index']
        delete val['us-epa-index']
    }
    return (
        <div className='bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow duration-200 flex flex-col gap-1 items-center text-center'>
            <h4 className='text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide'>{label}</h4>
            {label === 'Air Quality: ' && (
                <div className='text-lg font-bold text-gray-800 dark:text-gray-100'>
                    {Object.keys(val).map((val2:string,idx)=>(
                        <div key={idx}>{val2.toUpperCase()} : {val[val2]}</div>
                    ))}
                </div>
            )}
            {label !== 'Air Quality: ' && (
                <h4 className='text-lg font-bold text-gray-900 dark:text-gray-100'>{val} {iden}</h4>
            )}
        </div>
    )
}