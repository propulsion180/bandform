import { graphql } from "./gql";



export const LOGIN = graphql(`
   mutation Login($name: String!, $password: String!){
    login(name: $name, password: $password){
       user {
         id
         name
         email
         age
         city
         country
         description
         role
         genres{
           name 
         }
         instruments{
           name
         }
         bandMemberships{
           band{
             name
             description
             genres{
               name
             }
             members{
               user{
                 name
               }
             }
             openPositions{
               instrument{
                 name
               }
               filled
             }
           }
           joinedDate
         }
       }
    }
  }
  `);


export const LOGOUT = graphql(`
    mutation Logout{
      logout
    }
  `);


export const SIGNUP = graphql(`  
    mutation CreateUser($name: String!, $email: String!, $plainPassword: String!, $age: Int!, $city: String!, $country: String!, $description: String!, $genres: [String!]!, $instruments: [String!]!) {
      createUser(name: $name, email: $email, plainPassword: $plainPassword, age: $age, city: $city, country: $country, description: $description, genres: $genres, instruments: $instruments){
        id
        name
      }
    }
  `);

export const UPDATE_USER = graphql(`
    mutation UpdateUser($id: ID!, $name: String, $age: Int, $city: String, $country: String, $description: String, $genres: [String!], $instruments: [String!]){
      updateUser(id: $id, name: $name, age: $age, city: $city, country: $country, description: $description, genres: $genres, instruments: $instruments)
    }
  `);


export const DELETE_USER = graphql(`
    mutation DeleteUser($id: ID!){
      deleteUser(id: $id)
    }
  `);


export const CREATE_BAND = graphql(`  
    mutation CreateBand($name: String!, $description: String!, $city: String!, $country: String!, $genres: [String!]!){
      createBand(name: $name, description: $description, city: $city, country: $country, genres: $genres){
        name
        description
        city
        country
        genres{
          name
        }
        members{
          user{
            name
          }
        }
        openPositions{
          id
          instrument{
            name
          }
          description
        }
        joinRequests{
          id
          user{
            name
          }
          interestedInstruments{
            name
          }
        }
      }
    }
  `);

export const UPDATE_BAND = graphql(`
    mutation UpdateBand($id: ID!, $name: String, $description: String, $city: String, $country: String, $genres: [String!]){
      updateBand(id: $id, name: $name, description: $description, city: $city, country: $country, genres: $genres)
    }
  `);


export const DELETE_BAND = graphql(`
    mutation DeleteBand($id: ID!){
      deleteUser(id: $id)
    }
  `);



export const DELETE_BAND_MEMBER = graphql(`
    mutation DeleteBandMember($bmID: ID!){
      deleteBandMember(bmID: $bmID)
    }
  `);

export const CREATE_BAND_POSITION = graphql(`
    mutation CreateBandPosition($bandId: ID!, $instrumentName: String!, $description: String!){
      createBandPosition(bandId: $bandId, instrumentName: $instrumentName, description: $description){
        instrument{
          name
        }
        description
      }
    }
  `);

export const UPDATE_BAND_POSITION = graphql(`
    mutation UpdateBandPosition($bpId: ID!, $bId: ID, $instrument: String, $description: String, $filled: Boolean, $fillerId: ID!){
      updateBandPosition(bpId: $bpId, bId: $bId, instrument: $instrument, description: $description, filled: $filled, fillerId: $fillerId)
    }
  `);

export const DELETE_BAND_POSITION = graphql(`
    mutation DeleteBandPosition($pbId: ID!){
      deleteBandPosition(pbId: $pbId)
    }
  `);

export const CREATE_JOIN_REQUEST = graphql(`
    mutation CreateJoinRequest($uID: ID!, $bID: ID!, $bpID: ID!, $interestedInstruments: [String!], $message: String){
      createJoinRequest(uID: $uID, bID: $bID, bpID: $bpID, interestedInstruments: $interestedInstruments, message: $message){
        status
      }
    }
  `);

export const DELETE_JOIN_REQUEST = graphql(`  
    mutation DeleteJoinRequest($id: ID!){
      deleteJoinRequest(id: $id)
    }
  `);

