import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";

const Profile = () => {
  const fileRef = useRef(null); //?In the first input field i defined ref={fileRef} and in img i created an onClick in which fileRef.current.click() is written. in this way i am connecting that input field to this img. so if i click on img, it is actually clicking on that input that opens file storage of our computer. we cannot see that input coz it is hidden
  //!FIREBASE_RULES: After connecting input and img i have to write some rules for read and write in my application in the firebase. coz default i can not write in my application. this is done at vid(3:48:00)->
  const [file, setFile] = useState(undefined);
  const [filePrecent, setFilePrecent] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [formData, setFormData] = useState({});
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

  const { currentUser } = useSelector((state) => state.user);

  // console.log(file);

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">Profile</h1>

      <form className="flex flex-col gap-4">
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
          className="border p-3 rounded-lg"
        />

        <input
          type="text"
          placeholder="email"
          id="email"
          className="border p-3 rounded-lg"
        />

        <input
          type="text"
          placeholder="password"
          id="password"
          className="border p-3 rounded-lg"
        />

        <button className="bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-95">
          Update
        </button>
      </form>

      <div className="flex justify-between mt-5">
        <span className="text-red-700 cursor-pointer hover:opacity-80">
          Delete account
        </span>

        <span className="text-red-700 cursor-pointer hover:opacity-80">
          Sign out
        </span>
      </div>
    </div>
  );
};

export default Profile;
