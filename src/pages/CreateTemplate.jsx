import React, { useState } from "react";

const CreateTemplate = () => {
  const [formData, setFormData] = useState({
    title: "",
    imageURL: null,
  });
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  return (
    <div className="w-full px-4 lg:px-10 2xl:px-32 py-4 grid grid-cols-1 lg:grid-cols-12">
      {/* left container */}
      <div className="col-span-12 lg:col-span-4 2xl:col-span-3">
        <div className="w-full">
          <p className="text-lg text-txtPrimary">Create a new Template</p>
        </div>

        {/* template ID section */}
        <div className="w-full flex items-center justify-end">
          <p className="text-base text-txtLight uppercase font-semibold">
            TempID:{""}
          </p>
          <p className="text-sm text-txtDark capitalize">template1</p>
        </div>

        {/* template tile section */}
        <input
          className="w-full px-4 py-3 rounded-md bg-transparent border boder-gray-300 text-lg text-txtPrimary focus:text-txtDark focus:shadow-md outline-none"
          type="text"
          name="title"
          placeholder="Template Title"
          value={formData.title}
          onChange={handleInputChange}
        />
      </div>

      {/* right container */}
      <div className="col-span-12 lg:col-span-8 2xl:col-span-9">2</div>
    </div>
  );
};

export default CreateTemplate;
