package xyz.wmmp.bandform_android

import com.apollographql.apollo.ApolloClient

object ApolloClientInstance{
    val apolloClient = ApolloClient.Builder()
        .serverUrl("http://10.0.2.2:8080/graphql")
        .build()
}
