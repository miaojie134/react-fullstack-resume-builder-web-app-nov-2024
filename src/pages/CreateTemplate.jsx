import React, { useState } from "react";
import { FaTrash, FaUpload } from "react-icons/fa6";
import { PuffLoader } from "react-spinners";
import { toast } from "react-toastify";
import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { db, storage } from "../config/firebase.config";
import { initialTags } from "../utils/helpers";
import { deleteDoc, doc, serverTimestamp, setDoc } from "firebase/firestore";
import useTemplate from "../hooks/useTemplate";

const CreateTemplate = () => {
  const [formData, setFormData] = useState({
    title: "",
    imageURL: null,
  });

  const [imageAsset, setImageAsset] = useState({
    isImageLoading: false,
    uri: null,
    progress: 0,
  });

  const [selectedTags, setSelectedTags] = useState([]);

  const {
    data: templates,
    isError: templatesIsError,
    isLoading: templatesIsLoading,
    refetch: templatesRefetch,
  } = useTemplate();

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileSelect = (e) => {
    setImageAsset((prev) => ({ ...prev, isImageLoading: true }));
    const file = e.target.files[0];
    if (file && isAllowed(file)) {
      const storageRef = ref(storage, `Templates/${Date.now()}-${file.name}`);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          setImageAsset((prev) => {
            return {
              ...prev,
              progress: (snapshot.bytesTransferred / snapshot.totalBytes) * 100,
            };
          });
        },
        (err) => {
          if (err.message.includes("storage/unauthorized")) {
            toast.error(`Error: Authorization Revoked`);
          } else {
            toast.error(`Error: ${err.message}`);
          }
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setImageAsset((prev) => ({
              ...prev,
              progress: 0,
              uri: downloadURL,
              isImageLoading: false,
            }));
            toast.success("File Uploaded");
          });
        }
      );
    } else {
      toast.error("Invalid File Format");
    }
  };

  const isAllowed = (file) => {
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
    return allowedTypes.includes(file.type);
  };

  const deleteAnImageObject = () => {
    setImageAsset((prev) => ({ ...prev, isImageLoading: true }));
    const deleteRef = ref(storage, imageAsset.uri);
    console.log(deleteRef);
    deleteObject(deleteRef).then(() => {
      setTimeout(() => {
        setImageAsset((prev) => {
          return { ...prev, progress: 0, uri: null, isImageLoading: false };
        });
        toast.success("Image removed");
      }, 500);
    });

  };

  const handelSelectTags = (tag) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const pushToCloud = async () => {
    const timestamp = serverTimestamp();
    const id = `${Date.now()}`;
    const _doc = {
      _id: id,
      title: formData.title,
      imageURL: imageAsset.uri,
      tags: selectedTags,
      name:
        templates.length > 0 ? `Template${templates.length + 1}` : "Template1",
      timestamp: timestamp,
    };

    await setDoc(doc(db, "templates", id), _doc)
      .then(() => {
        setFormData((prev) => ({ ...prev, title: "", imageURL: null }));
        setImageAsset((prev) => ({ ...prev, uri: null }));
        setSelectedTags([]);
        templatesRefetch();
        toast.success("Data push to the cloud");
      })
      .catch((err) => toast.error(`Error: ${err.message}`));
  };

  const removeTemplate = async (template) => {
    const deleteRef = ref(storage, template?.imageURL);
    await deleteObject(deleteRef).then(async () => {
      await deleteDoc(doc(db, "templates", template?._id))
        .then(() => {
          toast.success("Template deleted from the cloud");
          templatesRefetch();
        })
        .catch((err) => {
          toast.error(`Error: ${err.message}`);
        });
    });
  };

  return (
    <div className="w-full px-4 lg:px-10 2xl:px-32 py-4 grid grid-cols-1 lg:grid-cols-12 gap-3">
      {/* left container */}
      <div className="col-span-12 lg:col-span-5 2xl:col-span-5 flex flex-col items-center  gap-3">
        <div className="w-full">
          <p className="text-lg text-txtPrimary">Create a new Template</p>
        </div>

        {/* template ID section */}
        <div className="w-full flex items-center justify-end">
          <p className="text-base text-txtLight uppercase font-semibold">
            TempID:{""}
          </p>
          <p className="text-sm text-txtDark capitalize">
            {templates && templates.length > 0
              ? `Template${templates.length + 1}`
              : "Template1"}
          </p>
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

        {/* file uploader section */}
        <div
          className="w-full bg-gray-100 h-[420px]  2xl:h-[520px]  backdrop-blur-md  rounded-md
        border-2 border-dotted border-gray-300 cursor-pointer flex items-center justify-center flex-col"
        >
          {imageAsset.isImageLoading ? (
            <React.Fragment>
              <div className="flex flex-col items-center justify-center">
                <PuffLoader size={40} color="#498FCD" />
                <p>{imageAsset?.progress.toFixed(2)}%</p>
              </div>
            </React.Fragment>
          ) : (
            <React.Fragment>
              {!imageAsset?.uri ? (
                <React.Fragment>
                  <label className="w-full h-full flex  items-center justify-center cursor-pointer flex-col">
                    <div className="flex flex-col items-center justify-center">
                      <FaUpload className="text-2xl" />
                      <p className="text-txtLight text-lg">Click to upload</p>
                    </div>
                    <input
                      type="file"
                      className="w-0 h-0"
                      accept=".jpeg,.jpg,.png"
                      onChange={handleFileSelect}
                    />
                  </label>
                </React.Fragment>
              ) : (
                <React.Fragment>
                  <div className="relative w-full h-full overflow-cover rounded-md">
                    <img
                      className="w-full h-full object-cover"
                      src={imageAsset.uri}
                      loading="lazy"
                      alt=""
                    />

                    <div
                      className="absolute top-4 right-4 w-8 h-8 rounded-md flex items-center justify-center bg-red-500 cursor-pointer"
                      onClick={deleteAnImageObject}
                    >
                      <FaTrash className="text-sm text-white" />
                    </div>
                  </div>
                </React.Fragment>
              )}
            </React.Fragment>
          )}
        </div>

        {/* tags */}
        <div className="w-full flex items-center flex-wrap gap-2">
          {initialTags.map((tag, index) => (
            <div
              key={index}
              className={`border border-gray-200 rounded-md px-2 py-1 cursor-pointer ${
                selectedTags.includes(tag) ? "bg-blue-500" : "bg-white"
              }`}
              onClick={() => handelSelectTags(tag)}
            >
              <p className="text-xs">{tag}</p>
            </div>
          ))}
        </div>

        {/* button */}
        <button
          className="bg-blue-600 w-full text-white h-10 rounded-md active:scale-95 duration-300"
          onClick={pushToCloud}
        >
          Save
        </button>
      </div>

      {/* right container */}
      <div className="col-span-12 lg:col-span-7 2xl:col-span-7 px-2 w-full flex-1 py-4">
        {templatesIsLoading ? (
          <React.Fragment>
            <div className="w-full h-full flex items-center justify-center">
              <PuffLoader size={40} color="#498FCD" />
            </div>
          </React.Fragment>
        ) : (
          <React.Fragment>
            {templates && templates.length > 0 ? (
              <React.Fragment>
                <div className="w-full h-full grid gird-cols-1 lg:grid-cols-2 2xl:gird-cols-4 gap-4">
                  {templates?.map((template) => (
                    <div
                      key={template?._id}
                      className="w-full rounded-md overflow-hidden relative h-[500px]"
                    >
                      <img
                        src={template?.imageURL}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                      {/* delete action */}
                      <div
                        className="absolute top-4 right-4 w-8 h-8 rounded-md flex items-center justify-center bg-red-500 cursor-pointer"
                        onClick={() => removeTemplate(template)}
                      >
                        <FaTrash className="text-sm text-white" />
                      </div>
                    </div>
                  ))}
                </div>
              </React.Fragment>
            ) : (
              <React.Fragment>
                <div>No Data</div>
              </React.Fragment>
            )}
          </React.Fragment>
        )}
      </div>
    </div>
  );
};

export default CreateTemplate;
