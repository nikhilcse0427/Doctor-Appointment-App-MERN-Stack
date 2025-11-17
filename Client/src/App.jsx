import './App.css'
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircleIcon, CheckCircle2Icon, PopcornIcon } from "lucide-react"

function App() {

  return (
    <>
      <h1 className="font-bold text-4xl text-blue-500">Doctor Appointment App</h1>
       <Alert>
        <CheckCircle2Icon />
        <AlertTitle>Success! Your changes have been saved</AlertTitle>
        <AlertDescription>
          This is an alert with icon, title and description.
        </AlertDescription>
      </Alert>
        
    </>
  )
}

export default App
