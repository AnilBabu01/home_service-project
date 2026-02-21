import { useState, useEffect } from 'react';
import Breadcrumb from '../../../components/Breadcrumbs/Breadcrumb';
import DefaultLayout from '../../../layout/DefaultLayout';
import { InputType } from '../../../types/DefinedTypes';
import { useAddsServiceCategoryMutation } from '../../../redux/api';
import InputField from '../../../components/Forms/Common/InputField';
import SelectField from '../../../components/Forms/Common/SelectField';
import SelectGroupOne from '../../../components/Forms/SelectGroup/SelectGroupOne';
import { FaTimesCircle, FaPlus } from 'react-icons/fa';
import CommonButton from '../../../components/Forms/Common/CommonButton';
import { useNavigate } from 'react-router-dom';

const inputTypes = [
  { value: 'contextual', label: 'Contextual' },
  { value: 'numbering', label: 'Numbering' },
];

const AddCategory = () => {
  const navigate = useNavigate();
  const [addCategory, { isLoading, isSuccess: isAddSuccess }] =
    useAddsServiceCategoryMutation();

  const [name, setName] = useState<string>('');
  const [inputType, setInputType] = useState<string>('contextual');

  const [numberingKeys, setNumberingKeys] = useState<InputType[]>([
    { keyName: '' },
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
      },
    ]);
  };

  // Remove Input type
  const removeInputType = (index: number) => {
    setNumberingKeys((prev) => prev.filter((_, i) => i !== index));
  };

  const [bgColor, setBgColor] = useState('#ffff');

  const [file, setFile] = useState<File | null>(null);

  const handleAdd = () => {
    const formData = new FormData();

    formData.append('name', name);
    // formData.append(
    //   'numberingKeys',
    //   inputType === 'contextual' ? 'empty' : JSON.stringify(numberingKeys),
    // );

    // formData.append('inputType', inputType);
    formData.append('bgColor', bgColor);
    if (file) {
      formData.append('icon', file);
    }

    addCategory(formData);
  };

  useEffect(() => {
    if (isAddSuccess) {
      navigate('/master/category');
    }
  }, [isAddSuccess]);

  return (
    <DefaultLayout>
      <Breadcrumb pageName="Category" />
      <div className="flex flex-col gap-10">
        <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="py-6 px-4 md:px-6 xl:px-7.5">
            <h4 className="text-xl font-semibold text-black dark:text-white mb-4">
              Add service category
            </h4>
            <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
              <InputField
                type="text"
                label="Name"
                placeholder="Enter category name"
                value={name}
                required={true}
                onChange={(e) => setName(e.target.value)}
              />
              {/* <SelectGroupOne
                label="Select input type"
                options={inputTypes.map((item) => ({
                  value: item.value,
                  label: item.label,
                }))}
                defaultValue={inputType}
                onChange={(value) => setInputType(value as string)}
                isLabel={true}
              /> */}
              <InputField
                type="color"
                label="Backgroud color"
                placeholder="Enter backgroud color"
                value={bgColor}
                required={true}
                defaultValue="white"
                onChange={(e) => setBgColor(e.target.value)}
              />
            </div>

            {inputType === 'numbering' && (
              <>
                {numberingKeys?.map((item: InputType, index: number) => {
                  return (
                    <div
                      key={index}
                      className="mb-4.5 flex flex-col gap-6 xl:flex-row"
                    >
                      <InputField
                        type="text"
                        label="input name"
                        placeholder="Enter name name"
                        value={item.keyName ?? ''}
                        required={true}
                        onChange={(e) =>
                          handleInputChange(index, 'keyName', e.target.value)
                        }
                      />

                      {index > 0 && (
                        <button
                          className="absolute left-[91%]"
                          onClick={(e) => {
                            e.preventDefault();
                            removeInputType(index);
                          }}
                        >
                          <FaTimesCircle className="text-primary" />
                        </button>
                      )}
                    </div>
                  );
                })}

                <button
                  onClick={(e) => {
                    e.preventDefault();
                    addNewInputType();
                  }}
                >
                  <FaPlus />
                </button>
              </>
            )}

            <SelectField
              type="file"
              label="Icon"
              accept="image/png, image/jpeg"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
            />
            <div className="mt-4">
              <CommonButton
                label={'Submit'}
                onClick={() => handleAdd()}
                isLoading={isLoading}
                width="w-full"
              />
            </div>
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default AddCategory;
