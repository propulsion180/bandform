package xyz.wmmp.bandform_backend;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.crypto.password.PasswordEncoder;
import xyz.wmmp.bandform_backend.data.User;
import xyz.wmmp.bandform_backend.data.UserType;
import xyz.wmmp.bandform_backend.repositories.UserRepository;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static org.assertj.core.api.Assertions.fail;

/**
 * Base for GraphQL-over-HTTP integration tests: boots the full application on a
 * random port and drives it through the JDK HttpClient so real Set-Cookie /
 * Cookie headers round-trip through the servlet layer (AuthResolver reads them
 * via RequestContextHolder, and JwtAuthFilter authenticates from the cookie).
 */
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
public abstract class AbstractGraphQlIT {

    @Value("${local.server.port}")
    protected int port;

    @Autowired protected UserRepository userRepository;
    @Autowired protected PasswordEncoder passwordEncoder;

    private final ObjectMapper mapper = new ObjectMapper();
    private final HttpClient http = HttpClient.newHttpClient();

    /** Minimal parsed GraphQL response. */
    public final class Gql {
        private final JsonNode body;
        private final HttpResponse<String> response;

        Gql(JsonNode body, HttpResponse<String> response) {
            this.body = body;
            this.response = response;
        }

        public JsonNode data() { return body.path("data"); }
        public boolean hasErrors() { return body.has("errors") && body.get("errors").size() > 0; }
        public String firstErrorMessage() { return body.path("errors").path(0).path("message").asText(); }
        public String firstErrorType() {
            return body.path("errors").path(0).path("extensions").path("classification").asText();
        }

        /** All Set-Cookie header values on the response. */
        public List<String> setCookies() { return response.headers().allValues("set-cookie"); }

        /** The `session=<token>` pair from Set-Cookie, or null. */
        public String sessionCookie() {
            for (String c : setCookies()) {
                if (c.startsWith("session=")) {
                    return c.split(";", 2)[0];
                }
            }
            return null;
        }
    }

    protected Gql post(String query, Map<String, Object> variables, String cookie) {
        Map<String, Object> payload = new HashMap<>();
        payload.put("query", query);
        if (variables != null) {
            payload.put("variables", variables);
        }
        try {
            HttpRequest.Builder builder = HttpRequest.newBuilder()
                    .uri(URI.create("http://localhost:" + port + "/graphql"))
                    .header("Content-Type", "application/json")
                    .POST(HttpRequest.BodyPublishers.ofString(mapper.writeValueAsString(payload)));
            if (cookie != null) {
                builder.header("Cookie", cookie);
            }
            HttpResponse<String> resp = http.send(builder.build(), HttpResponse.BodyHandlers.ofString());
            return new Gql(mapper.readTree(resp.body()), resp);
        } catch (Exception e) {
            return fail("GraphQL request failed", e);
        }
    }

    protected Gql post(String query, Map<String, Object> variables) {
        return post(query, variables, null);
    }

    /** Persists a user whose raw password already meets the policy. */
    protected User seedUser(String name, String rawPassword, UserType role) {
        User u = new User();
        u.setName(name);
        u.setEmail(name.toLowerCase().replaceAll("\\s+", "") + "@test.example");
        u.setPasswordHash(passwordEncoder.encode(rawPassword));
        u.setAge(30);
        u.setCity("Auckland");
        u.setCountry("New Zealand");
        u.setRole(role);
        return userRepository.save(u);
    }

    protected static final String LOGIN = """
            mutation($n:String!,$p:String!){ login(name:$n,password:$p){ user { id name role } } }
            """;

    /** Logs in and returns the session cookie, failing if login didn't succeed. */
    protected String login(String name, String password) {
        String cookie = post(LOGIN, Map.of("n", name, "p", password), null).sessionCookie();
        if (cookie == null) {
            return fail("Expected a session cookie from login for user " + name);
        }
        return cookie;
    }
}
