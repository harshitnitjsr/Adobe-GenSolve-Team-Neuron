"use client";
import Image from "next/image";
import React from "react";
// import { WobbleCard } from "";
import { WobbleCard } from "./ui/wobble-card";
export function WobbleCardDemo({apidata}:any) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 max-w-7xl mx-auto w-full">

      <WobbleCard containerClassName="col-span-1 lg:col-span-3 bg-blue-900 min-h-[500px] lg:min-h-[600px] xl:min-h-[300px]">
        <div className="max-w-sm">
          <h2 className="text-3xl font-semibold  text-white">
            {apidata}
          </h2>
          {/* <p className="mt-4 max-w-[26rem] text-left  text-base/6 text-neutral-200">
            With over 100,000 mothly active bot users, Gippity AI is the most
            popular AI platform for developers.
          </p> */}
        </div>
        <Image
          src="/Adobe.png"
          width={500}
          height={500}
          alt="linear demo image"
          className="absolute -right-10 md:-right-[40%] lg:-right-[20%] -bottom-10 object-contain rounded-2xl"
        />
      </WobbleCard>
    </div>
  );
}
