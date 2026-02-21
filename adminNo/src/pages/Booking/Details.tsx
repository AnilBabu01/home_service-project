import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import DefaultLayout from '../../layout/DefaultLayout';
import InputField from '../../components/Forms/Common/InputField';
import { convertDate } from '../../utils/funtion';
const Details = () => {
  const location = useLocation();
  const [isData, setisData] = useState<any>(null);

  const BookingData = location.state;

  useEffect(() => {
    if (BookingData) {
      setisData(BookingData);
    }
  }, [BookingData]);

  console.log('sdf', isData);

  // Task

  return (
    <DefaultLayout>
      <Breadcrumb pageName="Booking details" />
      <div className="flex flex-col gap-10">
        <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="py-6 px-4 md:px-6 xl:px-7.5">
            <h4 className="text-xl font-semibold text-black dark:text-white mb-4">
              Details
            </h4>
            <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
              <InputField
                type="text"
                label="Service name"
                placeholder=""
                value={isData?.service?.provider.name || ''}
                onChange={() => {}}
                required={false}
              />
              <InputField
                type="text"
                label="Customer Name"
                placeholder=""
                value={isData?.user?.fullname || ''}
                onChange={() => {}}
                required={false}
              />
              <InputField
                type="text"
                label="Booking Date"
                placeholder=""
                value={isData?.date || ''}
                onChange={() => {}}
                required={false}
              />
            </div>
            <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
              <InputField
                type="text"
                label="Total Cost"
                placeholder="Enter service name"
                value={isData?.totalAmount.toString() || ''}
                onChange={() => {}}
                required={false}
              />
              <InputField
                type="text"
                label="Time Slot"
                placeholder=""
                value={isData?.time || ''}
                onChange={() => {}}
                required={false}
              />
              <InputField
                type="text"
                label="Advance Paid"
                placeholder=""
                value={isData?.advanceAmount.toString() || ''}
                onChange={() => {}}
                required={false}
              />
              <InputField
                type="text"
                label="createdAt"
                placeholder=""
                value={convertDate(isData?.createdAt) || ''}
                onChange={() => {}}
                required={false}
              />
            </div>

            {/* <div className="flex justify-between items-center">
              <label className="mb-2.5 block text-black dark:text-white">
                Task List
              </label>
            </div> */}

            {/* {?.map((item: InputType, index: number) => (
              <div
                key={index}
                className="relative mb-4.5 flex flex-col gap-6 xl:flex-row"
              >
                <InputField
                  type="text"
                  label="Name"
                  placeholder="Enter name"
                  hidetitle={false}
                  value={item.keyName ?? ''}
                  required={true}
                  onChange={(e) =>
                   {}
                  }
                />

                <InputField
                  type="number"
                  label="Amount"
                  placeholder="Enter amount"
                  hidetitle={false}
                  value={item.amount ?? ''}
                  required={true}
                  onChange={(e) =>
                   {}
                  }
                />

                <InputField
                  type="number"
                  label="On discount"
                  placeholder="Enter onDiscount"
                  hidetitle={false}
                  value={item.onDiscount ?? ''}
                  required={true}
                  onChange={(e) =>
                  {}
                  }
                />

               
              </div>
            ))} */}
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default Details;
