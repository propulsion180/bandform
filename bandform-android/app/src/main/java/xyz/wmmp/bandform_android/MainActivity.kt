package xyz.wmmp.bandform_android

import android.os.Bundle
import android.util.Log
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.tooling.preview.Preview
import androidx.lifecycle.lifecycleScope
import com.apollographql.apollo.ApolloClient
import kotlinx.coroutines.launch
import xyz.wmmp.bandform.GetUsersQuery
import xyz.wmmp.bandform.type.User
import xyz.wmmp.bandform_android.ui.theme.BandformandroidTheme

class MainActivity : ComponentActivity() {

    private val apolloClient = ApolloClient.Builder()
        .serverUrl("http://192.168.1.207:8080/graphql")
        .build()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        var x = "Hi"

        lifecycleScope.launch {
            x = apolloClient.query(GetUsersQuery()).execute().toString()
        }
        
        enableEdgeToEdge()
        setContent {
            BandformandroidTheme {
                Scaffold(modifier = Modifier.fillMaxSize()) { innerPadding ->
                    Greeting(
                        name = x,
                        modifier = Modifier.padding(innerPadding)
                    )
                }
            }
        }
    }
}

@Composable
fun Greeting(name: String, modifier: Modifier = Modifier) {
    Text(
        text = "Hello $name!",
        modifier = modifier
    )
}


//@Composable
//suspend fun gqlquery(){
//    val s = ApolloClientInstance.apolloClient.query(GetUsersQuery()).execute().toString()
//    Text(
//        text = s
//    )
//}

@Preview(showBackground = true)
@Composable
fun GreetingPreview() {
    BandformandroidTheme {
        Greeting("Android")
    }
}