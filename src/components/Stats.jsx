function Stats({data, description}) {
  return (
    <div className="bg-white p-6 rounded-xl border-2 border-gray-200 w-full flex flex-col justify-center gap-4 text-xs sm:text-sm md:h-32">
      <h2 className="text-lg font-bold">{data}</h2>
      <p className="text-gray-500">{description}</p>
    </div>
  )
}

export default Stats