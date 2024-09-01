"use client";

import Image from "next/image";
import React from "react";
import map from "../../public/AdobeGen.jpeg";
import { CardBody, CardContainer, CardItem } from "./ui/3d-card";
import Link from "next/link";
export function ThreeDCardDemo() {
  return (
    <CardContainer className="inter-var bg-white">
      <CardBody className="bg-gray-50 relative group/card  dark:hover:shadow-2xl dark:hover:shadow-emerald-500/[0.1] dark:bg-black dark:border-white/[0.2] border-black/[0.1] w-auto sm:w-[30rem] h-auto rounded-xl p-6 border  ">
        <CardItem
          translateZ="50"
          className="text-xl font-bold text-neutral-600 dark:text-white"
        >
          <h2>
            Adobe -{" "}
            <span className="text-blue-500 dark:text-blue-500">GenSolve.</span>
          </h2>
        </CardItem>

        <CardItem
          translateZ="100"
          rotateX={20}
          rotateZ={-10}
          className="w-full mt-4"
        >
          <Image
            src={map}
            height="1000"
            width="1000"
            className="h-60 w-full object-cover rounded-xl group-hover/card:shadow-xl"
            alt="thumbnail"
          />
        </CardItem>
        <div className="flex justify-between items-center mt-20">
          <a href="/Adobe.png" target="_blank" rel="noopener noreferrer">
            <CardItem
              translateZ={20}
              translateX={40}
              as="button"
              className="px-4 py-2 rounded-xl bg-black dark:bg-white dark:text-black text-white text-xs font-bold"
            >
              Show PPT
            </CardItem>
          </a>
        </div>
      </CardBody>
    </CardContainer>
  );
}
