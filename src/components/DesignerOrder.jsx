function DesignerOrder({name, turnOrder, currentTurn}) {
   return (
      <div className={`flex flex-row items-center justify-between p-4 rounded-xl border-2 ${currentTurn === turnOrder ? 'border-green-600 bg-green-100' : 'border-gray-200 bg-white'} flex flex-col gap-4 text-xs sm:text-sm`}>
         <div className="flex items-center gap-2">
            <p className="font-medium rounded-full bg-gray-200 p-2 w-8 h-8 flex items-center justify-center">{turnOrder}</p>
            <p className="font-medium">{name}</p>
         </div>
         { currentTurn === turnOrder ? (
            <p className="text-white bg-green-600 p-2 rounded-lg font-medium">Current Turn</p>
         ) : (
         null
         ) }
      </div>
   )
}

export default DesignerOrder