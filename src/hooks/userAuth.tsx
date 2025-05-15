import { getMe } from "@/store/features/authSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { RootState } from "@/store/store";
import React, { useEffect } from "react";
import { useSelector } from "react-redux";

function userAuth() {
    const dispatch = useAppDispatch();
    const { user } = useAppSelector((state: RootState) => state.auth);
    useEffect(() => {
        dispatch(getMe());
    }, []);
    console.log("user", user);
    if (user) {
        return true;
    } else {
        return false;
    }
}

export default userAuth;
