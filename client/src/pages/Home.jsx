import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import SwiperCore from "swiper";
import "swiper/css/bundle";
import ListingItem from "../components/ListingItem";

const Home = () => {
  SwiperCore.use([Navigation]);

  const [offerListings, setOfferListings] = useState([]);
  const [rentListings, setRentListings] = useState([]);
  const [saleListings, setSaleListings] = useState([]);

  // console.log(offerListings);

  useEffect(() => {
    const fetchOffersListings = async () => {
      try {
        const res = await fetch(`/api/listing/get?offer=true&limit=4`);

        const data = await res.json();

        setOfferListings(data);

        fetchRentListings();
      } catch (error) {
        console.log(error.message);
      }
    };

    const fetchRentListings = async () => {
      try {
        const res = await fetch(`/api/listing/get?type=rent&limit=4`);

        const data = await res.json();

        setRentListings(data);

        fetchSaletListings();
      } catch (error) {
        console.log(error.message);
      }
    };

    const fetchSaletListings = async () => {
      try {
        const res = await fetch(`/api/listing/get?type=sale&limit=4`);

        const data = await res.json();

        setSaleListings(data);
      } catch (error) {
        console.log(error.message);
      }
    };

    fetchOffersListings();
  }, []);

  return (
    <div>
      {/* Top */}
      <div className=" flex flex-col gap-6 py-28 px-3 max-w-6xl mx-auto">
        <h1 className="text-slate-700 font-bold text-3xl lg:text-6xl">
          Find your next <span className="text-slate-500">perfect</span> <br />{" "}
          place with ease
        </h1>

        <div className="text-gray-400 text-xs sm:text-sm">
          Dream House will help you find your home fast, easy and comfortable.{" "}
          <br />
          Our expert support are always available.
        </div>

        <Link
          to={"/search"}
          className="text-xs sm:text-sm text-blue-800 font-bold hover:underline w-[120px]"
        >
          Let's get started...
        </Link>
      </div>

{/* In swiper i want to show the last reacent four offers pics -> */}
      {/* Swiper */}
      <Swiper navigation>
        {offerListings &&
          offerListings.length > 0 &&
          offerListings.map((listing) => (
            <SwiperSlide key={listing._id}>
              <div
                style={{
                  background: `url(${listing.imageUrls[0]}) center no-repeat`,
                  backgroundSize: "cover",
                }}
                className="h-[500px]"
                
              ></div>
            </SwiperSlide>
          ))}
      </Swiper>

      

      {/* Listing results for offer, sale and rent */}

      <div className="max-w-6xl mx-auto p-3 flex flex-col gap-8 my-10">
        
        {
          offerListings && offerListings.length > 0 && (
            <div>
              <div className="my-3">
                <h2 className="text-2xl font-semibold text-slate-600">Recent offers</h2>
                <Link to={'/search?offer=true'} className="text-sm text-blue-800 hover:underline">
                  Show more offers
                </Link>
              </div>
              <div className="flex flex-wrap gap-4">
                {offerListings.map((listing) => (
                  <ListingItem listing={listing} key={listing._id}/>
                ))}
              </div>
            </div>
          )
        }

        {
          rentListings && rentListings.length > 0 && (
            <div>
              <div className="my-3">
                <h2 className="text-2xl font-semibold text-slate-600">Recent places for rent</h2>
                <Link to={'/search?type=rent'} className="text-sm text-blue-800 hover:underline">
                  Show more places for rent
                </Link>
              </div>
              <div className="flex flex-wrap gap-4">
                {rentListings.map((listing) => (
                  <ListingItem listing={listing} key={listing._id}/>
                ))}
              </div>
            </div>
          )
        }

        {
          saleListings && saleListings.length > 0 && (
            <div>
              <div className="my-3">
                <h2 className="text-2xl font-semibold text-slate-600">Recent places for sale</h2>
                <Link to={'/search?type=sale'} className="text-sm text-blue-800 hover:underline">
                  Show more places for sale
                </Link>
              </div>
              <div className="flex flex-wrap gap-4">
                {saleListings.map((listing) => (
                  <ListingItem listing={listing} key={listing._id}/>
                ))}
              </div>
            </div>
          )
        }

      </div>
    </div>
  );
};

export default Home;
