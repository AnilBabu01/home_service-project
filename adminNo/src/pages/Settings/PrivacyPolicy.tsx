import { useState, useEffect } from 'react';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import DefaultLayout from '../../layout/DefaultLayout';
import { useEditSettingMutation, useGetSettingQuery } from '../../redux/api';
import TextEditor from '../../components/Forms/Common/TextEditor';
import CommonButton from '../../components/Forms/Common/CommonButton';
const PrivacyPolicy = () => {
  const { data } = useGetSettingQuery();
  const [editSetting, { isLoading, isSuccess: isEditSuccess }] =
    useEditSettingMutation();
  const [settingId, setsettingId] = useState<string>();
  const [privacyPolicy, setprivacyPolicy] = useState<string>('');

  const handleUpdate = () => {
    const formData = {
      privacyPolicy: privacyPolicy,
    };
    if (settingId) {
      editSetting({ settingId, formData });
    }
  };

  useEffect(() => {
    if (isEditSuccess) {
    }
    if (data) {
      setprivacyPolicy(data?.data[0].privacyPolicy);
      setsettingId(data?.data[0]?.id.toString());
    }
  }, [isEditSuccess, data]);

  console.log('data handleAdd', data?.data[0]?.id);

  return (
    <DefaultLayout>
      <Breadcrumb pageName="Privacy policy" />
      <div className="flex flex-col gap-10">
        <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="py-6 px-4 md:px-6 xl:px-7.5">
            <h4 className="text-xl font-semibold text-black dark:text-white mb-4">
              Add privacy policy
            </h4>
            <div className="mb-4">
              <TextEditor
                blogHtml={privacyPolicy}
                setBlogHtml={setprivacyPolicy}
              />
            </div>
            <CommonButton
              label={'Submit'}
              onClick={() => handleUpdate()}
              isLoading={isLoading}
              width="w-full"
            />
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default PrivacyPolicy;
