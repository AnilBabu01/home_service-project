import { useState, useEffect } from 'react';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import TableTwo from '../../components/Tables/TableTwo';
import DefaultLayout from '../../layout/DefaultLayout';
import FormModal from '../../components/Forms/FormModal';
import { FaqType, FaqCategoryType } from '../../types/DefinedTypes';
import {
  useGetFaqQuery,
  useAddsFaqMutation,
  useDeleteFaqMutation,
  useEditFaqMutation,
  useBlockFaqMutation,
  useGetFaqCategoryQuery,
} from '../../redux/api';
import { FaEdit, FaTrash } from 'react-icons/fa';
import TextArea from '../../components/Forms/Common/TextArea';
import InputField from '../../components/Forms/Common/InputField';
import ConfirmationDialog from '../../components/Forms/Common/ConfirmationDialog';
import SelectGroupOne from '../../components/Forms/SelectGroup/SelectGroupOne';

const labels = [
  { name: 'Question' },
  { name: 'Answer' },
  { name: 'Category' },
  { name: 'Action' },
];

const Faq = () => {
  const { data: isCategory } = useGetFaqCategoryQuery({ page: 1, limit: 1000 });
  const [addService, { isLoading, isSuccess: isAddSuccess }] =
    useAddsFaqMutation();
  const [editService, { isLoading: isEditing, isSuccess: isEditSuccess }] =
    useEditFaqMutation();
  const [deleteService, { isSuccess }] = useDeleteFaqMutation();
  const [blockService] = useBlockFaqMutation();
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [isData, setisData] = useState<FaqType[]>([]);
  const [categoryList, setcategoryList] = useState<FaqCategoryType[]>([]);
  const [categoryId, setcategoryId] = useState<string>();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [question, setQuestion] = useState('');
  const [faqId, setfaqId] = useState('');
  const [answer, setAnswer] = useState('');
  const [itemsPerPage, setItemsPerPage] = useState<number>(10);

  const { data } = useGetFaqQuery({
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
    if (isCategory) {
      setcategoryList(
        Array.isArray(isCategory?.data) ? isCategory?.data : [isCategory?.data],
      );
    }
  }, [data, isCategory]);

  const handleAdd = () => {
    const formData = {
      question: question,
      answer: answer,
      category_id: categoryId?.toString(),
    };
    if (faqId) {
      editService({ faqId: faqId, formData });
    } else {
      addService(formData);
    }
  };

  const handleDelete = () => {
    deleteService({ faqId: faqId });
  };



  useEffect(() => {
    if (isSuccess) {
      setIsDialogOpen(false);
    }
    if (isAddSuccess) {
      setQuestion('');
      setAnswer('');
      setIsAddModalOpen(false);
      setfaqId('');
    }
    if (isEditSuccess) {
      setQuestion('');
      setAnswer('');
      setIsAddModalOpen(false);
      setfaqId('');
    }
  }, [isSuccess, isAddSuccess, isEditSuccess]);

  return (
    <DefaultLayout>
      <Breadcrumb pageName="Faq" />
      <div className="flex flex-col gap-10">
        <TableTwo
          title={'Faq'}
          setIsModalOpen={setIsAddModalOpen}
          labels={labels}
          totalItems={data?.pagination?.totalItems}
          handleGetData={handleGetData}
          handlePerPage={handlePerPage}
          currentPage={currentPage}
          itemsPerPage={itemsPerPage}
          labels2={'Add Category'}
          showAddBtnOneMores='/setting/faqcategory/add'
          hideAdd={true}
        >
          {isData.map((items, key) => {
            const colCount = 4;
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
                    {items.question}
                  </p>
                </div>
                <div className="col-span-1 hidden items-center sm:flex">
                  <p className="text-sm text-black dark:text-white">
                    {items.answer}
                  </p>
                </div>
                <div className="col-span-1 hidden items-center sm:flex">
                  <p className="text-sm text-black dark:text-white">
                    {items.faqCategory.name}
                  </p>
                </div>

                <div className="col-span-1 flex items-center">
                  <FaEdit
                    onClick={() => {
                      setIsAddModalOpen(true);
                      setAnswer(items.answer);
                      setQuestion(items.question);
                      setfaqId(items.id.toString());
                      setcategoryId(items?.category_id)
                    }}
                    size={18}
                    className="text-primary mr-3 cursor-pointer"
                  />
                  <FaTrash
                    onClick={() => {
                      setIsDialogOpen(true);
                      setfaqId(items.id.toString());
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
        title={`${faqId ? 'Edit faq' : 'Add faq'}`}
      >
        <div className="mb-4.5">
          <SelectGroupOne
            label="Select a category"
            options={categoryList.map((value) => ({
              value: value.id,
              label: value.name,
            }))}
            defaultValue={categoryId}
            onChange={(value) => {
              setcategoryId(value.toString());
            }}
            isLabel={true}
          />
        </div>

        <div className="mb-4.5">
          <InputField
            type="text"
            label="Question"
            placeholder="Enter  question"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            required={true}
          />
        </div>
        <div className="mb-4.5">
          <TextArea
            rows={4}
            label="Answer"
            placeholder="Enter answer"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            required={true}
          />
        </div>
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

export default Faq;
