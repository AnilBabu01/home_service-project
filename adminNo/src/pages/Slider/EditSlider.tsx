import { useState, useEffect } from 'react';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import DefaultLayout from '../../layout/DefaultLayout';
import {useEditSliderMutation } from '../../redux/api';
import InputField from '../../components/Forms/Common/InputField';
import SelectField from '../../components/Forms/Common/SelectField';
import CommonButton from '../../components/Forms/Common/CommonButton';
import { useNavigate, useLocation } from 'react-router-dom';

const EditSlider = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const categoryData = location.state;
  const [editCategory, { isLoading: isEditing, isSuccess: isEditSuccess }] =
  useEditSliderMutation();
  const [title, settitle] = useState('');
  const [preview, setPreview] = useState<string | null>(null);
  const [categoryId, setcategoryId] = useState<string>();
  const [file, setFile] = useState<File | null>(null);


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


  const handleAdd = () => {
    const formData = new FormData();
    formData.append('title', title);
    if (file) {
      formData.append('image', file);
    }

    if (categoryId) {
      editCategory({ categoryId: categoryId, formData });
    }
  };

  useEffect(() => {
    if (isEditSuccess) {
      navigate('/slider');
    }

    if (categoryData) {
      settitle(categoryData?.title);
      setPreview(categoryData?.image)
      setcategoryId(categoryData?.id)
    }
  }, [isEditSuccess, categoryData]);

  return (
    <DefaultLayout>
      <Breadcrumb pageName="Slider" />
      <div className="flex flex-col gap-10">
        <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="py-6 px-4 md:px-6 xl:px-7.5">
            <h4 className="text-xl font-semibold text-black dark:text-white mb-4">
              Edit slider
            </h4>
            <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
              <InputField
                type="text"
                label="Title"
                placeholder="Enter title"
                value={title}
                required={true}
                onChange={(e) => settitle(e.target.value)}
              />
            </div>

           <div>
              <SelectField
                type="file"
                label="Image"
                accept="image/png, image/jpeg"
                onChange={handleFileChange}
              />

              {preview && (
                <div className="mt-4">
                  <img
                    src={preview}
                    alt="Selected Image"
                    className="w-25 h-25 object-cover rounded-md"
                  />
                </div>
              )}
            </div>
            <div className="mt-4">
              <CommonButton
                label={'Submit'}
                onClick={() => handleAdd()}
                isLoading={isEditing}
                width="w-full"
              />
            </div>
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default EditSlider;
