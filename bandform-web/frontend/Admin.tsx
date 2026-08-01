import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Description from "./Description";
import { LoginMutation } from "./gql/graphql";
import { graphql } from "./gql";
import { DELETE_BAND, DELETE_BAND_MEMBER, DELETE_BAND_POSITION, DELETE_JOIN_REQUEST, DELETE_USER } from "./Queries"

interface AdminProps {
  user: LoginMutation['login']['user'] | null;
}

export default function Admin({ user }: AdminProps) {
  const navigate = useNavigate();
  const [page, setPage] = useState<string>("desc");

  if(user.role == null || user.role == "NORMAL"){
    navigate("/");
  }
  
  // const deleteImage = async (filepath: string) => {
  //   try {
  //     const response = await fetch("https://" + host + "/delimage", {
  //       method: "DELETE",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({ filepath }),
  //       credentials: "include",
  //     });

  //     if (!response.ok) {
  //       throw new Error("Failed to delete image");
  //     }
  //     // window.location.href = "/";
  //     window.location.reload();
  //   } catch (error) {
  //     console.error("Error deleting image: ", error);
  //     alert("error deleting image");
  //   }
  // };

  return (
    // <>
    //   <div className="admin-buttons-area">
    //     <a
    //       className="nav-button"
    //       onClick={() => {
    //         setPage("add");
    //       }}
    //     >
    //       Add an Image
    //     </a>
    //     <a
    //       className="nav-button"
    //       onClick={() => {
    //         setPage("desc");
    //       }}
    //     >
    //       Description
    //     </a>
    //   </div>

    //   {page == "add" && true && <AddImage host={host} />}
    //   {page == "up" && true && <UpdateImage image={img} host={host} />}

    //   <table className="description-table">
    //     <thead>
    //       <tr>
    //         <th>Filepath:</th>
    //         <th>Description</th>
    //         <th>Location</th>
    //         <th>Delete</th>
    //         <th>Update</th>
    //       </tr>
    //     </thead>
    //     <tbody>
    //       {Array.from(images).map(([key, value]) => (
    //         <tr>
    //           <td>{value.filepath}</td>
    //           <td>{value.description}</td>
    //           <td>{value.location}</td>
    //           <td>
    //             <a
    //               className="small-button"
    //               onClick={() => {
    //                 deleteImage(value.filepath);
    //               }}
    //             >
    //               Delete
    //             </a>
    //           </td>
    //           <td>
    //             <a
    //               className="small-button"
    //               onClick={() => {
    //                 setImg(value);
    //                 setPage("up");
    //               }}
    //             >
    //               Update
    //             </a>
    //           </td>
    //         </tr>
    //       ))}
    //     </tbody>
    //   </table>
    // </>
    //
    <></>
  );
}
