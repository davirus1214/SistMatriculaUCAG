import { useEffect } from "react"
import { useAppDispatch } from "../../hooks/hooks"
import { fetchAds, fetchMainAds } from "../../redux/reducers/adsSlice"
import { AdsMain } from "./components/AdsMain"
import { AdsAdd } from "./components/AdsAdd"
import { AdsList } from "./components/AdsList"

export const Ads = () => {
  const dispatch = useAppDispatch()
  useEffect(() => {
    dispatch(fetchMainAds())
    dispatch(fetchAds())
  },[])
  
  return (
    <>
      <div className="p-3 mb-2 bg-white text-dark border" id="about-container">        
        <AdsMain/>
        <AdsAdd/>
        <div className="container-fluid">
          <AdsList/>
        </div>

        
      </div>
    </>
  )
}
