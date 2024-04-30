import { useEffect } from "react"
import { ServiceMain } from "./components/ServiceMain"
import { useAppDispatch } from "../../hooks/hooks"
import { fetchMainService, fetchService } from "../../redux/reducers/servicesSlice"
import { ServiceAdd } from "./components/ServiceAdd"
import { ServiceList } from "./components/ServiceList"

export const ServicePage = () => {
  const dispatch = useAppDispatch()
  useEffect(() => {
    dispatch(fetchMainService())
    dispatch(fetchService())
  },[])
  return (
    <div className="p-3 mb-2 bg-white text-dark border" id="about-container">        
      <ServiceMain/>
      <ServiceAdd/>
      <div className="container-fluid">
        <ServiceList/>
      </div>

    
    </div>
  )
}
