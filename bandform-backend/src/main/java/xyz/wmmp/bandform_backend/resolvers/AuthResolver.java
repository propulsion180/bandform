package xyz.wmmp.bandform_backend.resolvers;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.graphql.data.method.annotation.Argument;
import org.springframework.graphql.data.method.annotation.MutationMapping;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CookieValue;
import xyz.wmmp.bandform_backend.authsec.CustomUserDetailsService;
import xyz.wmmp.bandform_backend.authsec.JwtUtil;
import xyz.wmmp.bandform_backend.data.LoginResult;
import xyz.wmmp.bandform_backend.data.User;
import xyz.wmmp.bandform_backend.data.UserProfile;
import xyz.wmmp.bandform_backend.repositories.UserRepository;

import java.time.Duration;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.UUID;

@Controller
public class AuthResolver {

    @Autowired private CustomUserDetailsService userDetailsService;
    @Autowired private PasswordEncoder passwordEncoder;
    @Autowired private JwtUtil jwtUtil;
    @Autowired private UserRepository userRepository;

    @MutationMapping
    public LoginResult login(@Argument String name, @Argument String password, HttpServletResponse response){
        UserDetails userDetails = userDetailsService.loadUserByUsername(name);

        if(!passwordEncoder.matches(password, userDetails.getPassword())){ //check password
            throw new BadCredentialsException("Invalid credentials");
        }

        User user = userRepository.findByName(name).orElseThrow();

        String jti = UUID.randomUUID().toString();
        String token = jwtUtil.generateToken(jti, user.getId().toString(), user.getRole());

        user.setJtiToken(jti);
        user.setTokenExpiry(Instant.now().plus(1, ChronoUnit.DAYS));
        userRepository.save(user);

        ResponseCookie cookie = ResponseCookie.from("session", token)
                .httpOnly(true)
                .secure(true)
                .sameSite("Strict")
                .maxAge(Duration.ofDays(1))
                .path("/")
                .build();
        response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());

        return new LoginResult(UserProfile.from(user));
    }


    @MutationMapping
    public boolean logout(@CookieValue(value = "session", required = false) String token, HttpServletResponse response){
        if (token != null){
            try{
                Claims claims = jwtUtil.validate(token);
                String userId = claims.getSubject();
                User user = userRepository.findById(Long.getLong(userId)).orElseThrow();
                user.setJtiToken(null);
                user.setTokenExpiry(null);
            }catch (JwtException ignored){}
        }

        ResponseCookie clear = ResponseCookie.from("session", "")
                .maxAge(0).path("/").build();
        response.addHeader(HttpHeaders.SET_COOKIE, clear.toString());
        return true;
    }

    @MutationMapping
    public boolean changePassword(@CookieValue(value = "session", required = false) String token, @Argument String newPassword, HttpServletResponse response){
        if(newPassword == null || newPassword.isBlank()){ return false; }
        if (token != null){
            try{
                Claims claims = jwtUtil.validate(token);
                String userId = claims.getSubject();
                User user = userRepository.findById(Long.getLong(userId)).orElseThrow();
                user.setJtiToken(null);
                user.setTokenExpiry(null);
                user.setPasswordHash(passwordEncoder.encode(newPassword));
            }catch (JwtException ignored){}
        }

        ResponseCookie clear = ResponseCookie.from("session", "")
                .maxAge(0).path("/").build();
        response.addHeader(HttpHeaders.SET_COOKIE, clear.toString());

        return true;
    }
}
