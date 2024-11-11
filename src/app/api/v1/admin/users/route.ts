import { verifyToken } from '@/lib/auth';
import { NextRequest as req, NextResponse as res } from 'next/server';
import * as query from '@/database/query';

export async function GET(req: req){
    // get query params from request
    const user_id = req.nextUrl.searchParams.get('user_id');
    const search = req.nextUrl.searchParams.get('search');
    const filtered = req.nextUrl.searchParams.get('filtered');

    try {
        // check if token exists
        const verified_token = await verifyToken(req);
        if(verified_token === 0){
            return res.json({
                message: 'token tidak valid',
            }, {
                status: 401
            })
        }

        // get user data with undone filter
        if(user_id && filtered){
            // get user data with undone filter
            const users = await query.getUserWithUndoneFilter(parseInt(user_id));

            // return response
            return res.json({
                message: 'success',
                data: users,
            }, {
                status: 200
            })
        }

        // search user
        if(search){
            // search user
            const users = await query.searchUser(search);

            // return response
            return res.json({
                message: 'success',
                data: users,
            }, {
                status: 200
            })
        }

        // get user data by user_id
        if(user_id){
            // get user data by user_id
            const user = await query.getUserData(parseInt(user_id));

            // return response
            return res.json({
                message: 'success',
                data: user,
            }, {
                status: 200
            })
        }

        // get all users
        const users = await query.getAllUsers();

        // return response
        return res.json({
            message: 'success',
            data: users,
        }, {
            status: 200
        })
    } catch (error) {
        // log error
        console.log(error);

        // return response
        return res.json({
            message: "an error occured, see console for details",
        }, {
            status: 500
        })
    }
}