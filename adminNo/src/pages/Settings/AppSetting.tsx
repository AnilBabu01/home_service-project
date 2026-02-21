import { useState, useEffect } from 'react';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import DefaultLayout from '../../layout/DefaultLayout';
import { useEditSettingMutation, useGetSettingQuery } from '../../redux/api';
import InputField from '../../components/Forms/Common/InputField';
import CommonButton from '../../components/Forms/Common/CommonButton';

const AppSetting = () => {
  const { data } = useGetSettingQuery();
  const [editSetting, { isLoading, isSuccess: isEditSuccess }] =
    useEditSettingMutation();
  const [settingId, setsettingId] = useState<string>();
  const [customerServices, setcustomerServices] = useState<string>('');
  const [whatsapp, setwhatsapp] = useState<string>('');
  const [Website, setWebsite] = useState<string>('');
  const [facebook, setfacebook] = useState<string>('');
  const [twitter, settwitter] = useState<string>('');
  const [instagram, setinstagram] = useState<string>('');
  const [advanceAmount, setadvanceAmount] = useState<any>('');

  const handleUpdate = () => {
    const formData = {
      // customerServices: customerServices,
      whatsapp: whatsapp,
      Website: Website,
      facebook: facebook,
      twitter: twitter,
      instagram: instagram,
      advanceAmountPercentage: Number(advanceAmount),
    };
    if (settingId) {
      editSetting({ settingId, formData });
    }
  };

  useEffect(() => {
    if (isEditSuccess) {
    }
    if (data) {
      setcustomerServices(data?.data[0].customerServices);
      setwhatsapp(data?.data[0].whatsapp);
      setWebsite(data?.data[0].Website);
      setfacebook(data?.data[0].facebook);
      settwitter(data?.data[0].twitter);
      setinstagram(data?.data[0].instagram);
      setadvanceAmount(data?.data[0].advanceAmountPercentage);

      setsettingId(data?.data[0]?.id.toString());
    }
  }, [isEditSuccess, data]);

  console.log('data handleAdd', data?.data[0]?.id);

  return (
    <DefaultLayout>
      <Breadcrumb pageName="App Setting" />
      <div className="flex flex-col gap-10">
        <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="py-6 px-4 md:px-6 xl:px-7.5">
            <h4 className="text-xl font-semibold text-black dark:text-white mb-4">
              Add app settting
            </h4>
            <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
              <InputField
                type="text"
                label="Mobile no"
                placeholder="Enter mobile no"
                value={customerServices}
                onChange={(e) => setcustomerServices(e.target.value)}
                required={true}
              />
              <InputField
                type="text"
                label="Whatsaap no"
                placeholder="Enter Whatsaap no"
                value={whatsapp}
                onChange={(e) => setwhatsapp(e.target.value)}
                required={true}
              />
              <InputField
                type="text"
                label="Website"
                placeholder="Enter website link"
                value={Website}
                onChange={(e) => setWebsite(e.target.value)}
                required={true}
              />
            </div>

            <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
              <InputField
                type="text"
                label="Facebook"
                placeholder="Enter facebook link"
                value={facebook}
                onChange={(e) => setfacebook(e.target.value)}
                required={true}
              />
              <InputField
                type="text"
                label="Twitter"
                placeholder="Enter twitter link"
                value={twitter}
                onChange={(e) => settwitter(e.target.value)}
                required={true}
              />
              <InputField
                type="text"
                label="Instagram"
                placeholder="Enter instagram link"
                value={instagram}
                onChange={(e) => setinstagram(e.target.value)}
                required={true}
              />
            </div>

            <div className="mb-4.5 flex flex-col gap-2 xl:flex-row">
              <InputField
                type="text"
                label="Advance amount in percentage"
                placeholder="Enter fAdvance amount in percentage"
                value={advanceAmount}
                onChange={(e) => setadvanceAmount(e.target.value)}
                required={true}
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

export default AppSetting;
