'use client'
import LoadingAnimation from "@/components/loading-animation";
import Navbar from "@/components/navbar";
import { Coins, HandCoins, User } from "@phosphor-icons/react";
import axios, { AxiosError, AxiosResponse } from "axios";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect } from "react";
import { create } from "zustand";
import * as  schema from "@/database/schema";
import IconButton from "@/components/icon-button";
import * as date from "@/lib/date";
import IuranMenu from "@/components/iuran-menu";
import Chip from "@/components/chip";

interface ComponentState {
    isLoading: boolean,
    chipIndex: number,
    setIsLoading: (isLoading: boolean) => void,
    setChipIndex: (chipIndex: number) => void,
}

interface UserData {
    data: [],
    setData: (data: []) => void,
}

const useComponentState = create<ComponentState>(set => ({
    isLoading: false,
    chipIndex: 0,
    setIsLoading: (isLoading: boolean) => set({isLoading}),
    setChipIndex: (chipIndex: number) => set({chipIndex}),
}))

const useUserData = create<UserData>(set => ({
    data: [],
    setData: (data: []) => set({data}),
}))

export default function Page(){
    const searchParams = useSearchParams();
    const route = useRouter();
    const {chipIndex, isLoading, setChipIndex, setIsLoading} = useComponentState();
    const {setData} = useUserData();
    const data = useUserData(state => state.data as {fees: schema.feesType, payments: schema.paymentsType, users: schema.usersType}[]);

    const groupByYear = (data: {fees: schema.feesType, payments: schema.paymentsType, users: schema.usersType}[]) => {
        return data.reduce((acc, item) => {
            const year = item.fees.fee_date!.split('-')[0];
            if (!acc[year]) {
                acc[year] = [];
            }
            acc[year].push(item);
            return acc;
        }, {} as { [key: string]: {fees: schema.feesType, payments: schema.paymentsType, users: schema.usersType}[] });
    };

    const get_user_api = useCallback(async (user_id: string) => {
        setIsLoading(true);

        const host = window.location.protocol + "//" + window.location.host + "/api/v1";
        return await axios.get(`${host}/admin/users?user_id=${user_id}`, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem('token')}`
            }
        }).then((res: AxiosResponse) => {
            const { data } = res.data as {data: []};
            setData(data);
        }).catch((error: AxiosError) => {
            const { message } = error.response?.data as {message: string};
            console.log(message);
        }).finally(() => setIsLoading(false));
    }, [])

    useEffect(() => {
        const user_id = searchParams.get('user_id');
        if(user_id){
            get_user_api(user_id);
        }
    }, [searchParams])

    const groupData = groupByYear(data);

    return isLoading ? <LoadingAnimation/> : <>
        <Navbar/>
        <div className="mt-24 px-6">
            <div className="flex flex-col justify-center items-center gap-4">
                <div className="w-32 h-32 bg-blue-300 text-blue-500 rounded-full flex justify-center items-center"><User size={45}/></div>
                <div className="flex flex-col justify-center items-center gap-1">
                    <span className="text-sm">{data[0] ? data[0].users.address! : ""}</span>
                    <h1 className="text-xl font-semibold">{data[0] ? data[0].users.name! : ""}</h1>
                    <span className="text-sm">{data[0] ? data[0].users.phone! : ""}</span>
                </div>
                <div className="w-full my-4 flex justify-evenly items-start">
                    <IconButton icon={<HandCoins/>} title="Bayar Iuran"/>
                    <IconButton icon={<Coins/>} title="Iuran Jangka Panjang"/>
                </div>
            </div>
            <div className="flex flex-col mt-4 gap-4">
                <h2 className="font-semibold text-lg">Riwayat Iuran</h2>
                {/* <div className="flex gap-2">
                    <Chip label="Semua" active={chipIndex === 0 ? true : false} onClick={() => {setChipIndex(0)}}/>
                    <Chip label="Lunas" active={chipIndex === 1 ? true : false} onClick={() => {setChipIndex(1)}}/>
                    <Chip label="Belum Lunas" active={chipIndex === 2 ? true : false} onClick={() => {setChipIndex(2)}}/>
                </div> */}
                <div className="flex flex-col-reverse gap-4">
                    {Object.keys(groupData).map((year) => (
                        <div key={year}>
                            <h2 className="text-lg font-semibold mb-2 text-gray-500">{year}</h2>
                            <div className="flex flex-col gap-4">
                                {groupData[year].map((data: {fees: schema.feesType, payments: schema.paymentsType, users: schema.usersType}) => {
                                    return <IuranMenu key={data.fees.fee_id} month={date.toString(data.fees.fee_date!)} title={`Iuran Bulanan ${date.toString(data.fees.fee_date!).split(' ')[0]}`} onClick={() => route.push(`/cgm-admin/users/detail/iuran?fee_id=${data.fees.fee_id}`)}/>
                                })}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    </>
}