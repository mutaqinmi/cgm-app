"use client";
import { User } from "@phosphor-icons/react";

export default function AnnouncementGrup() {
  return <div className="flex flex-col gap-3">
    <span className="font-medium text-gray-500">17 Oktober 2024</span>
  <div className=" relative flex w-full">
      <div className="fixed w-28 h-28 shadow-sm bg-gray-500 rounded-md"></div>
      <div className="ml-32 h-28 flex flex-col justify-between">
        <div className="text-xs text-gray-400">
          <span className="mr-1">17 Oktober 2024</span>-
          <span className="mx-1">08.30</span>
          <span>WIB</span>
        </div>
        <span className="font-medium line-clamp-3">
          Pengumuman Kegiatan Kerja Bakti Warga Perum Cipta Graha Mandiri
          Mandiri Mandiri Mandiri Mandiri Mandiri Mandiri Mandiri Mandiri
        </span>
        <div className="flex w-full text-xs text-gray-400 gap-1 items-center">
          <div>
            <User />
          </div>
          <span className="">Sujatmiko Arafuru</span>
        </div>
      </div>
    </div>
    <div className=" relative flex w-full">
      <div className="fixed w-28 h-28 shadow-sm bg-gray-500 rounded-md"></div>
      <div className="ml-32 h-28 flex flex-col justify-between">
        <div className="text-xs text-gray-400">
          <span className="mr-1">17 Oktober 2024</span>-
          <span className="mx-1">08.30</span>
          <span>WIB</span>
        </div>
        <span className="font-medium line-clamp-3">
          Pengumuman Kegiatan Kerja Bakti Warga Perum Cipta Graha Mandiri
          Mandiri Mandiri Mandiri Mandiri Mandiri Mandiri Mandiri Mandiri
        </span>
        <div className="flex w-full text-xs text-gray-400 gap-1 items-center">
          <div>
            <User />
          </div>
          <span className="">Sujatmiko Arafuru</span>
        </div>
      </div>
    </div>
  </div>
}
