import { getMe } from "@/store/features/authSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { RootState } from "@/store/store";
import { useEffect } from "react";

// ✅ Đây là một custom hook hợp lệ
function useUserAuth() {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state: RootState) => state.auth);

  useEffect(() => {
    dispatch(getMe());
  }, [dispatch]);

  console.log("user", user);
  return !!user; // true nếu có user, false nếu không
}

export default useUserAuth;
