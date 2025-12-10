import type { ReactNode } from "react";

interface StatCardProps{
    name:string;
    numb:number | null;
    icon:ReactNode;
}

export default function StatCard(props:StatCardProps){

    return(
        <div className="bg-gray-700 w-full rounded-xl px-3 items-center text-white py-2 h-20 flex gap-3 hover:shadow-xl cursor-pointer transform transition-all duration-300 hover:-translate-y-2">
            {props.icon}
            <div className="flex flex-col justify-between gap-1">
               <span className="uppercase font-semibold text-sm">{props.name}</span> 
               <span className="font-bold text-lg">{props.numb}</span>
            </div>
        </div>
    )
}