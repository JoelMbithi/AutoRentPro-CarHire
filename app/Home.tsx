import CarsDisplay from '@/app/features/car-listing/components/CarsDisplay'
import CarType from '@/app/features/car-listing/components/CarType'
import Edition from '@/app/shared/Components/Edition'
import HomeBanner from '@/app/shared/Components/HomeBanner'
import Navbar from '@/app/shared/Components/Navbar'
import ServiceBanner from '@/app/shared/ui/ServiceBanner'
import Testimonials from '@/app/features/testimonials/components/Testimonials'
import TopDeals from '@/app/features/deals/components/TopCarDeals'

const Home = () => {
  return (
    <div>
         <HomeBanner/>
    <CarType/>
    <ServiceBanner/>
    <TopDeals/>
    <CarsDisplay/>
    <Edition/>
    <Testimonials/>
    </div>
  )
}

export default Home
