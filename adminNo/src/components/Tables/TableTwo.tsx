import { ReactNode, Dispatch, SetStateAction } from 'react';
import CommonButton from '../Forms/Common/CommonButton';
import SelectGroupTwo from '../Forms/SelectGroup/SelectGroupTwo';
import { useNavigate } from 'react-router-dom';
type Props = {
  title: string;
  showAddBtnOneMores?: string;
  redirectSecond?: string;
  labels2?: string;
  btnLabel?: string;
  totalItems?: number;
  handleGetData?: (newPage: number) => void;
  handlePerPage?: (newLimit: number) => void;
  setIsModalOpen?: Dispatch<SetStateAction<boolean>>;
  labels?: any;
  children?: ReactNode;
  currentPage: number;
  itemsPerPage: number;
  hideAdd?: boolean;
};

const TableTwo = ({
  title,
  setIsModalOpen,
  labels,
  totalItems,
  handleGetData,
  handlePerPage,
  currentPage,
  itemsPerPage,
  children,
  showAddBtnOneMores,
  redirectSecond,
  labels2,
  btnLabel = 'Add',
  hideAdd = false,
}: Props) => {
  const navigate = useNavigate();
  const totalPages = Math.ceil((totalItems ?? 0) / itemsPerPage);

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return;
    handleGetData && handleGetData(newPage);
  };

  const handleItemsPerPageChange = (newLimit: number) => {
    handlePerPage && handlePerPage(newLimit);
  };

  return (
    <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
      <div className="py-6 px-4 md:px-6 xl:px-7.5 flex items-center justify-between">
        <h4 className="text-xl font-semibold text-black dark:text-white">
          {title}
        </h4>
        <div className="flex items-center gap-6 w-[50%]">
          <SelectGroupTwo
            label="Items per Page"
            options={[10, 15, 20].map((value) => ({
              value: String(value),
              label: `${value} items per page`,
            }))}
            onChange={(value) => handleItemsPerPageChange(parseInt(value, 10))}
            isLabel={false}
          />
          {hideAdd ?(
            <CommonButton
              label={btnLabel}
              onClick={() => {
                if (redirectSecond) {
                  navigate(redirectSecond);
                } else {
                  setIsModalOpen && setIsModalOpen(true);
                }
              }}
              width="w-48"
            />
          ):<div className='w-48'/>}

          {showAddBtnOneMores && (
            <CommonButton
              label={labels2 ? labels2 : ''}
              onClick={() => navigate(showAddBtnOneMores)}
              width="w-[25rem]"
              border={true}
              borderColor={'border-primary'}
              textColor={'text-primary'}
            />
          )}
        </div>
      </div>

      <div
        className="grid border-t border-stroke py-4.5 px-4 dark:border-strokedark md:px-6 2xl:px-7.5"
        style={{
          gridTemplateColumns: `repeat(${labels?.length || 1}, minmax(0, 1fr))`,
        }}
      >
        {labels?.map((item: any, index: number) => (
          <div key={index} className="col-span-1">
            <p className="font-medium">{item?.name}</p>
          </div>
        ))}
      </div>

      {children}
      <div className="flex justify-between items-center p-4 border-t border-stroke dark:border-strokedark md:pl-[25rem] md:pr-[25rem]">
        <CommonButton
          label="Previous"
          onClick={() => handlePageChange(currentPage - 1)}
          border={currentPage === 1 ? false : true}
          borderColor={
            currentPage === 1 ? 'border-primary' : ' border-gray-200'
          }
          textColor={currentPage === 1 ? 'text-primary' : ' text-gray-400'}
          disabled={currentPage === 1}
          width="w-25"
          height="h-10"
        />

        <span className="text-sm text-black dark:text-white">
          Page {currentPage} of {totalPages}
        </span>

        <CommonButton
          label="Next"
          onClick={() => handlePageChange(currentPage + 1)}
          border={currentPage === totalPages ? false : true}
          borderColor={
            currentPage === totalPages ? 'border-primary' : ' border-gray-200'
          }
          textColor={
            currentPage === totalPages ? 'text-primary' : ' text-gray-400'
          }
          disabled={currentPage === totalPages}
          width="w-25"
          height="h-10"
        />
      </div>
    </div>
  );
};

export default TableTwo;
