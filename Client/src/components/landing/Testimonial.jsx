import React from 'react'
import { Star} from 'lucide-react'
import { testimonials } from '@/lib/constants'
import { Card, CardContent } from '../ui/card'

const Testimonial = () => {
  return (
    <>
      <section>
      <div className="flex flex-col justify-center p-10">
    <div className="text-center">
      
      {/* Title */}
      <h2 className="text-3xl sm:text-4xl font-bold">
        Our Patients Love Us
      </h2>

      {/* Rating Row */}
      <div className="flex flex-row gap-3 justify-center items-center pt-4 px-[-1px]">
        
        <span className="text-gray-500 text-xl">4.8</span>

        <div className="flex flex-row gap-1">
          <Star className="fill-yellow-500 text-yellow-500 w-6 h-6" />
          <Star className="fill-yellow-500 text-yellow-500 w-6 h-6" />
          <Star className="fill-yellow-500 text-yellow-500 w-6 h-6" />
          <Star className="fill-yellow-500 text-yellow-500 w-6 h-6" />
          <Star className="fill-yellow-300 text-yellow-300 w-6 h-6" />
        </div>

        <span className="text-gray-500 text-xl">82k+ Reviews</span>
      </div>
    </div>
  </div>
      </section>

      {/* {Testimonial box} */}
      <section className="p-4">
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
    {testimonials.map((testimonial, idx) => (
      <Card key={idx} className={`w-full ${testimonial.bgColor}`}>
        <CardContent className="p-4 flex flex-col gap-4">
          
          {/* Stars */}
          <div className="flex flex-row gap-1">
            {[...Array(testimonial.rating)].map((_, idx) => (
              <Star key={idx} className="fill-amber-400 text-yellow-400" />
            ))}
          </div>

          {/* Text */}
          <div className="">
            <p className="text-gray-500">{testimonial.text}</p>
          </div>

          {/* Author */}
          <span className="font-bold">{testimonial.author}</span>
          <span className="text-sm text-gray-600">{testimonial.location}</span>

        </CardContent>
      </Card>
    ))}
  </div>
  <div className="text-center mt-8">
       <button className="text-chart-2 hover:text-chart-2/80 font-medium transition-colors duration-200">
        Read more...
       </button>
        </div>
</section>


    </>
  )
}

export default Testimonial
