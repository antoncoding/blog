import { CONFIG } from "site.config"
import React from "react"
import { MdLocalDrink } from "react-icons/md"

const ServiceCard: React.FC = () => {
  if (!CONFIG.projects) return null
  return (
    <>
      <ul className="rounded-xl mb-9 bg-white dark:bg-zinc-700 p-1 flex flex-col">
        <div className="font-subtitle p-2 mb-1 dark:text-white text-center w-full text-gray-600"> Projects </div>
        <a
          href={`${CONFIG.projects[0].href}`}
          rel="noreferrer"
          target="_blank"
          className="p-3 hover:bg-gray-100 dark:hover:bg-zinc-700 rounded-xl cursor-pointer flex items-center gap-3 text-gray-500 dark:text-white hover:text-black dark:hover:text-white"
        >
          <MdLocalDrink className="text-2xl" />
          <div className="text-sm">{CONFIG.projects[0].name}</div>
        </a>
      </ul>
    </>
  )
}

export default ServiceCard
