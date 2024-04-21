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
import { storage } from "../config/firebase.config";
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
    deleteObject(deleteRef).then(() => {
      setTimeout(() => {
        setImageAsset((prev) => {
          return { ...prev, progress: 0, uri: null, isImageLoading: false };
        });
      toast.success("Image removed");
      }, 500);
    });
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

        {/* file uploader section */}
        <div
          className="w-full bg-gray-100 h-[420px] lg:h-[620px] 2xl:h-[700px]  backdrop-blur-md  rounded-md
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
      </div>

      {/* right container */}
      <div className="col-span-12 lg:col-span-8 2xl:col-span-9 bg-purple-200">
        2
      </div>
    </div>
  );
};

export default CreateTemplate;
