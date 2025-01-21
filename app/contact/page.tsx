import type { NextPage } from 'next';
import Image from "next/image";



const Contact:NextPage = () => {
  	return (
        <div className="w-auto flex flex-col items-center justify-center px-4 md:px-8 lg:px-16 xl:px-24">
        {/* Header Section */}
        <div className="max-w-2xl text-center mb-16">
          <h1 className="text-3xl md:text-4xl font-semibold text-black mb-4 font-poppins">
            Get In Touch With Us
          </h1>
          <p className="text-base text-darkgray font-inter">
            For More Information About Our Product & Services. Please Feel Free To Drop Us An Email. 
            Our Staff Always Be There To Help You Out. Do Not Hesitate!
          </p>
        </div>
  
        {/* Contact Content */}
        <div className="flex flex-col lg:flex-row justify-between gap-12 max-w-6xl ">
          {/* Contact Information */}
          <div className="w-full lg:w-1/3 space-y-10">
            {/* Address */}
            <div className="flex items-start space-x-6">
              <Image 
                src="/contact/location.svg" 
                alt="Address Icon" 
                width={22} 
                height={28} 
                className="mt-8"
              />
              <div>
                <h3 className="text-[24px] font-medium font-poppins mb-2">Address</h3>
                <p className="text-base font-inter text-darkgray">
                  236 5th SE Avenue, New York NY10000, United States
                </p>
              </div>
            </div>
  
            {/* Phone */}
            <div className="flex items-start space-x-6">
              <Image 
                src="/contact/phone.svg" 
                alt="Phone Icon" 
                width={22} 
                height={22} 
                className="mt-8"
              />
              <div>
                <h3 className="text-[24px] font-poppins font-medium mb-2">Phone</h3>
                <p className="text-base font-inter text-darkgray">
                  Mobile: +(84) 546-6789<br />
                  Hotline: +(84) 456-6789
                </p>
              </div>
            </div>
  
            {/* Working Time */}
            <div className="flex items-start space-x-6">
              <Image 
                src="/contact/time.svg" 
                alt="Clock Icon" 
                width={23} 
                height={23} 
                className="mt-8"
              />
              <div>
                <h3 className="text-[24px] font-medium font-poppins mb-2">Working Time</h3>
                <p className="text-base font-inter text-darkgray">
                  Monday-Friday: 9:00 - 22:00<br />
                  Saturday-Sunday: 9:00 - 21:00
                </p>
              </div>
            </div>
          </div>
  
          {/* Contact Form */}
          <div className="w-full lg:w-2/3">
            <form className="space-y-6">
              {/* Name Input */}
              <div className="w-full">
                <label className="block text-[16px] font-medium font-poppins mb-2">Your name</label>
                <input 
                  type="text" 
                  placeholder="Abc" 
                  className="w-full px-4 placeholder:font-poppins py-4 border border-darkgray rounded-md focus:outline-none focus:ring-2 focus:ring-darkcyan"
                />
              </div>
  
              {/* Email Input */}
              <div className="w-full">
                <label className="block text-[16px] font-medium font-poppins mb-2">Email address</label>
                <input 
                  type="email" 
                  placeholder="Abc@def.com" 
                  className="w-full placeholder:font-poppins px-4 py-4 border border-darkgray rounded-md focus:outline-none focus:ring-2 focus:ring-darkcyan"
                />
              </div>
  
              {/* Subject Input */}
              <div className="w-full">
                <label className="block text-[16px] font-medium font-poppins mb-2">Subject</label>
                <input 
                  type="text" 
                  placeholder="This is an optional" 
                  className="w-full placeholder:font-poppins px-4 py-4 border border-darkgray rounded-md focus:outline-none focus:ring-2 focus:ring-darkcyan"
                />
              </div>
  
              {/* Message Input */}
              <div className="w-full">
                <label className="block text-[16px] font-medium font-poppins mb-2">Message</label>
                <textarea 
                  placeholder="Hi! i'd like to ask about" 
                  rows={4}
                  className="w-full placeholder:font-poppins px-4 py-4 border border-darkgray rounded-md focus:outline-none focus:ring-2 focus:ring-darkcyan"
                />
              </div>
  
              {/* Submit Button */}
              <button 
                type="submit" 
                className="w-full cursor-pointer text-[16px] font-poppins md:w-auto px-8 py-3 bg-darkcyan text-white rounded-md hover:bg-opacity-90 transition-colors"
              >
                Submit
              </button>
            </form>
          </div>
        </div>
      </div>
      );
};

export default Contact;
