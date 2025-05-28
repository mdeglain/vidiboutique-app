import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

// import axios from '@/libs/axios'; // Removed as the file is deleted

// import { categoriesSuccess } from '@/features/category/category.slice'; // Removed
import { selectIsAuth } from '@/features/auth/auth.selector';
// import { addressesSuccess } from '@/features/address/address.slice'; 
// No import for initCart here as it's fully removed
// import { selectUser } from '@/features/auth/user.selector'; // user from selectUser is not used here anymore
import { setUser } from '@/features/auth/user.slice'; // For setting user data
import { authSuccess, disconnect } from '@/features/auth/auth.slice'; // For setting auth state
import { useGetMeQuery } from '@/features/user/userApi'; // RTK Query hook for getMe
// import { cartApi } from '@/features/cart/cartApi'; 

export const GetDefaultData = () => {
    const dispatch = useDispatch();
    const isAuthenticated = useSelector(selectIsAuth); // Still useful to gate other initial fetches if any were left

    // Call useGetMeQuery unconditionally. 
    // If no token, baseQueryWithReauth should handle it gracefully (e.g., not error out, just return no data or a specific error).
    // The `skip` parameter can be problematic if isAuthenticated depends on this query's success.
    const { data: userData, isSuccess, isError, isLoading, error } = useGetMeQuery();

    useEffect(() => {
        if (isSuccess && userData) {
            // Assuming userData is the user object directly or userData.data if nested
            // Adjust based on actual API response structure for /users/me
            const userDetail = userData.data || userData; 
            dispatch(setUser(userDetail));
            
            // To set isAuthenticated = true, we can reuse authSuccess.
            // It expects access_token and refresh_token. We don't get new tokens from /users/me.
            // We are essentially confirming the existing tokens are valid.
            // A more semantically correct action like `setAuthenticated(true)` might be better.
            // For now, let's assume `authSuccess` can be called with existing tokens if needed,
            // or we simply rely on the presence of user data to imply authentication for other parts of the app.
            // If `auth.slice.js`'s `accessToken` is only set on login/refresh, then calling authSuccess
            // without new tokens might be incorrect.
            // However, the main goal is to populate user data.
            // If `baseQueryWithReauth` successfully completes a request, it implies tokens are valid.
            // Let's dispatch authSuccess with dummy/existing tokens to mark as authenticated.
            // This is a bit of a workaround. A dedicated `setAuthenticated(true)` would be cleaner.
            // Or, if `auth.accessToken` is already in store from persisted state, we might not need to dispatch authSuccess.
            // Let's assume for now that if getMe is successful, the tokens in store are valid and user is set.
            // No explicit authSuccess needed here if other parts of app derive "is authenticated" from presence of user data + tokens.
            // If `authSuccess` is strictly for login action, then we should avoid calling it here.
            // The `isAuthenticated` selector should ideally rely on `accessToken` in `auth.slice.js`.
            // If `getMe` succeeds, it means `accessToken` was valid.

            // console.log("User data set from GetDefaultData:", userDetail);

        } else if (isError) {
            // If getMe fails (e.g., 401 even after reauth), it implies tokens are invalid.
            // baseQueryWithReauth should have already dispatched `disconnect` if refresh failed.
            // If it's another error, we might not want to disconnect.
            // For a 401 that slips through or if reauth itself fails and doesn't lead to disconnect in baseQuery,
            // explicitly disconnecting here might be an option.
            // However, baseQueryWithReauth is designed to handle this.
            // console.error("Error fetching user data in GetDefaultData:", error);
            // If error status is 401, means re-auth failed definitively.
            if (error?.status === 401) {
                 dispatch(disconnect());
            }
        }
    }, [userData, isSuccess, isError, dispatch, error]);

    // This component's remaining role is primarily to trigger the useGetMeQuery early.
    // Other data fetching (categories, etc.) has been removed.
    // If isAuthenticated is used to skip other initial fetches (that are not yet RTK), it can stay.
    // Otherwise, if this is the *only* thing it does, its logic could be moved.

    return null; // This component does not render anything
};