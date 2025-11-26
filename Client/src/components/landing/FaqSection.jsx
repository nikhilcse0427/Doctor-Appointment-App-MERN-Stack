import React,{useState} from 'react'
import { Button } from '../ui/button'
import { trustLogos } from '@/lib/constants'
import { faqs } from '@/lib/constants'
import { ChevronUp, ChevronDown } from 'lucide-react'

const FaqSection = () => {
  const [openIdx, setOpenIdx] = useState(0)

  const handleToggleBtn = (idx)=>{
    { openIdx===idx? setOpenIdx(null):setOpenIdx(idx) }
  }
  return (
    <div>
      <section className='p-8'>
        <h2 className='text-center font-bold text-4xl'>Trusted by millions since 2005</h2>
        <div className='grid gap-5 mt-10 grid-cols-2 md:grid-cols-6'>
          {
            trustLogos.map((trustLog, idx)=>(
              <Button key={idx} variant="ghost" className='text-gray-500'>
                {trustLog}
              </Button>
            )) 
          }
        </div>
          {/* Frequently asked question */}
          <div className='mt-20 flex flex-col justify-center items-center'>
            <h2 className='font-bold text-4xl text-center p-4'>Frequently asked Questions</h2>
            <div className='w-200'>
            {
              faqs.map((faq, idx)=>{
                return(
                  <div key={idx} className='box-shadow-lg border-solid  border rounded-md sm z-10 p-5 mt-5'>
                    <div 
                    onClick={()=>(handleToggleBtn(idx))}
                    className='flex justify-between'>
                      <h5 className='font-bold text-2xl text-gray-700'>{faq.question}</h5>
                      {openIdx===idx? <ChevronUp />:<ChevronDown />}
                    </div>
                    {
                      openIdx===idx && (
                        <p className='py-2'>{faq.answer}</p>
                      )
                    }
                  </div>
                )
              })
            }
            </div>
          </div>
      </section>
    </div>
  )
}

export default FaqSection
