import { useState, useEffect } from 'react';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import TableTwo from '../../components/Tables/TableTwo';
import DefaultLayout from '../../layout/DefaultLayout';
import FormModal from '../../components/Forms/FormModal';
import { FaqCategoryType } from '../../types/DefinedTypes';
import {
  useGetFaqCategoryQuery,
  useAddsFaqCategoryMutation,
  useBlockFaqCategoryMutation,
  useDeleteFaqCategoryMutation,
  useEditFaqCategoryMutation,
} from '../../redux/api';
import { FaEdit, FaTrash } from 'react-icons/fa';
import SwitcherThree from '../../components/Switchers/SwitcherThree';
import InputField from '../../components/Forms/Common/InputField';
import ConfirmationDialog from '../../components/Forms/Common/ConfirmationDialog';

const labels = [{ name: 'Name' }, { name: 'Status' }, { name: 'Action' }];

const FaqCategory = () => {
  const [addCategory, { isLoading, isSuccess: isAddSuccess }] =
    useAddsFaqCategoryMutation();
  const [editCategory, { isLoading: isEditing, isSuccess: isEditSuccess }] =
    useEditFaqCategoryMutation();
  const [deleteCategory, { isSuccess }] = useDeleteFaqCategoryMutation();
  const [blockCategory] = useBlockFaqCategoryMutation();
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [isData, setisData] = useState<FaqCategoryType[]>([]);
  const [name, setName] = useState<string>('');
  const [categoryId, setcategoryId] = useState<string>();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(10);

  const { data } = useGetFaqCategoryQuery({
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

  

  const handleAdd = () => {
    const formData = {
      name: name,
    };

    if (categoryId) {
      editCategory({ categoryId: categoryId, formData });
    } else {
      addCategory(formData);
    }
  };

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
    if (isAddSuccess) {
      setName('');

      setIsAddModalOpen(false);
    }
    if (isEditSuccess) {
      setName('');

      setcategoryId('');
      setIsAddModalOpen(false);
    }
  }, [isSuccess, isAddSuccess, isEditSuccess]);

  return (
    <DefaultLayout>
      <Breadcrumb pageName="Category" />
      <div className="flex flex-col gap-10">
        <TableTwo
          title={'Categories'}
          setIsModalOpen={setIsAddModalOpen}
          labels={labels}
          totalItems={data?.pagination?.totalItems}
          handleGetData={handleGetData}
          handlePerPage={handlePerPage}
          currentPage={currentPage}
          itemsPerPage={itemsPerPage}
          hideAdd={true}
        >
          {isData.map((items, key) => {
            const colCount = Object.keys(items).length - 2;

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
                    {items.name}
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
                      setIsAddModalOpen(true);
                      setName(items.name);
                      setcategoryId(items.id.toString());
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
      <FormModal
        onSubmit={handleAdd}
        isModalOpen={isAddModalOpen}
        setIsModalOpen={setIsAddModalOpen}
        isLoading={isLoading ? isLoading : isEditing}
        title={`${categoryId ? 'Edit category' : 'Add category'}`}
      >
        <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
          <InputField
            type="text"
            label="Name"
            placeholder="Enter category name"
            value={name}
            required={true}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
      </FormModal>
      <ConfirmationDialog
        isOpen={isDialogOpen}
        title="Delete Category"
        message="Are you sure you want to delete this category?"
        onConfirm={() => handleDelete()}
        onCancel={() => setIsDialogOpen(false)}
      />
    </DefaultLayout>
  );
};

export default FaqCategory;
