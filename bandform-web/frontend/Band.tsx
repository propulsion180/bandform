import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LoginMutation } from "./gql/graphql";

interface BandProps{
  user: LoginMutation['login']['user'] | null;
}

export default function Band({ user }: BandProps){

  const bands = user?.bandMemberships.map(membership => membership?.band);

  
  return(

    <>
      {bands.map(b=>(
        <>
          You are part of {b?.name}. 
        </>
      ))}
    </>
    
  );
}
