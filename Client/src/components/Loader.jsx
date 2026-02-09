import { Loader as LoaderIcon } from 'lucide-react'
const Loader = () => {
  return (
    <>
      <div className="flex items-center justify-center w-full h-full p-4">
        <LoaderIcon className="h-10 w-10 animate-spin text-blue-500" />
      </div>
    </>
  )
}
export default Loader