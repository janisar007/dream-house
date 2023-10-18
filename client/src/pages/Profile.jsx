import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { MdDelete } from "react-icons/md";
import { AiTwotoneEdit } from "react-icons/ai";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
import {
  deleteUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  signOutUserFailure,
  signOutUserStart,
  signOutUserSuccess,
  updateUserFailure,
  updateUserStart,
  updateUserSuccess,
} from "../redux/user/userSlice";

const Profile = () => {
  const fileRef = useRef(null); //?In the first input field i defined ref={fileRef} and in img i created an onClick in which fileRef.current.click() is written. in this way i am connecting that input field to this img. so if i click on img, it is actually clicking on that input that opens file storage of our computer. we cannot see that input coz it is hidden
  //!FIREBASE_RULES: After connecting input and img i have to write some rules for read and write in my application in the firebase. coz default i can not write in my application. this is done at vid(3:48:00)->
  const [file, setFile] = useState(undefined);
  const [filePrecent, setFilePrecent] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [formData, setFormData] = useState({});
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [showListingError, setShowListingError] = useState(false);
  const [userListings, setSetUserListings] = useState([]);
  const dispatch = useDispatch();
  // console.log(formData);

  // console.log(filePrecent);
  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);

  //!What is hapenning here?: when we upload image file, first it saves in the the storage of firebase. and then we get the url of the of image from firebase and who it here.
  const handleFileUpload = (file) => {
    //getStorage se hum firebase k storage ko access kar sakte hai jiske liye just humne read and write ka rule define kiya tha->
    const storage = getStorage(app); //with this app firebase will know, of which project's storage we want to access.

    //we can simply write this ->
    // const fileName = file.name; //to get file's name
    //but this will give error if we upload two files with same namw, so we have to make it unique
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file); //with this uploadTask we can get precentage of upload, error etc.

    uploadTask.on(
      "state_changed",

      //1. This is for progress->
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100; //in this progress we have precentage of upload done.
        // console.log('Upload is ' + progress + "% done");
        setFilePrecent(Math.round(progress));
      },

      //2. this is for any error ->
      (error) => {
        setFileUploadError(true);
      },

      //3. Here we finally getting the uploaded file url from firebase storage.
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setFormData({ ...formData, avator: downloadURL });
        });
      }
    );
  };

  const { currentUser, loading, error } = useSelector((state) => state.user);

  // console.log(file);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(updateUserStart());

      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (data.success === false) {
        dispatch(updateUserFailure(data.message));
        return;
      }

      dispatch(updateUserSuccess(data));
      setUpdateSuccess(true);
    } catch (error) {
      dispatch(updateUserFailure(error.message));
    }
  };

  const handleDeleteUser = async () => {
    try {
      dispatch(deleteUserStart());

      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (data.success === false) {
        dispatch(deleteUserFailure(data.message));
        return;
      }

      dispatch(deleteUserSuccess(data));
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  };

  const handleSignOut = async () => {
    try {
      dispatch(signOutUserStart());

      const res = await fetch("/api/auth/signout"); //default method is GET

      const data = await res.json();

      if (data.success === false) {
        dispatch(signOutUserFailure(data.message));
        return;
      }

      dispatch(signOutUserSuccess(data));
    } catch (error) {
      console.log(error);
      dispatch(signOutUserFailure(error.message));
    }
  };

  const handleShowListings = async () => {
    try {
      setShowListingError(false);

      const res = await fetch(`/api/user/listings/${currentUser._id}`);
      const data = await res.json();

      if (data.success === false) {
        setShowListingError(true);
        return;
      }

      setSetUserListings(data);
    } catch (error) {
      setShowListingError(true);
    }
  };

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">Profile</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          onChange={(e) => setFile(e.target.files[0])}
          type="file"
          ref={fileRef}
          hidden
          accept="image/*"
        />

        <img
          onClick={() => fileRef.current.click()}
          className="rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2"
          src={formData.avator || currentUser.avator}
          alt="profile"
        />

        <p className="text-sm self-center">
          {fileUploadError ? (
            <span className="text-red-700"> Error Image upload</span>
          ) : filePrecent > 0 && filePrecent < 100 ? (
            <span className="text-slate-700">
              {`Uploading ${filePrecent}%`}
            </span>
          ) : filePrecent === 100 ? (
            <span className="text-green-700">Image successfully uploaded!</span>
          ) : (
            ""
          )}
        </p>

        <input
          type="text"
          placeholder="username"
          id="username"
          defaultValue={currentUser.username}
          className="border p-3 rounded-lg"
          onChange={handleChange}
        />

        <input
          type="text"
          placeholder="email"
          id="email"
          defaultValue={currentUser.email}
          className="border p-3 rounded-lg"
          onChange={handleChange}
        />

        <input
          type="password"
          placeholder="password"
          id="password"
          className="border p-3 rounded-lg"
          onChange={handleChange}
        />

        <button
          disabled={loading}
          className="bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-95"
        >
          {loading ? "Loading..." : "Update"}
        </button>

        {/* Link for create Listing apart from this form functionallity-> */}
        <Link
          className="bg-green-700 text-white p-3 rounded-lg uppercase text-center hover:opacity-95"
          to={"/create-listing"}
        >
          Create Listing
        </Link>
      </form>

      <div className="flex justify-between mt-5">
        <span
          onClick={handleDeleteUser}
          className="text-red-700 cursor-pointer hover:text-red-900"
        >
          Delete account
        </span>

        <span
          onClick={handleSignOut}
          className="text-red-700 cursor-pointer hover:text-red-900"
        >
          Sign out
        </span>
      </div>
      <p className="text-red-700 mt-5">{error ? error : ""}</p>
      <p className="text-green-700 mt-5">
        {updateSuccess ? "Updated successfully!" : ""}
      </p>

      <button onClick={handleShowListings} className="text-green-700 w-full">
        Show Listings
      </button>
      <p className="text-red-700 mt-5">
        {showListingError ? "Error showing Listings" : ""}
      </p>

      {userListings && userListings.length > 0 && (
        <div className="flex flex-col gap-4">
          <h1 className="text-center mt-7 text-2xl font-semibold">
            Your Listings
          </h1>
          {userListings.map((listing) => (
            <div
              key={listing._id}
              className="border rounded-lg p-3 flex justify-between
          items-center gap-4"
            >
              <Link to={`/listing/${listing._id}`}>
                <img
                  src={listing.imageUrls[0]}
                  alt="listing cover"
                  className="h-16 w-16 object-contain"
                />
              </Link>

              <Link
                key={listing._id}
                className="text-slate-700 font-semibold hover:underline truncate flex-1"
              >
                <p>{listing.name}</p>
              </Link>
              <div className="flex flex-col items-center gap-3">
                <button className="text-red-700 uppercase">
                  <MdDelete className="text-2xl w-6 h-6"/>
                </button>
                <button className="text-green-700 uppercase">
                  <AiTwotoneEdit className="text-2xl w-6 h-6"/>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Profile;
