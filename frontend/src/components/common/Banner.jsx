import React from "react";

const Banner = ({
  SVGComponent,
  heading,
  customText,
  bannerBackground = "gray-100",
  textColor = "gray",
}) => {
  return (
    <div
    className={`w-11/12 mx-auto bg-${bannerBackground} shadow-xl  rounded p-4 h-72 my-6 bg-cover flex flex-row justify-between`}
    >
      <div className="flex-1">
        <h2 className={`text-4xl md:text-6xl text-${textColor}-600 font-semibold font-sans`}>
          {heading}
        </h2>
        <p className={`text-lg md:text-2xl text-${textColor}-500 font-sans mt-4`}>
          {customText}
        </p>
      </div>
      <div className="w-1/5 hidden sm:block">
        {typeof SVGComponent === "string" ? (
          <img src={SVGComponent} alt="Banner illustration" className="w-full h-auto" />
        ) : (
          <SVGComponent className="w-full h-auto" />
        )}
      </div>
    </div>
  );
};

export default Banner;