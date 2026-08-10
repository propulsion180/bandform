package xyz.wmmp.bandform_backend.authsec;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwt;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.List;

@Component
public class JwtUtil {

    // HS256 requires a key of at least 256 bits (32 bytes).
    private static final int MIN_SECRET_BYTES = 32;

    @Value("${auth.jwt.secret}")
    private String secret;

    private static final long EXPIRY_MS = 24L * 60 * 60 * 1000;

    // Fail fast at startup rather than at first login if the secret is missing
    // or too weak for HS256.
    @PostConstruct
    void validateSecret() {
        if (secret == null || secret.getBytes(StandardCharsets.UTF_8).length < MIN_SECRET_BYTES) {
            throw new IllegalStateException(
                    "auth.jwt.secret (SERVER_JWT_SECRET) must be at least " + MIN_SECRET_BYTES + " bytes for HS256.");
        }
    }

    public String generateToken(String jti, String userId, String roles){
        return Jwts.builder()
                .id(jti)
                .subject(userId)
                .claim("role", roles)
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + EXPIRY_MS))
                .signWith(getKey())
                .compact();
    }

    public Claims validate(String token){
        return Jwts.parser()
                .verifyWith(getKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    private SecretKey getKey(){
        return Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
    }
}
