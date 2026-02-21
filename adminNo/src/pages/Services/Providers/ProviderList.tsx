import { useState, useEffect } from 'react';
import Breadcrumb from '../../../components/Breadcrumbs/Breadcrumb';
import TableTwo from '../../../components/Tables/TableTwo';
import DefaultLayout from '../../../layout/DefaultLayout';
import FormModal from '../../../components/Forms/FormModal';
import { ServiceType, ServiceCategoryType } from '../../../types/DefinedTypes';
import {
  useGetServiceCategoryQuery,
  useGetProviderListQuery,
  useAddsServiceMutation,
  useEditServiceMutation,
  useDeleteServiceMutation,
  useBlockServiceMutation,
} from '../../../redux/api';
import { FaEdit } from 'react-icons/fa';
// import SwitcherThree from '../../../components/Switchers/SwitcherThree';
import InputField from '../../../components/Forms/Common/InputField';
import SelectField from '../../../components/Forms/Common/SelectField';
import SelectGroupOne from '../../../components/Forms/SelectGroup/SelectGroupOne';
import ConfirmationDialog from '../../../components/Forms/Common/ConfirmationDialog';
import { useNavigate } from 'react-router-dom';

const labels = [
  { name: 'Profile' },
  { name: 'Name' },
  { name: 'Email' },
  { name: 'Mobile No' },
  // { name: 'Status' },
  { name: 'Action' },
];

const ProviderList = () => {
  const navigate = useNavigate();
  const { data: isCategory } = useGetServiceCategoryQuery({
    page: 1,
    limit: 10000,
  });
  const [addService, { isLoading, isSuccess: isAddSuccess }] =
    useAddsServiceMutation();
  const [editService, { isLoading: isEditing, isSuccess: isEditSuccess }] =
    useEditServiceMutation();
  const [deleteService, { isSuccess }] = useDeleteServiceMutation();
  const [blockService] = useBlockServiceMutation();
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [isData, setisData] = useState<ServiceType[]>([]);
  const [categories, setCategories] = useState<ServiceCategoryType[]>([]);
  const [name, setName] = useState<string>('');
  const [amount, setamount] = useState<string>('');
  const [serviceId, setserviceId] = useState<string>();
  const [categoryId, setcategoryId] = useState<string>();
  const [file, setFile] = useState<File | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(10);

  const { data } = useGetProviderListQuery({
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
    const formData = new FormData();

    formData.append('name', name);
    if (amount) formData.append('amount', amount);

    if (categoryId) formData.append('categoryId', categoryId);

    if (file) formData.append('image', file);

    if (serviceId) {
      editService({ serviceId: serviceId, formData });
    } else {
      addService(formData);
    }
  };

  const handleDelete = () => {
    deleteService({ serviceId: serviceId });
  };

  const handleStatusChange = (serviceId: number, newStatus: boolean) => {
    setisData((prevData) =>
      prevData.map((item) =>
        item.id === serviceId ? { ...item, block: newStatus } : item,
      ),
    );
    blockService({ serviceId: serviceId.toString() });
  };

  useEffect(() => {
    if (isSuccess) {
      setIsDialogOpen(false);
    }
    if (isAddSuccess) {
      setName('');
      setcategoryId('');
      setFile(null);
      setIsAddModalOpen(false);
    }
    if (isEditSuccess) {
      setName('');
      setcategoryId('');
      setFile(null);
      setserviceId('');
      setIsAddModalOpen(false);
    }
    if (isCategory && Array.isArray(isCategory.data)) {
      setCategories(isCategory.data);
    }
  }, [isSuccess, isAddSuccess, isEditSuccess, isCategory]);

  return (
    <DefaultLayout>
      <Breadcrumb pageName="Provider List" />
      <div className="flex flex-col gap-10">
        <TableTwo
          title={'Provider List'}
          setIsModalOpen={setIsAddModalOpen}
          labels={labels}
          totalItems={data?.pagination?.totalItems}
          handleGetData={handleGetData}
          handlePerPage={handlePerPage}
          currentPage={currentPage}
          itemsPerPage={itemsPerPage}
          redirectSecond="/service/provider/edit"
          hideAdd={false}
        >
          {isData.map((items, key) => {
            const colCount = 5;
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
                      <img src={`${items.provider?.profile}`} alt="Product" />
                    </div>
                  </div>
                </div>
                <div className="col-span-1 hidden items-center sm:flex">
                  <p className="text-sm text-black dark:text-white">
                    {items?.provider?.name}
                  </p>
                </div>
                <div className="col-span-1 hidden items-center sm:flex">
                  <p className="text-sm text-black dark:text-white">
                    {items?.provider?.email}
                  </p>
                </div>
                <div className="col-span-1 hidden items-center sm:flex">
                  <p className="text-sm text-black dark:text-white">
                  {items?.provider?.mobile_no}
                  </p>
                </div>
                {/* <div
                  onClick={() => console.log('Clicked item:', items)}
                  className="col-span-1 flex items-center"
                >
                  <SwitcherThree
                    categoryId={items.id}
                    status={items.block}
                    onToggle={handleStatusChange}
                  />
                </div> */}
                <div className="col-span-1 flex items-center">
                  <FaEdit
                    onClick={() => {
                      navigate('/service/provider/edit', {
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
      <FormModal
        onSubmit={handleAdd}
        isModalOpen={isAddModalOpen}
        setIsModalOpen={setIsAddModalOpen}
        isLoading={isLoading ? isLoading : isEditing}
        title={`${serviceId ? 'Edit service' : 'Add service'}`}
      >
        <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
          <SelectGroupOne
            label="Select a category"
            options={categories.map((value) => ({
              value: value.id,
              label: value.name,
            }))}
            defaultValue={categoryId}
            onChange={(value) => {
              setcategoryId(value.toString());
            }}
            isLabel={true}
          />
          <InputField
            type="text"
            label="Name"
            placeholder="Enter service name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required={true}
          />
        </div>

        <div className="mb-4.5">
          <InputField
            type="number"
            label="Amount"
            placeholder="Enter service amount"
            value={amount}
            onChange={(e) => setamount(e.target.value)}
            required={true}
          />
        </div>
        <SelectField
          type="file"
          label="Image"
          accept="image/png, image/jpeg"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
        />
      </FormModal>
      <ConfirmationDialog
        isOpen={isDialogOpen}
        title="Delete Service"
        message="Are you sure you want to delete this service?"
        onConfirm={() => handleDelete()}
        onCancel={() => setIsDialogOpen(false)}
      />
    </DefaultLayout>
  );
};

export default ProviderList;
