import React from 'react'
import { Link } from 'react-router-dom'
import {MdLocationOn} from 'react-icons/md'

const ListingItem = ({listing}) => {
  return (
    <div className='bg-white shadow-md hover:shadow-lg transition-shadow overflow-hidden rounded-lg w-full sm:w-[330px]'>
        <Link to={`/listing/${listing._id}`}>
            <img src={listing.imageUrls[0]} alt='listing cover' className='h-[320px] sm:h-[220px] w-full object-cover hover:scale-105 transition-scale duration-300'/>

            <div className='p-3 flex flex-col gap-2 w-full'>
                <p className='truncate text-lg font-semibold text-slate-700'>{listing.name}</p>

                <div className='flex items-center gap-1'>
                    <MdLocationOn className='h-4 w-4 text-green-700'/>
                    <p className='text-sm text-gray-600 truncate w-full'>{listing.address}</p>
                </div>
                {/* Since there will be multiple lines in the descriptin and we want to truncate all the lines but in tailwind css there are no class to do so. but there is an tailwind github package that provide this functionality so we are going to install it. `npm install -D @tailwindcss/line-clamp`. you can search it for the tailwind lineclamp github. and get this install command and we have to configure tailwind.config.js file with the code provided in the same github docs only the plugin->*/}
                <p className='text-sm text-gray-600 line-clamp-2'>{listing.description}</p>

                <p className='text-sm text-slate-500 mt-2 font-semibold'>
                    $
                    {listing.offer ? listing.discountPrice.toLocaleString('en-Us') : listing.regularPrice.toLocaleString('en-Us')}
                    {listing.type === 'rent' && ' / month'}
                </p>

                <div className='text-slate-700 flex gap-4'>
                    <div className='font-bold text-xs'>
                        {listing.bedrooms > 1 ? `${listing.bedrooms} beds` : `${listing.bedrooms} bed`}
                    </div>
                    <div className='font-bold text-xs'>
                        {listing.bathrooms > 1 ? `${listing.bathrooms} baths` : `${listing.bathrooms} bath`}
                    </div>
                </div>

            </div>
        </Link>
    </div>
  )
}

export default ListingItem