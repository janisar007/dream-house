import React, { useEffect, useState } from "react";
import { app } from "../firebase";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";

const UpdateListing = () => {

    const params = useParams();

    useEffect(() => {
        const fetchListing = async () => {
            const listingId = params.listingId;
            const res = await fetch(`/api/listing/get/${listingId}`);
            const data = await res.json();

            if(data.success === false) {
                console.log(data.message);
                return;
            }
            setFormData(data);
        }

        fetchListing();
    }, [])

  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);
  const [files, setFiles] = useState([]);
  const [formData, setFormData] = useState({
    imageUrls: [], //its just a initial value.
    name: "",
    description: "",
    address: "",
    type: "rent",
    bedrooms: 1,
    bathrooms: 1,
    regularPrice: 50,
    discountPrice: 0,
    offer: false,
    parking: false,
    furnished: false,
  });
  // console.log(formData);

  const [imageUploadError, setImagesUploadError] = useState(false);
  const [imageUploadLoading, setImageUploadLoading] = useState(false);
  const [formSubmitError, setFormSubmitError] = useState(false);
  const [formSubmitLoading, setFormSubmitLoading] = useState(false);
  //   console.log(files);

  const handleImageSubmit = (e) => {
    // e.preventDefault(); //since we are not submiting with this button, sp we do not need preventDefault.
    if (files.length > 0 && files.length + formData.imageUrls.length < 7) {
      setImageUploadLoading(true);
      setImagesUploadError(false);
      //! Now since we will have more than one files and they are going to takes some time to upload hence we have to deal them with promise. and upload them one by one ->
      const promises = [];

      for (let i = 0; i < files.length; i++) {
        promises.push(storeImages(files[i])); //all the downloadURLs are going to store in this promises array from firebase storage.
      }

      //this all mehtod will wait for all the urls to be resolved and saved in the form data.
      Promise.all(promises)
        .then((urls) => {
          setFormData({
            ...formData,
            imageUrls: formData.imageUrls.concat(urls),
          });
          setImagesUploadError(false);
          setImageUploadLoading(false);
        })
        .catch((err) => {
          setImagesUploadError("Image upload failed (2 mb max per image)");
          setImageUploadLoading(false);
        });
    } else {
      setImagesUploadError("You can only upload 6 images per listing");
      setImageUploadLoading(false);
    }
  };
  const storeImages = async (file) => {
    return new Promise((resolve, reject) => {
      const storage = getStorage(app);
      const fileName = new Date().getTime() + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          //here i am storing progress % but will not use and show it on ui.
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        },

        (error) => {
          reject(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            resolve(downloadURL);
          });
        }
      );
    });
  };

  const handleRemoveImage = (index) => {
    setFormData({
      ...formData,
      //here _ means we are not passing any thing coz this requires to pass an argument so we just provided _ which is nothing
      imageUrls: formData.imageUrls.filter((_, i) => i !== index),
    });
  };

  const handleChange = (e) => {
    if (e.target.id === "sale" || e.target.id === "rent") {
      setFormData({
        ...formData,
        type: e.target.id,
      });
    }

    if (
      e.target.id === "parking" ||
      e.target.id === "furnished" ||
      e.target.id === "offer"
    ) {
      setFormData({
        ...formData,
        [e.target.id]: e.target.checked, //means e,target.checked can be true or false.
      });
    }

    if (
      e.target.type === "number" ||
      e.target.type === "text" ||
      e.target.type === "textarea"
    ) {
      setFormData({
        ...formData,
        [e.target.id]: e.target.value, //means e,target.checked can be true or false.
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (formData.imageUrls.length < 1)
        return setFormSubmitError("You must upload atleast one image");

      //Some times discountPrice, regularPrice saved as number and some times as string so convert them number by adding + sign ->
      if (+formData.regularPrice < +formData.discountPrice)
        return setFormSubmitError(
          "Discount price must be lower than Regular price"
        );

      setFormSubmitLoading(true);
      setFormSubmitError(false);
      const res = await fetch(`/api/listing/update/${params.listingId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,

          // here we have to say it which user is actually making this listing or making this api call
          userRef: currentUser._id,
        }),
      });

      const data = await res.json();
      setFormSubmitLoading(false);
      if (data.success === false) {
        setFormSubmitError(data.message);
      }

      //todo 
      navigate(`/listing/${data._id}`);
    } catch (error) {
      setFormSubmitError(error.message);
      setFormSubmitLoading(false);
    }
  };

  return (
    <main className="p-3 max-w-4xl mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">
        Update a Listing
      </h1>

      {/* I am giving both divs flex-1 so that they both have the same space on screen. */}
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
        {/*//? This dive contains upper three inputs all checkboxes and all four number inputs */}
        <div className="flex flex-col gap-4 flex-1">
          <input
            type="text"
            placeholder="Name"
            className="border p-3 rounded-lg"
            id="name"
            maxLength="62"
            minLength="10"
            required
            onChange={handleChange}
            value={formData.name}
          />

          <textarea
            type="text"
            placeholder="Description"
            className="border p-3 rounded-lg"
            id="description"
            required
            onChange={handleChange}
            value={formData.description}
          />

          <input
            type="textarea"
            placeholder="Address"
            className="border p-3 rounded-lg"
            id="address"
            required
            onChange={handleChange}
            value={formData.address}
          />

          {/*//! Check boxs */}
          <div className="flex gap-6 flex-wrap">
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="sale"
                className="w-5"
                onChange={handleChange}
                checked={formData.type === "sale"}
              />
              <span>Sell</span>
            </div>

            <div className="flex gap-2">
              <input
                type="checkbox"
                id="rent"
                className="w-5"
                onChange={handleChange}
                checked={formData.type === "rent"}
              />
              <span>Rent</span>
            </div>

            <div className="flex gap-2">
              <input
                type="checkbox"
                id="parking"
                className="w-5"
                onChange={handleChange}
                checked={formData.parking}
              />
              <span>Parking spot</span>
            </div>

            <div className="flex gap-2">
              <input
                type="checkbox"
                id="furnished"
                className="w-5"
                onChange={handleChange}
                checked={formData.furnished}
              />
              <span>Furnished</span>
            </div>

            <div className="flex gap-2">
              <input
                type="checkbox"
                id="offer"
                className="w-5"
                onChange={handleChange}
                checked={formData.offer}
              />
              <span>Offer</span>
            </div>
          </div>

          {/*//! Bed and Baths and regular price and discountPrice if Offer is checked */}
          <div className="flex flex-wrap gap-6">
            <div className="flex  items-center gap-2">
              <input
                type="number"
                id="bedrooms"
                min="1"
                max="10"
                required
                className="p-3 border border-gray-300 rounded-lg"
                onChange={handleChange}
                value={formData.bedrooms}
              />
              <p>Beds</p>
            </div>

            <div className="flex  items-center gap-2">
              <input
                type="number"
                id="bathrooms"
                min="1"
                max="10"
                required
                className="p-3 border border-gray-300 rounded-lg"
                onChange={handleChange}
                value={formData.bathrooms}
              />
              <p>Bath</p>
            </div>

            <div className="flex  items-center gap-2">
              <input
                type="number"
                id="regularPrice"
                min="50"
                max="1000000"
                required
                className="p-3 border border-gray-300 rounded-lg"
                onChange={handleChange}
                value={formData.regularPrice}
              />

              <div className="flex flex-col items-center">
                <p>Regular price</p>
                <span className="text-xs">($ / month)</span>
              </div>
            </div>

            {formData.offer && (
              <div className="flex  items-center gap-2">
                <input
                  type="number"
                  id="discountPrice"
                  min="0"
                  max="1000000"
                  required
                  className="p-3 border border-gray-300 rounded-lg"
                  onChange={handleChange}
                  value={formData.discountPrice}
                />
                <div className="flex flex-col items-center">
                  <p>Discounted price</p>
                  <span className="text-xs">($ / month)</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* //? This dive contains all the images related contents */}
        <div className="flex flex-col flex-1 gap-4">
          <p className="font-semibold">
            Images:
            <span className="font-normal text-gray-600 ml-2">
              The first image will be the cover (max 6)
            </span>
          </p>

          <div className="flex gap-4">
            <input
              onChange={(e) => setFiles(e.target.files)}
              className="p-3 border border-gray-300 rounded w-full"
              type="file"
              id="images"
              accept="images/*"
              multiple
            />
            <button
              // its important to change type sub,it to button otherwise it will submit our form coz its in side the form.
              type="button"
              disabled={imageUploadLoading}
              onClick={handleImageSubmit}
              className="p-3 text-green-700 border border-green-700 rounded uppercase hover:shadow-lg disabled:opacity-80"
            >
              {imageUploadLoading ? "Uploading..." : "Upload"}
            </button>
          </div>

          <p className="text-red-700 text-sm">
            {imageUploadError && imageUploadError}
          </p>

          {formData.imageUrls.length > 0 &&
            formData.imageUrls.map((url, index) => (
              <div
                key={url}
                className="flex justify-between p-3 border items-center"
              >
                <img
                  src={url}
                  alt="listing image"
                  className="w-20 h-20 object-contain rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveImage(index)}
                  className="text-red-700 rounded-lg uppercase hover:text-red-800"
                >
                  Delete
                </button>
              </div>
            ))}

          <button
            disabled={formSubmitLoading || imageUploadLoading}
            className="p-3 bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 disabled:opacity-80"
          >
            {formSubmitLoading ? "Updating..." : "Update Listing"}
          </button>
          {formSubmitError && (
            <p className="text-red-700 text-sm">{formSubmitError}</p>
          )}
        </div>
      </form>
    </main>
  );
};

export default UpdateListing;


