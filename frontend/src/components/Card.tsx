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
    console.log(val)
    return (
        <div className='border border-black rounded-lg p-2 flex justify-center items-center flex-col'>
            <div>
                <h4 className='text-2xl'>{label}</h4>
                {label === 'Air Quality: ' && (
                    <div>
                        {Object.keys(val).map((val2:string,idx)=>(
                            <h4 key={idx}>{val2.toUpperCase()} : {val[val2]}</h4>
                        ))}
                    </div>
                )}
                {label !== 'Air Quality: ' && (
                    <h4>{val} {iden}</h4>
                )}
            </div>
        </div>
    )
}