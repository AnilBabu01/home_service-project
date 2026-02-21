import { useState, useEffect } from 'react';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import TableTwo from '../../components/Tables/TableTwo';
import DefaultLayout from '../../layout/DefaultLayout';

import { useGetBookingQuery } from '../../redux/api';
import { FaEye } from 'react-icons/fa';

import { useNavigate } from 'react-router-dom';
import { convertDate } from '../../utils/funtion';

const labels = [
  { name: 'Provider Name' },
  { name: 'Booking Date' },
  { name: 'Time slot' },
  { name: 'User Name' },
  { name: 'Total Cost' },
  { name: 'Advance Paid' },
  { name: 'Created At' },
  { name: 'Status' },
  { name: 'Action' },
];

const Cancelled = () => {
  const navigate = useNavigate();

  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [isData, setisData] = useState<any[]>([]);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(10);

  const { data } = useGetBookingQuery({
    page: currentPage,
    limit: itemsPerPage,
    type: 0,
  });

  const handleGetData = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const handlePerPage = (newLimit: number) => {
    setItemsPerPage(newLimit);
  };

  useEffect(() => {
    if (data?.data) {
      setisData(Array.isArray(data?.data) ? data?.data : [data?.data]);
    }
  }, [data]);

  return (
    <DefaultLayout>
      <Breadcrumb pageName="Upcoming booking" />
      <div className="flex flex-col gap-10">
        <TableTwo
          title={'Upcoming booking'}
          setIsModalOpen={setIsAddModalOpen}
          labels={labels}
          totalItems={data?.pagination?.totalItems}
          handleGetData={handleGetData}
          handlePerPage={handlePerPage}
          currentPage={currentPage}
          itemsPerPage={itemsPerPage}
          redirectSecond="/service/supplier/add"
          hideAdd={false}
        >
          {isData.map((items, key) => {
            const colCount = 9;
            return (
              <div
                className="grid border-t border-stroke py-4.5 px-4 dark:border-strokedark md:px-6 2xl:px-7.5"
                style={{
                  gridTemplateColumns: `repeat(${colCount}, minmax(0, 1fr))`,
                }}
                key={key}
              >
                <div className="col-span-1 hidden items-center sm:flex">
                  <p className="text-sm text-black dark:text-white">
                    {items?.service?.provider?.name}
                  </p>
                </div>
                <div className="col-span-1 hidden items-center sm:flex">
                  <p className="text-sm text-black dark:text-white">
                    {items?.date}
                  </p>
                </div>
                <div className="col-span-1 hidden items-center sm:flex">
                  <p className="text-sm text-black dark:text-white">
                    {items?.time}
                  </p>
                </div>
                <div className="col-span-1 hidden items-center sm:flex">
                  <p className="text-sm text-black dark:text-white">
                    {items?.user?.fullname}
                  </p>
                </div>
                <div className="col-span-1 hidden items-center sm:flex">
                  <p className="text-sm text-black dark:text-white">
                    {items?.totalAmount}
                  </p>
                </div>
                <div className="col-span-1 hidden items-center sm:flex">
                  <p className="text-sm text-black dark:text-white">
                    {items?.advanceAmount}
                  </p>
                </div>
                <div className="col-span-1 hidden items-center sm:flex">
                  <p className="text-sm text-black dark:text-white">
                    {items?.isAccept === '0' && 'Upcoming'}
                  </p>
                </div>
                <div className="col-span-1 hidden items-center sm:flex">
                  <p className="text-sm text-black dark:text-white">
                    {convertDate(items?.createdAt)}
                  </p>
                </div>
                <div className="col-span-1 flex items-center">
                  <FaEye
                    onClick={() => {
                      navigate('/details', {
                        state: items,
                      });
                    }}
                    size={18}
                    className="text-primary mr-3 cursor-pointer"
                  />
                </div>
              </div>
            );
          })}
        </TableTwo>
      </div>
    </DefaultLayout>
  );
};

export default Cancelled;
