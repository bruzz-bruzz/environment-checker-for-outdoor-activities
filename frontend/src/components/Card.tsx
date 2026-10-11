import './App.css'
type Data = {
    label:string,
    val:number | string,
    iden:string
}
export default function Card({label,val,iden}:Data){
    return (
        <div className='border border-black rounded-lg p-2'>
            <div>
                <h4 className='text-2xl'>{label}</h4>
                <h4>{val} {iden}</h4>
            </div>
        </div>
    )
}