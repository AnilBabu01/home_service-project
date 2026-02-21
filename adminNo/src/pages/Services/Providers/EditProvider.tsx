import { useState, useEffect } from 'react';
import Breadcrumb from '../../../components/Breadcrumbs/Breadcrumb';
import DefaultLayout from '../../../layout/DefaultLayout';
import { ServiceCategoryType } from '../../../types/DefinedTypes';
import {
  useGetServiceCategoryQuery,
  useEditProviderMutation,
} from '../../../redux/api';
import InputField from '../../../components/Forms/Common/InputField';
import CommonButton from '../../../components/Forms/Common/CommonButton';
import { useNavigate, useLocation } from 'react-router-dom';
import { InputType } from '../../../types/DefinedTypes';
import { FaTimesCircle, } from 'react-icons/fa';

const EditProvider = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const supplierData = location.state;

  const { data: isCategory } = useGetServiceCategoryQuery({
    page: 1,
    limit: 10000,
  });

  const [editService, { isLoading, isSuccess: isEditSuccess }] =
  useEditProviderMutation();

  const [categories, setCategories] = useState<ServiceCategoryType[]>([]);
  const [name, setName] = useState<string>('');
  const [serviceId, setserviceId] = useState<string>();
  const [categoryId, setcategoryId] = useState<number>();
  const [provider_id, setprovider_id] = useState<string>();
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [providerName, setproviderName] = useState('');
  const [providerExperience, setproviderExperience] = useState('');
  const [address, setaddress] = useState('');
  const [providerEmail, setproviderEmail] = useState('');

  const [hoursPrice, sethoursPrice] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    setFile(selectedFile);

    if (selectedFile) {
      const objectURL = URL.createObjectURL(selectedFile);
      setPreview(objectURL);
    } else {
      setPreview(null);
    }
  };

  const [numberingKeys, setNumberingKeys] = useState<InputType[]>([
    { keyName: '', amount: '', onDiscount: '' },
  ]);

  // Handle Input Changes
  const handleInputChange = (index: number, field: string, value: string) => {
    setNumberingKeys((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [field]: value } : item)),
    );
  };

  // Add New Input type
  const addNewInputType = () => {
    setNumberingKeys((prev) => [
      ...prev,
      {
        keyName: '',
        amount: '',
        onDiscount: '',
      },
    ]);
  };

  // Remove Input type
  const removeInputType = (index: number) => {
    setNumberingKeys((prev) => prev.filter((_, i) => i !== index));
  };

  const handleAdd = () => {
    const formData = new FormData();

    formData.append('name', name);
    // if (amount) formData.append('amount', amount);
    if (providerName) formData.append('providerName', providerName);
    if (providerExperience)
      formData.append('providerExperience', providerExperience);
    if (address) formData.append('address', address);
    if (providerEmail) formData.append('providerEmail', providerEmail);

    if (hoursPrice) formData.append('hoursPrice', hoursPrice);
    if (provider_id) formData.append('provider_id', provider_id);
    formData.append('numberingKeys', JSON.stringify(numberingKeys));
    if (categoryId) formData.append('category_id', categoryId.toString());

    if (file) formData.append('image', file);
    if (serviceId) {
      editService({ serviceId: serviceId, formData });
    }
  };

  useEffect(() => {
    if (isEditSuccess) {
      navigate('/service/provider');
    }
    if (isCategory && Array.isArray(isCategory.data)) {
      setCategories(isCategory.data);
    }
    if (supplierData) {
      setName(supplierData?.name);
      setproviderEmail(supplierData?.provider?.email);
      setproviderExperience(supplierData?.provider?.experience);
      setproviderName(supplierData?.provider?.name);
      setaddress(supplierData?.address);

      sethoursPrice(supplierData?.hoursPrice);
      setcategoryId(Number(supplierData?.category_id));
      setserviceId(supplierData?.id);
      setprovider_id(supplierData?.provider_id);
      setNumberingKeys(supplierData?.provider?.providerNumbering);
      setPreview(supplierData?.image);
    }
  }, [, isEditSuccess, isCategory, supplierData]);

  console.log(
    'supplierData?.category_id',
    supplierData?.provider?.providerNumbering,
  );

  return (
    <DefaultLayout>
      <Breadcrumb pageName="Provider" />
      <div className="flex flex-col gap-10">
        <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="py-6 px-4 md:px-6 xl:px-7.5">
            <h4 className="text-xl font-semibold text-black dark:text-white mb-4">
              Edit Provider
            </h4>
            <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
              <InputField
                type="text"
                label="Service name"
                placeholder="Enter service name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required={true}
                disabled={true}
              />
              <InputField
                type="number"
                label="Hours Price"
                placeholder="Enter Hours Price"
                value={hoursPrice}
                onChange={(e) => sethoursPrice(e.target.value)}
                required={true}
              />

              <InputField
                type="text"
                label="Provider name"
                placeholder="Enter Provider name"
                value={providerName}
                onChange={(e) => setproviderName(e.target.value)}
                required={true}
              />
            </div>

            {numberingKeys?.map((item: InputType, index: number) => (
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
                    handleInputChange(index, 'keyName', e.target.value)
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
                    handleInputChange(index, 'amount', e.target.value)
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
                    handleInputChange(index, 'onDiscount', e.target.value)
                  }
                />

                {index > 0 && (
                  <button
                    className="absolute right-0 top-4"
                    onClick={(e) => {
                      e.preventDefault();
                      removeInputType(index);
                    }}
                  >
                    <FaTimesCircle className="text-primary" />
                  </button>
                )}
              </div>
            ))}
            <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
              <InputField
                type="number"
                label="Provider experience"
                placeholder="Enter Provider experience"
                value={providerExperience}
                onChange={(e) => setproviderExperience(e.target.value)}
                required={true}
              />
              <InputField
                type="text"
                label="Provider email"
                placeholder="Enter Provider email"
                value={providerEmail}
                onChange={(e) => setproviderEmail(e.target.value)}
                required={true}
              />
              <InputField
                type="text"
                label="Provider address"
                placeholder="Enter Provider address"
                value={address}
                onChange={(e) => setaddress(e.target.value)}
                required={true}
              />
            </div>

            <CommonButton
              label={'Submit'}
              onClick={() => handleAdd()}
              isLoading={isLoading}
              width="w-full"
            />
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default EditProvider;
