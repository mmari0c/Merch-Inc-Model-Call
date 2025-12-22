function Favorites({ index, name, modelNumber }) {
   return (
      <div className="bg-white p-4 rounded-lg border border-gray-200 flex items-center gap-3 justify-between md:flex-col lg:flex-row">
         <div className="flex items-center gap-3">
            <p>{index + 1}.</p>
            <div className="flex flex-col">
               <p>{name}</p>
               <span className="text-gray-500">#{modelNumber}</span>
            </div>
         </div>
         <button className="bg-white border border-gray-200 py-2 px-4 rounded-lg hover:bg-gray-100 transition-colors md:w-full lg:w-auto">
            +
         </button>
      </div>

   )
}

export default Favorites