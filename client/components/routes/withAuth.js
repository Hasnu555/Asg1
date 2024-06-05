// import { useContext, useEffect } from "react";
// import { useRouter } from "next/router";
// import { UserContext } from "../../context/UserContext"; // Ensure the correct path

// const withAuth = (WrappedComponent) => {
//   return (props) => {
//     const [state] = useContext(UserContext);
//     const router = useRouter();

//     useEffect(() => {
//       if (!state || !state.token) {
//         router.push("/login");
//       }
//     }, [state, router]);

//     if (state && state.token) {
//       return <WrappedComponent {...props} />;
//     }

//     return null; // Or a loading spinner while checking auth status
//   };
// };

// export default withAuth;
