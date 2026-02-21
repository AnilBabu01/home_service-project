import { useEffect } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import { useGetProfileQuery } from './redux/api';
import Loader from './common/Loader';
import PageTitle from './components/PageTitle';
import SignIn from './pages/Authentication/SignIn';
import SignUp from './pages/Authentication/SignUp';
import Calendar from './pages/Calendar';
import Chart from './pages/Chart';
import ECommerce from './pages/Dashboard/ECommerce';
import FormElements from './pages/Form/FormElements';
import FormLayout from './pages/Form/FormLayout';
import Profile from './pages/Profile';
import Tables from './pages/Tables';
import Alerts from './pages/UiElements/Alerts';
import Buttons from './pages/UiElements/Buttons';
import Settings from './pages/Settings';
import PrivateRoute from './components/PrivateRoute';

// Master
import ServiceCategory from './pages/Masters/ServiceCategory/Category';
import AddCategory from './pages/Masters/ServiceCategory/AddCategory';
import EditCategory from './pages/Masters/ServiceCategory/EditCategory';

// Setting
import Faq from './pages/Settings/Faq';
import Notification from './pages/Settings/Notification';
import PrivacyPolicy from './pages/Settings/PrivacyPolicy';
import FaqCategory from './pages/Settings/FaqCategory';
import AppSetting from './pages/Settings/AppSetting';

// manage service
import Service from './pages/Services/AddServices/Service';
import AddServiceSupplier from './pages/Services/AddServices/AddServiceSupplier';
import EditServiceSupplier from './pages/Services/AddServices/EditServiceSupplier';

// provider
import ProviderList from './pages/Services/Providers/ProviderList';
import EditProvider from './pages/Services/Providers/EditProvider';

// add user
import AddUser from './pages/User/AddUser';
import User from './pages/User/User';
import EditUser from './pages/User/EditUser';

// Booking
import Cancelled from './pages/Booking/Cancelled';
import Complete from './pages/Booking/Complete';
import UpComing from './pages/Booking/UpComing';
import Details from './pages/Booking/Details';

// Add slider
import Slider from './pages/Slider/Slider';
import AddSlider from './pages/Slider/AddSlider';
import EditSlider from './pages/Slider/EditSlider';

import {
  requestNotificationPermission,
  listenForMessages,
} from '../notification';

import { useSaveNotificationTokenMutation } from './redux/api';

function App() {
  const [saveNotificationToken, { isSuccess }] =
    useSaveNotificationTokenMutation();
  const { isLoading } = useGetProfileQuery();

  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    const fetchToken = async () => {
      const token = await requestNotificationPermission();
      if (token) {
        console.log('FCM Token: deom ', token);
        saveNotificationToken({ notification_token: token });
      } else {
        console.warn('Failed to retrieve FCM token');
      }
    };

    fetchToken();
    listenForMessages();
  }, []);

  
  return isLoading ? (
    <Loader />
  ) : (
    <>
      <Routes>
        <Route element={<PrivateRoute />}>
          <Route
            path="/"
            element={
              <>
                <PageTitle title="Dashboard | AndamanHub" />
                <ECommerce />
              </>
            }
          />
          <Route
            path="/calendar"
            element={
              <>
                <PageTitle title="Calendar | AndamanHub" />
                <Calendar />
              </>
            }
          />
          <Route
            path="/profile"
            element={
              <>
                <PageTitle title="Profile | AndamanHub" />
                <Profile />
              </>
            }
          />
          <Route
            path="/forms/form-elements"
            element={
              <>
                <PageTitle title="Form Elements | AndamanHub" />
                <FormElements />
              </>
            }
          />
          <Route
            path="/forms/form-layout"
            element={
              <>
                <PageTitle title="Form Layout | AndamanHub" />
                <FormLayout />
              </>
            }
          />
          <Route
            path="/tables"
            element={
              <>
                <PageTitle title="Tables | AndamanHub" />
                <Tables />
              </>
            }
          />
          <Route
            path="/account-settings"
            element={
              <>
                <PageTitle title="Account Settings | AndamanHub" />
                <Settings />
              </>
            }
          />
          <Route
            path="/chart"
            element={
              <>
                <PageTitle title="Basic Chart | AndamanHub" />
                <Chart />
              </>
            }
          />
          <Route
            path="/ui/alerts"
            element={
              <>
                <PageTitle title="Alerts | AndamanHub" />
                <Alerts />
              </>
            }
          />
          <Route
            path="/ui/buttons"
            element={
              <>
                <PageTitle title="Buttons | AndamanHub" />
                <Buttons />
              </>
            }
          />
        </Route>

        <Route
          path="/auth/signin"
          element={
            <>
              <PageTitle title="Signin | AndamanHub" />
              <SignIn />
            </>
          }
        />
        <Route
          path="/auth/signup"
          element={
            <>
              <PageTitle title="Signup | AndamanHub" />
              <SignUp />
            </>
          }
        />

        <Route
          path="/master/category"
          element={
            <>
              <PageTitle title="Add Service Category | AndamanHub" />
              <ServiceCategory />
            </>
          }
        />

        <Route
          path="/master/category/add"
          element={
            <>
              <PageTitle title="Add Service Category | AndamanHub" />
              <AddCategory />
            </>
          }
        />

        <Route
          path="/master/category/edit"
          element={
            <>
              <PageTitle title="Edit Service Category | AndamanHub" />
              <EditCategory />
            </>
          }
        />

        <Route
          path="/service/service"
          element={
            <>
              <PageTitle title="Service | AndamanHub" />
              <Service />
            </>
          }
        />
        <Route
          path="/service/supplier/add"
          element={
            <>
              <PageTitle title="Add Service Supplier | AndamanHub" />
              <AddServiceSupplier />
            </>
          }
        />

        <Route
          path="/service/supplier/edit"
          element={
            <>
              <PageTitle title="Edit Service Provider | AndamanHub" />
              <EditServiceSupplier />
            </>
          }
        />

        <Route
          path="/service/provider"
          element={
            <>
              <PageTitle title="Provider List | AndamanHub" />
              <ProviderList />
            </>
          }
        />

        <Route
          path="/service/provider/edit"
          element={
            <>
              <PageTitle title="Edit Provider  | AndamanHub" />
              <EditProvider />
            </>
          }
        />

        <Route
          path="/notification"
          element={
            <>
              <PageTitle title="Notification | AndamanHub" />
              <Notification />
            </>
          }
        />

        <Route
          path="/setting/faq"
          element={
            <>
              <PageTitle title="Faq | AndamanHub" />
              <Faq />
            </>
          }
        />

        <Route
          path="/setting/privacy-policy"
          element={
            <>
              <PageTitle title="Privacy policy | AndamanHub" />
              <PrivacyPolicy />
            </>
          }
        />

        <Route
          path="/setting/appsetting"
          element={
            <>
              <PageTitle title="App Setting | AndamanHub" />
              <AppSetting />
            </>
          }
        />

        <Route
          path="/setting/faqcategory/add"
          element={
            <>
              <PageTitle title="Add Faq Category | AndamanHub" />
              <FaqCategory />
            </>
          }
        />

        {/* user and booking */}
        <Route
          path="/user"
          element={
            <>
              <PageTitle title="User List | AndamanHub" />
              <User />
            </>
          }
        />

        <Route
          path="/user/add"
          element={
            <>
              <PageTitle title="Add User | AndamanHub" />
              <AddUser />
            </>
          }
        />

        <Route
          path="/user/edit"
          element={
            <>
              <PageTitle title="Edit User | AndamanHub" />
              <EditUser />
            </>
          }
        />

        <Route
          path="/booking/upcoming"
          element={
            <>
              <PageTitle title="Upcoming Booking | AndamanHub" />
              <UpComing />
            </>
          }
        />

        <Route
          path="/booking/complete"
          element={
            <>
              <PageTitle title="Complete Booking | AndamanHub" />
              <Complete />
            </>
          }
        />

        <Route
          path="/booking/cancelled"
          element={
            <>
              <PageTitle title="Cancelled Booking | AndamanHub" />
              <Cancelled />
            </>
          }
        />

        <Route
          path="/details"
          element={
            <>
              <PageTitle title="Booking Details | AndamanHub" />
              <Details />
            </>
          }
        />

        <Route
          path="/slider"
          element={
            <>
              <PageTitle title="Slider | AndamanHub" />
              <Slider />
            </>
          }
        />

        <Route
          path="/slider/add"
          element={
            <>
              <PageTitle title="AddSlider | AndamanHub" />
              <AddSlider />
            </>
          }
        />

        <Route
          path="/slider/edit"
          element={
            <>
              <PageTitle title="EditSlider | AndamanHub" />
              <EditSlider />
            </>
          }
        />
      </Routes>
    </>
  );
}

export default App;
