function DesignerOrder({ name, turnOrder, currentTurn, isSkipped, isSubmitted, onSkip }) {
   const isActive = currentTurn === turnOrder && !isSkipped && !isSubmitted

   return (
      <div className={`flex flex-row items-center justify-between p-4 rounded-xl border-2 text-xs sm:text-sm ${
         isSkipped ? 'border-gray-200 bg-white opacity-40' :
         isSubmitted ? 'border-gray-200 bg-white opacity-60' :
         isActive ? 'border-gray-200 bg-gray-100' :
         'border-gray-200 bg-white'
      }`}>
         <div className="flex items-center gap-2">
            <p className="font-medium rounded-full bg-gray-200 p-2 w-8 h-8 flex items-center justify-center">{turnOrder}</p>
            <div className="flex flex-col">
               <p className={`font-medium ${isSkipped ? 'line-through text-gray-400' : ''}`}>{name}</p>
               {isSkipped && <p className="text-gray-400 text-xs">Skipped</p>}
               {isSubmitted && !isSkipped && <p className="text-gray-400 text-xs">Submitted</p>}
            </div>
         </div>
         <div className="flex items-center gap-2">
            {isActive && <p className="text-white bg-black p-2 rounded-lg font-medium">Current Turn</p>}
            <button
               type="button"
               className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  isSkipped
                     ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                     : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
               }`}
               onClick={() => onSkip && onSkip()}
            >
               {isSkipped ? 'Unskip' : 'Skip'}
            </button>
         </div>
      </div>
   )
}

export default DesignerOrder