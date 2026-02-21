import { useState, useEffect } from 'react';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import TableTwo from '../../components/Tables/TableTwo';
import DefaultLayout from '../../layout/DefaultLayout';
import {
  useBlockServiceCategoryMutation,
  useGetSliderQuery,
  useDeleteSliderMutation,

} from '../../redux/api';
import { FaEdit, FaTrash } from 'react-icons/fa';
import SwitcherThree from '../../components/Switchers/SwitcherThree';
import ConfirmationDialog from '../../components/Forms/Common/ConfirmationDialog';
import { useNavigate } from 'react-router-dom';

const labels = [
  { name: 'Icon' },
  { name: 'Title' },
  { name: 'Status' },
  { name: 'Action' },
];

const Slider = () => {
  const navigate = useNavigate();
  const [deleteCategory, { isSuccess }] = useDeleteSliderMutation();
  const [blockCategory] = useBlockServiceCategoryMutation();
  const [isData, setisData] = useState<any[]>([]);
  const [categoryId, setcategoryId] = useState<string>();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(10);

  const { data } = useGetSliderQuery({
    page: currentPage,
    limit: itemsPerPage,
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

  const handleDelete = () => {
    deleteCategory({ categoryId: categoryId });
  };

  const handleStatusChange = (categoryId: number, newStatus: boolean) => {
    setisData((prevData) =>
      prevData.map((item) =>
        item.id === categoryId ? { ...item, block: newStatus } : item,
      ),
    );
    blockCategory({ categoryId: categoryId.toString() });
  };

  useEffect(() => {
    if (isSuccess) {
      setIsDialogOpen(false);
    }
  }, [isSuccess]);

  return (
    <DefaultLayout>
      <Breadcrumb pageName="Slider" />
      <div className="flex flex-col gap-10">
        <TableTwo
          title={'Slider list'}
          labels={labels}
          totalItems={data?.pagination?.totalItems}
          handleGetData={handleGetData}
          handlePerPage={handlePerPage}
          currentPage={currentPage}
          itemsPerPage={itemsPerPage}
          redirectSecond="/slider/add"
          hideAdd={true}
        >
          {isData.map((items, key) => {
            const colCount = 4;

            return (
              <div
                className="grid border-t border-stroke py-4.5 px-4 dark:border-strokedark md:px-6 2xl:px-7.5"
                style={{
                  gridTemplateColumns: `repeat(${colCount}, minmax(0, 1fr))`,
                }}
                key={key}
              >
                <div className="col-span-1 flex items-center">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                    <div className="h-12.5 w-15 rounded-md">
                      <img src={`${items.image}`} alt="Product" />
                    </div>
                  </div>
                </div>
                <div className="col-span-1 hidden items-center sm:flex">
                  <p className="text-sm text-black dark:text-white">
                    {items.title}
                  </p>
                </div>

                <div
                  onClick={() => console.log('Clicked item:', items)}
                  className="col-span-1 flex items-center"
                >
                  <SwitcherThree
                    categoryId={items.id}
                    status={items.block}
                    onToggle={handleStatusChange}
                  />
                </div>
                <div className="col-span-1 flex items-center">
                  <FaEdit
                    onClick={() => {
                      navigate('/slider/edit', {
                        state: items,
                      });
                    }}
                    size={18}
                    className="text-primary mr-3 cursor-pointer"
                  />
                  <FaTrash
                    onClick={() => {
                      setIsDialogOpen(true);
                      setcategoryId(items.id.toString());
                    }}
                    size={18}
                    className="text-danger cursor-pointer"
                  />
                </div>
              </div>
            );
          })}
        </TableTwo>
      </div>

      <ConfirmationDialog
        isOpen={isDialogOpen}
        title="Delete Slider"
        message="Are you sure you want to delete this slider?"
        onConfirm={() => handleDelete()}
        onCancel={() => setIsDialogOpen(false)}
      />
    </DefaultLayout>
  );
};

export default Slider;
