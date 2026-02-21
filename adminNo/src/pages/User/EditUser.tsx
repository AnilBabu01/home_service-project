import { useState, useEffect } from 'react';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import DefaultLayout from '../../layout/DefaultLayout';
import { useEditServiceMutation, useEditUserMutation } from '../../redux/api';
import InputField from '../../components/Forms/Common/InputField';
import CommonButton from '../../components/Forms/Common/CommonButton';
import { useNavigate, useLocation } from 'react-router-dom';

const EditUser = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const supplierData = location.state;
  const [editService, { isLoading, isSuccess: isEditSuccess }] =
    useEditUserMutation();
  const [Id, setId] = useState<string>();
  const [fullname, setfullname] = useState('');
  const [nickname, setnickname] = useState('');

  const handleAdd = () => {
    const formData = {
      fullname: fullname,
      nickname: nickname,
    };

    if (Id) {
      editService({ id: Id, formData }); 
    }
};

  useEffect(() => {
    if (isEditSuccess) {
      navigate('/user');
    }

    if (supplierData) {
      setfullname(supplierData?.fullname);
      setnickname(supplierData?.nickname);
      setId(supplierData?.id);
    }
  }, [, isEditSuccess, supplierData]);

  return (
    <DefaultLayout>
      <Breadcrumb pageName="User" />
      <div className="flex flex-col gap-10">
        <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="py-6 px-4 md:px-6 xl:px-7.5">
            <h4 className="text-xl font-semibold text-black dark:text-white mb-4">
              Edit user
            </h4>
            <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
              <InputField
                type="text"
                label="fullname"
                placeholder="Enter fullname"
                value={fullname}
                onChange={(e) => setfullname(e.target.value)}
                required={true}
              />
              <InputField
                type="text"
                label="nickname"
                placeholder="Enter nickname"
                value={nickname}
                onChange={(e) => setnickname(e.target.value)}
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

export default EditUser;
