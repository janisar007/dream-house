import React, { useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);
  const [searchTerm, setSearchTerm] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    //First we want the parameters or the chrome urls about my website ->
    const urlParams = new URLSearchParams(window.location.search);

    //Now we want to add or update the search term ->
    urlParams.set("searchTerm", searchTerm);

    //now we have to navigate user to this new url but first we have to convert urlParams into string coz in urlParams some of them are string some of them number etc ->
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };
  //!SO when ever we change searchTerm and enter from website the change in parameter of searchTerm changes in chrom search bar. but we want when we chnage the value of searchTerm from chrome search bar it also changes from the search bar of our website as well. first part is done by the handleSubmit function. the second part we will achieve with following useEffect hook ->
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    //searchTermFromUrl = searchTermFromChrome
    const searchTermFromUrl = urlParams.get("searchTerm");

    if (searchTermFromUrl) {
      setSearchTerm(searchTermFromUrl);
    }
  }, [location.search]);

  return (
    <div className="bg-slate-200 shadow-md">
      <div className="flex justify-between items-center max-w-6xl mx-auto p-3">
        <Link to="/">
          <h1 className="font-bold text-sm sm:text-xl flex flex-wrap">
            <span className="text-slate-500">Dream</span>
            <span className="text-slate-700">House</span>
          </h1>
        </Link>

        <form
          onSubmit={handleSubmit}
          className="bg-slate-100 p-3 rounded-lg flex items-center"
        >
          <input
            type="text"
            placeholder="Search..."
            // here w-24 sm:w-64 means for small screens width=24 and for big and above screens width=64
            className="bg-transparent focus:outline-none w-32 sm:w-64"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button>
            <FaSearch className="text-slate-600" />
          </button>
        </form>

        <ul className="flex gap-4">
          <Link to="/">
            <li className="hidden sm:inline text-slate-700 hover:underline">
              Home
            </li>
          </Link>

          <Link to="/about">
            <li className="hidden sm:inline text-slate-700 hover:underline">
              About
            </li>
          </Link>

          {/* here you could wander if it is directing to profile page what happend if i click sign in button. see PrivateRoute.jsx in which i protected the route so that if user is authenticated then the image will apear and clicking on it will direct to profile if not then to signin page.  */}
          <Link to="/profile">
            {currentUser ? (
              <img
                className="rounded-full h-7 w-7 object-cover"
                src={currentUser.avator}
                alt="profile"
              />
            ) : (
              <li className="text-slate-700 hover:underline">Sign in</li>
            )}
          </Link>
        </ul>
      </div>
    </div>
  );
};

export default Header;
