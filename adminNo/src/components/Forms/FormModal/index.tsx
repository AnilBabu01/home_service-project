import { ReactNode, Dispatch, SetStateAction } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import CommonButton from '../Common/CommonButton';
import { FaTimesCircle } from 'react-icons/fa';

type CategoryModalProps = {
  title?: string;
  isModalOpen?: boolean;
  isLoading?: boolean;
  setIsModalOpen?: Dispatch<SetStateAction<boolean>>;
  onSubmit?: () => void;
  children?: ReactNode;
  width?: string; 
};

const CategoryModal: React.FC<CategoryModalProps> = ({
  title = 'Add',
  onSubmit,
  isModalOpen,
  setIsModalOpen,
  children,
  isLoading,
  width = 'max-w-lg',
}) => {
  const handleSubmit = () => {
    if (onSubmit) {
      onSubmit();
    }
  };

  return (
    <div>
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className={`relative mt-8 flex flex-col gap-6 max-h-[80vh] w-full ${width} overflow-y-auto bg-white rounded-md border border-stroke dark:bg-boxdark dark:border-strokedark shadow-lg p-6`}
            >
              <button
                onClick={() => setIsModalOpen && setIsModalOpen(false)}
                className="absolute top-4 right-4 p-2 rounded-full bg-gray-100 hover:bg-gray-200"
              >
                <FaTimesCircle className="text-primary" />
              </button>

              <div className="border-b border-stroke py-4 px-6">
                <h3 className="font-medium text-black">{title}</h3>
              </div>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSubmit();
                }}
              >
                <div className="p-6 pt-0">
                  {children}
                  <div className="mt-5">
                    <CommonButton
                      label="Submit"
                      Type="submit"
                      isLoading={isLoading}
                    />
                  </div>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CategoryModal;
