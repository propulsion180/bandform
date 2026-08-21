package xyz.wmmp.bandform_backend;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.HashMap;
import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * Pins the exception->error mapping: an IllegalArgumentException from a resolver
 * (here, createUser's invalid-email check) must surface as a BAD_REQUEST that
 * carries the real message, not the generic INTERNAL_ERROR that unhandled
 * exceptions produce.
 */
class GraphQlExceptionResolverIT extends AbstractGraphQlIT {

    private static final String CREATE_USER = """
            mutation($email:String!){
              createUser(
                name:"Zoe", email:$email, plainPassword:"Abcdef12", age:25,
                city:"Auckland", country:"New Zealand", description:"d",
                genres:[], instruments:[]
              ){ id }
            }
            """;

    @BeforeEach
    void clean() {
        userRepository.deleteAll();
    }

    @Test
    void invalidEmailSurfacesAsBadRequestWithTheRealMessage() {
        Map<String, Object> vars = new HashMap<>();
        vars.put("email", "not-an-email");

        Gql r = post(CREATE_USER, vars, null);

        assertThat(r.hasErrors()).isTrue();
        assertThat(r.firstErrorType()).isEqualTo("BAD_REQUEST");
        assertThat(r.firstErrorMessage()).contains("Invalid Email Address");
    }

    @Test
    void aValidRequestSucceedsThroughTheSamePath() {
        Map<String, Object> vars = new HashMap<>();
        vars.put("email", "zoe@example.com");

        Gql r = post(CREATE_USER, vars, null);

        assertThat(r.hasErrors()).isFalse();
        assertThat(r.data().path("createUser").path("id").asText()).isNotBlank();
    }
}
