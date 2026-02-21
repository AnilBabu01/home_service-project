import { useState, useEffect } from 'react';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import DefaultLayout from '../../layout/DefaultLayout';
import { useSendNotificationMutation } from '../../redux/api';
import TextArea from '../../components/Forms/Common/TextArea';
import SelectGroupOne from '../../components/Forms/SelectGroup/SelectGroupOne';
import CommonButton from '../../components/Forms/Common/CommonButton';
import InputField from '../../components/Forms/Common/InputField';
import SelectField from '../../components/Forms/Common/SelectField';

const sendTo = [
  {
    value: 'all',
    label: 'All',
  },
  {
    value: 'user',
    label: 'All user',
  },
  {
    value: 'provider',
    label: 'All provider',
  },
];

const Notification = () => {
  const [sendNotification, { isLoading, isSuccess }] =
    useSendNotificationMutation();
  const [title, settitle] = useState<string>('');
  const [message, setMessage] = useState('');
  const [type, setType] = useState<string>('');
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

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

  const handleSendNotification = async () => {
    try {
      const formData = new FormData();

      if (message) formData.append('message', message);
      if (title) formData.append('title', title);
      if (type) formData.append('type', type);
      if (file) formData.append('image', file);

      await sendNotification(formData).unwrap();

      console.log('Notification sent successfully');
    } catch (error) {
      console.error('Failed to send notification:', error);
    }
  };

  useEffect(() => {
    if (isSuccess) {
      // setMessage('');
      // setType('');
    }
  }, [isSuccess]);

  console.log('dd', type);

  return (
    <DefaultLayout>
      <Breadcrumb pageName="Notification" />
      <div className="flex flex-col gap-10">
        <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="py-6 px-4 md:px-6 xl:px-7.5">
            <h4 className="text-xl font-semibold text-black dark:text-white mb-4">
              Send Notification
            </h4>
            <div className="mb-4.5">
              <SelectGroupOne
                label="Send to"
                options={sendTo?.map((value) => ({
                  value: value.value,
                  label: value.label,
                }))}
                defaultValue={type}
                onChange={(value) => setType(String(value))}
                isLabel={true}
              />
            </div>
            <div className="mb-4.5">
              <InputField
                type="text"
                label="Title"
                placeholder="Enter title"
                value={title}
                onChange={(e) => settitle(e.target.value)}
                required={true}
              />
            </div>
            <div className="mb-4.5">
              <TextArea
                rows={5}
                label="Message"
                placeholder="Enter Message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required={true}
              />
            </div>

            <div className="mb-4.5">
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
                    className="w-25 h-25 object-cover  rounded-md"
                  />
                </div>
              )}
            </div>
            <CommonButton
              label={'Submit'}
              onClick={() => handleSendNotification()}
              width="w-full"
              isLoading={isLoading}
            />
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default Notification;
