import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import HomePage from './assets/pages/Home'
import ProfilePage from './assets/pages/Profile'
import OrganizationPage from './assets/pages/Organization'
import NewsPage from './assets/pages/News'
import ServicesPage from './assets/pages/Services'
import ServiceFormPage from './assets/pages/ServiceForm'
import MapsPage from './assets/pages/Maps'
import LoginPage from './assets/pages/Login'
import DashboardPage from './assets/pages/Dashboard'
import DashboardHome from './assets/layouts/DashboardHome'
import DashboardNews from './assets/layouts/DashboardNews'
import DashboardServices from './assets/layouts/DashboardServices'
import DashboardComplaints from './assets/layouts/DashboardComplaints'
import DashboardAssets from './assets/layouts/DashboardAssets'
import AddNews from './assets/layouts/AddNews'
import NewsDetailsPage from './assets/pages/NewsDetails'
import PublicRoute from './PublicRoute'
import PrivateRoute from './PrivateRoute'
import AuthContextProvider from './contexts/AuthContext'
import LoadingContextProvider from './contexts/LoadingContext'
import DashboardSettings from './assets/layouts/DashboardSettings'
import UserSetting from './assets/layouts/UserSetting'
import VillagerContextProvider from './contexts/VillagerContext'
import UnauthorizedPage from './assets/pages/Unauthorized'
import ComplaintFormPage from './assets/pages/ComplaintForm'
import VillagerServiceListPage from './assets/pages/VillagerServiceList'
import VillagerSetting from './assets/layouts/VillagerSetting'
import DashboardServiceDetails from './assets/layouts/DashboardServiceDetails'
import ToastContextProvider from './contexts/ToastContext'
import AddVillager from './assets/layouts/AddVillager'
import VillageRegionalSetting from './assets/layouts/VillageRegionalSetting'
import VillageGovernmentSetting from './assets/layouts/VillageGovernmentSetting'
import HomepageAssetsSetting from './assets/layouts/HomepageAssetsSetting'
import VillageMapSetting from './assets/layouts/VillageMapSetting'
import VillageResidenceSetting from './assets/layouts/VillageResidenceSetting'
import AddResidence from './assets/layouts/AddResidence'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <LoadingContextProvider>
      <AuthContextProvider>
        <VillagerContextProvider>
          <ToastContextProvider>
            <BrowserRouter>
              <Routes>
                {/* PUBLIC */}
                <Route element = {<PublicRoute />}>
                  <Route path='/' element = {<HomePage/>} />
                  <Route path='/profile' element = {<ProfilePage/>} />
                  <Route path='/organization' element = {<OrganizationPage/>} />
                  <Route path='/news' element = {<NewsPage/>} />
                  <Route path='/news/:postId' element = {<NewsDetailsPage/>} />
                  <Route path='/services'>
                    <Route index element = {<ServicesPage/>} />
                    <Route path='service'>
                      <Route path='form' element = {<ServiceFormPage/>} />
                      <Route path='request' element = {<VillagerServiceListPage page='service'/>} />
                    </Route>
                    <Route path='complaint'>
                      <Route path='form' element = {<ComplaintFormPage/>}/>
                      <Route path='request' element = {<VillagerServiceListPage page='complaint'/>} />
                    </Route>
                  </Route>
                  <Route path='/map'>
                    <Route index element = {<MapsPage />} />
                  </Route>
                  <Route path='/login' element = {<LoginPage/>} />
                  <Route path='/401' element = {<UnauthorizedPage/>} />
                </Route>
                {/* PRIVATE */}
                <Route element = {<PrivateRoute />}>
                  <Route path='/dashboard' element = {<DashboardPage/>}>
                    <Route path='' element= {<DashboardHome />} />
                    <Route path='news' >
                      <Route index  element= {<DashboardNews />}/>
                      <Route path='add' element={<AddNews />} />
                      <Route path='edit/:postId' element={<AddNews />} />
                    </Route>
                    <Route path='services'>
                      <Route index element= {<DashboardServices />}/>
                      <Route path=':id' element= {<DashboardServiceDetails />}/>
                    </Route>
                    <Route path='complaints' element= {<DashboardComplaints />} />
                    <Route path='assets'>
                      <Route index element= {<DashboardAssets />} />
                      <Route path='region' element= {<VillageRegionalSetting />} />
                      <Route path='residence'>
                        <Route index element= {<VillageResidenceSetting />} />
                        <Route path='add' element= {<AddResidence />} />
                        <Route path='edit/:id' element= {<AddResidence />} />
                      </Route>
                      <Route path='government' element= {<VillageGovernmentSetting />} />
                      <Route path='homepage' element= {<HomepageAssetsSetting />} />
                      <Route path='mapdata' element= {<VillageMapSetting />} />
                    </Route>
                    <Route path='settings'>
                      <Route index element= {<DashboardSettings />} />
                      <Route path='user' element= {<UserSetting />} />
                      <Route path='villager'>
                        <Route index element= {<VillagerSetting />} />
                        <Route path='add' element= {<AddVillager />} />
                        <Route path=':id' element= {<AddVillager isEdit = {true} />} />
                      </Route>
                    </Route>
                  </Route>
                </Route>
              </Routes>
            </BrowserRouter>
          </ToastContextProvider>
        </VillagerContextProvider>
      </AuthContextProvider>
    </LoadingContextProvider>
  </StrictMode>,
)
