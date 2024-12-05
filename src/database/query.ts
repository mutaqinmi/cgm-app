import { db } from '@/database/connection';
import * as table from '@/database/schema';
import { and, desc, eq, gte, ilike, inArray, lte, or, sql } from 'drizzle-orm';

/**
 * get administrator data by phone number
 */
export const getAdministrator = async (phone_number: string) => {
    return await db.select().from(table.administrators).where(eq(table.administrators.phone, phone_number));
}

/**
 * get administrator phone data
 */
export const getAdministratorPhone = async () => {
    return await db.select({phone: table.administrators.phone}).from(table.administrators);
}

/**
 * get administrator data by admin id
 */
export const getAdministratorByID = async (admin_id: number) => {
    return await db.select().from(table.administrators).where(eq(table.administrators.admin_id, admin_id));
}

/**
 * set administrator token
 */
export const setAdministratorToken = async (admin_id: number, token: string) => {
    return await db.insert(table.admin_tokens).values({
        admin_id: admin_id,
        token: token,
    })
}

/**
 * get administrator token
 */
export const getAdminToken = async (token: string) => {
    return await db.select().from(table.admin_tokens).where(eq(table.admin_tokens.token, token));
}

/**
 * remove administrator token
 */
export const removeAdminToken = async (admin_id: number) => {
    return await db.delete(table.admin_tokens).where(eq(table.admin_tokens.admin_id, admin_id));
}

/**
 * update administrator phone
 */
export const updateAdministratorPhone = async (admin_id: number, phone: string) => {
    return await db.update(table.administrators).set({phone}).where(eq(table.administrators.admin_id, admin_id));
}

/**
 * update administrator password
 */
export const updateAdministratorPassword = async (admin_id: number, password: string) => {
    return await db.update(table.administrators).set({password}).where(eq(table.administrators.admin_id, admin_id));
}

/**
 * get all fees data by date
 */
export const getFees = async (date: string) => {
    return await db.select().from(table.fees).where(eq(table.fees.fee_date, date));
}

/**
 * get all fees data ordered by date
 */
export const getAllFees = async () => {
    return await db.select().from(table.fees).orderBy(desc(table.fees.fee_date));
}

/**
 * get all fees data ordered by date with limit
 */
export const getAllFeesLimited = async () => {
    return await db.select().from(table.fees).orderBy(desc(table.fees.fee_date)).limit(3);
}

/**
 * get fees data by id joined with payments and users
 */
export const getFeeByIdWithPagination = async (fee_id: number, pagination: number) => {
    return await db.select().from(table.fees).leftJoin(table.payments, eq(table.fees.fee_id, table.payments.fee_id)).leftJoin(table.users, eq(table.payments.user_id, table.users.user_id)).where(eq(table.fees.fee_id, fee_id)).limit(20).offset(20 * (pagination - 1));
}

/**
 * get fees data by id joined with payments and users
 */
export const getFeeById = async (fee_id: number) => {
    return await db.select().from(table.fees).leftJoin(table.payments, eq(table.fees.fee_id, table.payments.fee_id)).leftJoin(table.users, eq(table.payments.user_id, table.users.user_id)).where(eq(table.fees.fee_id, fee_id));
}

/**
 * get fees data by id joined with payments and users filtered by RT
 */
export const getFeesByRT = async (fee_id: number, filter: string) => {
    return await db.select().from(table.payments).leftJoin(table.users, eq(table.payments.user_id, table.users.user_id)).leftJoin(table.fees, eq(table.payments.fee_id, table.fees.fee_id)).where(and(eq(table.fees.fee_id, fee_id), eq(table.users.rt, filter)));
}

/**
 * get fees data by id joined with payments and users filtered by RT limited
 */
export const getFeesByRTWithPagination = async (fee_id: number, filter: string, pagination: number) => {
    return await db.select().from(table.payments).leftJoin(table.users, eq(table.payments.user_id, table.users.user_id)).leftJoin(table.fees, eq(table.payments.fee_id, table.fees.fee_id)).where(and(eq(table.fees.fee_id, fee_id), eq(table.users.rt, filter))).limit(20).offset(20 * (pagination - 1));
}

/**
 * get fees data by id joined with payments and users filtered by RT with status limited
 */
export const getFeesByRTWithStatusWithPagination = async (fee_id: number, filter: string, status: string, pagination: number) => {
    return await db.select().from(table.payments).leftJoin(table.users, eq(table.payments.user_id, table.users.user_id)).leftJoin(table.fees, eq(table.payments.fee_id, table.fees.fee_id)).where(and(eq(table.fees.fee_id, fee_id), eq(table.users.rt, filter), eq(table.payments.payment_description, status))).limit(20).offset(20 * (pagination - 1));
}

/**
 * get fees data by id joined with payments and users filtered by RT with status
 */
export const getFeesByRTWithStatus = async (fee_id: number, filter: string, status: string) => {
    return await db.select().from(table.payments).leftJoin(table.users, eq(table.payments.user_id, table.users.user_id)).leftJoin(table.fees, eq(table.payments.fee_id, table.fees.fee_id)).where(and(eq(table.fees.fee_id, fee_id), eq(table.users.rt, filter), eq(table.payments.payment_description, status)));
}

/**
 * get fees data by id joined with payments and users filtered by status limited
 */
export const getFeesByStatusWithPagination = async (fee_id: number, status: string, pagination: number) => {
    return await db.select().from(table.payments).leftJoin(table.users, eq(table.payments.user_id, table.users.user_id)).leftJoin(table.fees, eq(table.payments.fee_id, table.fees.fee_id)).where(and(eq(table.fees.fee_id, fee_id), eq(table.payments.payment_description, status))).limit(20).offset(20 * (pagination - 1));
}

/**
 * get fees data by id joined with payments and users filtered by status
 */
export const getFeesByStatus = async (fee_id: number, status: string) => {
    return await db.select().from(table.payments).leftJoin(table.users, eq(table.payments.user_id, table.users.user_id)).leftJoin(table.fees, eq(table.payments.fee_id, table.fees.fee_id)).where(and(eq(table.fees.fee_id, fee_id), eq(table.payments.payment_description, status)));
}

/**
 * get fees data by search query joined with payments and users by name or address
 */
export const searchFees = async (fee_id: number, keyword: string) => {
    return await db.select().from(table.payments).leftJoin(table.users, eq(table.payments.user_id, table.users.user_id)).leftJoin(table.fees, eq(table.payments.fee_id, table.fees.fee_id)).where(and(eq(table.fees.fee_id, fee_id), or(ilike(table.users.name, `%${keyword}%`), ilike(table.users.address, `%${keyword}%`))));
}

/**
 * get fees data by search query joined with payments and users by name or address by RT
 */
export const searchFeesByRT = async (fee_id: number, filter: string, keyword: string) => {
    return await db.select().from(table.payments).leftJoin(table.users, eq(table.payments.user_id, table.users.user_id)).leftJoin(table.fees, eq(table.payments.fee_id, table.fees.fee_id)).where(and(eq(table.fees.fee_id, fee_id), eq(table.users.rt, filter), or(ilike(table.users.name, `%${keyword}%`), ilike(table.users.address, `%${keyword}%`))));
}

/**
 * get all fees data with pagination
 */
export const getFeesWithPagination = async (pagination: number) => {
    return await db.select().from(table.fees).limit(10).offset(10 * (pagination - 1));
}

/**
 * get fees count
 */
export const getCountFees = async () => {
    return await db.$count(table.fees);
}

/**
 * set single fee data (per-month)
 */
export const setFee = async (date: string, amount: number) => {
    console.log(date, amount);
    return await db.insert(table.fees).values({
        fee_date: date,
        fee_amount: amount,
    }).returning();
}

/**
 * get multiple fees data by date
 */
export const getMultipleFees = async (date: string[]) => {
    return await db.select().from(table.fees).where(inArray(table.fees.fee_date, date));
}

/**
 * set multiple fees data by date
 */
export const setMultipleFees = async (date: string[], amount: number) => {
    const feeData = date.map((d: string) => {
        return {
            fee_date: d,
            fee_amount: amount,
        };
    });
    
    return await db.insert(table.fees).values(feeData).returning().onConflictDoNothing({target: table.fees.fee_date});
}

/**
 * get payment history joined with payments and users with pagination
 */
export const getPaymentsHistoryWithPagination = async (pagination: number) => {
    return await db.select().from(table.payments).leftJoin(table.users, eq(table.payments.user_id, table.users.user_id)).orderBy(desc(table.payments.last_update)).limit(5).offset(5 * (pagination - 1));
}

/**
 * get single payment history joined with payments and users
 */
export const getPaymentsHistory = async () => {
    return await db.select().from(table.payments).leftJoin(table.users, eq(table.payments.user_id, table.users.user_id)).orderBy(desc(table.payments.last_update));
}

export const getChartData = async (previousDate: string, currentDate: string) => {
    return await db.select().from(table.payments).leftJoin(table.fees, eq(table.payments.fee_id, table.fees.fee_id)).where(and(gte(table.payments.payment_date, previousDate), lte(table.payments.payment_date, currentDate)));
}

/**
 * get payments history count
 */
export const getPaymentsHistoryCount = async () => {
    return await db.$count(table.payments);
}

/**
 * get single payment history joined with payments and users filtered with payment id
 */
export const getPaymentById = async (payment_id: number) => {
    return await db.select().from(table.fees).leftJoin(table.payments, eq(table.fees.fee_id, table.payments.fee_id)).leftJoin(table.users, eq(table.payments.user_id, table.users.user_id)).where(eq(table.payments.payment_id, payment_id));
}

/**
 * update payment status and description
 */
export const updatePayment = async (payment_id: number, payment_status: boolean, payment_description: string) => {
    return await db.update(table.payments).set({payment_status, payment_description, last_update: sql`NOW()`}).where(eq(table.payments.payment_id, payment_id));
}

/**
 * get all users data
 */
export const getAllUsers = async () => {
    return await db.select().from(table.users);
}

/**
 * get user token
 */
export const getUserToken = async (token: string) => {
    return await db.select().from(table.user_tokens).where(eq(table.user_tokens.token, token));
}

/**
 * get user data by phone number
 */
export const getUser = async (phone_number: string) => {
    return await db.select().from(table.users).where(eq(table.users.phone, phone_number));
}

/**
 * set user token
 */
export const setUserToken = async (user_id: number, token: string) => {
    return await db.insert(table.user_tokens).values({
        user_id,
        token,
    })
}

/**
 * remove user token
 */
export const removeUserToken = async (user_id: number) => {
    return await db.delete(table.user_tokens).where(eq(table.user_tokens.user_id, user_id));
}

/**
 * get all users count
 */
export const getAllUsersCount = async () => {
    return await db.$count(table.users);
}

/**
 * get all users data with pagination
 */
export const getAllUsersWithPagination = async (pagination: number) => {
    return await db.select().from(table.users).limit(10).offset(10 * (pagination - 1));
}

/**
 * search users data by keyword
 */
export const searchUser = async (keyword: string) => {
    return await db.select().from(table.users).where(or(ilike(table.users.name, `%${keyword}%`), ilike(table.users.address, `%${keyword}%`)));
}

/**
 * get user data by id joined with payments and fees
 */
export const getUserData = async (user_id: number) => {
    return await db.select().from(table.users).leftJoin(table.payments, eq(table.users.user_id, table.payments.user_id)).leftJoin(table.fees, eq(table.payments.fee_id, table.fees.fee_id)).where(eq(table.users.user_id, user_id));
}

/**
 * get user data by id and fee id joined with payments and fees
 */
export const getUserDataWithFee = async (user_id: number, fee_id: number) => {
    return await db.select().from(table.users).leftJoin(table.payments, eq(table.users.user_id, table.payments.user_id)).leftJoin(table.fees, eq(table.payments.fee_id, table.fees.fee_id)).where(and(eq(table.users.user_id, user_id), eq(table.fees.fee_id, fee_id)));
}

/**
 * get user data by id
 */
export const getUserById = async (user_id: number) => {
    return await db.select().from(table.users).where(eq(table.users.user_id, user_id));
}

/**
 * get user data by id joined with payments and fees filtered with payment status
 */
export const getUserWithUndoneFilter = async (user_id: number) => {
    return await db.select().from(table.users).leftJoin(table.payments, eq(table.users.user_id, table.payments.user_id)).leftJoin(table.fees, eq(table.payments.fee_id, table.fees.fee_id)).where(and(eq(table.users.user_id, user_id), eq(table.payments.payment_status, false))).orderBy(desc(table.fees.fee_date));
}

/**
 * get user data by id joined with payments and fees filtered with status
 */
export const getUserDataWithStatus = async (user_id: number, status: string) => {
    return await db.select().from(table.users).leftJoin(table.payments, eq(table.users.user_id, table.payments.user_id)).leftJoin(table.fees, eq(table.payments.fee_id, table.fees.fee_id)).where(and(eq(table.users.user_id, user_id), eq(table.payments.payment_description, status))).orderBy(desc(table.fees.fee_date));
}

/**
 * create new user
 */
export const addNewUser = async (name: string, address: string, phone: string, rt: string) => {
    return await db.insert(table.users).values({
        name,
        address,
        phone,
        rt,
    }).returning();
}

/**
 * edit user
 */
export const updateUserData = async (user_id: number, name: string, address: string, phone: string, rt: string) => {
    return await db.update(table.users).set({
        name,
        address,
        phone,
        rt,
    }).where(eq(table.users.user_id, user_id));
}

/**
 * update user phone
 */
export const updateUserPhone = async (user_id: number, phone: string) => {
    return await db.update(table.users).set({phone}).where(eq(table.users.user_id, user_id));
}

/**
 * update user phone
 */
export const updateUserPassword = async (user_id: number, password: string) => {
    return await db.update(table.users).set({password}).where(eq(table.users.user_id, user_id));
}

/**
 * delete user
 */
export const deleteUser = async (user_id: number) => {
    return await db.delete(table.users).where(eq(table.users.user_id, user_id));
}

/**
 * set single payment data by users
 */
export const setSinglePayment = async (fee_id: number, user_id: number) => {
    return await db.insert(table.payments).values({
        fee_id,
        user_id,
    });
}

/**
 * set multiple payment data by users
 */
export const setPayment = async (fee_id: number, users: table.usersType[]) => {
    const data = users.map((user: table.usersType) => {
        return {
            fee_id,
            user_id: user.user_id,
        }
    });

    return await db.insert(table.payments).values(data);
}

/**
 * set multiple payment data by users and fees
 */
export const setPaymentWithMultpleID = async (fees: table.feesType[], users: table.usersType[]) => {
    const data = fees.map((fee: table.feesType) => {
        return users.map((user: table.usersType) => {
            return {
                fee_id: fee.fee_id,
                user_id: user.user_id,
            }
        })
    }).flat(2);

    return await db.insert(table.payments).values(data);
}

/**
 * update multiple payment data on single user
 */
export const setMultiplePayment = async (fee_id: number, user_id: number) => {
    return await db.update(table.payments).set({
        fee_id,
        user_id,
        payment_status: true,
        payment_description: "done",
    }).where(and(eq(table.payments.fee_id, fee_id), eq(table.payments.user_id, user_id)));
}