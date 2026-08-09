package xyz.wmmp.bandform_backend.resolvers;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.graphql.data.method.annotation.Argument;
import org.springframework.graphql.data.method.annotation.MutationMapping;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Controller;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;
import xyz.wmmp.bandform_backend.authsec.JwtUtil;
import xyz.wmmp.bandform_backend.authsec.PasswordPolicy;
import xyz.wmmp.bandform_backend.data.LoginResult;
import xyz.wmmp.bandform_backend.data.User;
import xyz.wmmp.bandform_backend.data.UserProfile;
import xyz.wmmp.bandform_backend.repositories.UserRepository;
import xyz.wmmp.bandform_backend.services.BandAuthorizationService;
import xyz.wmmp.bandform_backend.services.WsTicketService;

import java.time.Duration;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.UUID;

@Controller
public class AuthResolver {

    @Autowired private PasswordEncoder passwordEncoder;
    @Autowired private JwtUtil jwtUtil;
    @Autowired private UserRepository userRepository;
    @Autowired private WsTicketService wsTicketService;
    @Autowired private BandAuthorizationService bandAuthorizationService;
    @Autowired private PasswordPolicy passwordPolicy;

    @Value("${auth.cookie.secure:false}")
    private boolean secureCookie;

    private static HttpServletResponse currentResponse(){
        return ((ServletRequestAttributes) RequestContextHolder.currentRequestAttributes()).getResponse();
    }

    private static String sessionCookieValue(){
        HttpServletRequest request = ((ServletRequestAttributes) RequestContextHolder.currentRequestAttributes()).getRequest();
        Cookie[] cookies = request.getCookies();
        if(cookies == null){ return null; }
        for(Cookie c : cookies){
            if("session".equals(c.getName())){ return c.getValue(); }
        }
        return null;
    }

    // After this many consecutive failed attempts the account is locked and
    // must be unlocked by an admin (see UserResolver.unlockUser).
    private static final int MAX_FAILED_ATTEMPTS = 5;

    @MutationMapping
    public LoginResult login(@Argument String name, @Argument String password){
        // Treat "user not found", "wrong password", and "locked" identically so a
        // caller can't distinguish them and enumerate accounts or probe lock state.
        User user = userRepository.findByName(name)
                .orElseThrow(() -> new BadCredentialsException("Invalid username or password"));

        if(user.isLocked()){
            throw new BadCredentialsException("Invalid username or password");
        }

        if(!passwordEncoder.matches(password, user.getPasswordHash())){ //check password
            int attempts = user.getFailedLoginAttempts() + 1;
            user.setFailedLoginAttempts(attempts);
            if(attempts >= MAX_FAILED_ATTEMPTS){
                user.setLocked(true);
            }
            userRepository.save(user);
            throw new BadCredentialsException("Invalid username or password");
        }

        // Successful login: clear the failed-attempt counter.
        user.setFailedLoginAttempts(0);

        String jti = UUID.randomUUID().toString();
        String token = jwtUtil.generateToken(jti, user.getId().toString(), user.getRole().toString());

        user.setJtiToken(jti);
        user.setTokenExpiry(Instant.now().plus(1, ChronoUnit.DAYS));
        userRepository.save(user);

        ResponseCookie cookie = ResponseCookie.from("session", token)
                .httpOnly(true)
                .secure(secureCookie)
                .sameSite("Strict")
                .maxAge(Duration.ofDays(1))
                .path("/")
                .build();
        currentResponse().addHeader(HttpHeaders.SET_COOKIE, cookie.toString());

        return new LoginResult(UserProfile.from(user));
    }


    @MutationMapping
    public boolean logout(){
        String token = sessionCookieValue();
        if (token != null){
            try{
                Claims claims = jwtUtil.validate(token);
                String userId = claims.getSubject();
                User user = userRepository.findById(Long.parseLong(userId)).orElseThrow();
                user.setJtiToken(null);
                user.setTokenExpiry(null);
                userRepository.save(user);
            }catch (JwtException ignored){}
        }

        ResponseCookie clear = ResponseCookie.from("session", "")
                .maxAge(0).path("/").build();
        currentResponse().addHeader(HttpHeaders.SET_COOKIE, clear.toString());
        return true;
    }

    @PreAuthorize("isAuthenticated()")
    @MutationMapping
    public boolean changePassword(@Argument String newPassword){
        passwordPolicy.validate(newPassword);
        String token = sessionCookieValue();
        if (token != null){
            try{
                Claims claims = jwtUtil.validate(token);
                String userId = claims.getSubject();
                User user = userRepository.findById(Long.parseLong(userId)).orElseThrow();
                user.setJtiToken(null);
                user.setTokenExpiry(null);
                user.setPasswordHash(passwordEncoder.encode(newPassword));
                userRepository.save(user);
            }catch (JwtException ignored){}
        }

        ResponseCookie clear = ResponseCookie.from("session", "")
                .maxAge(0).path("/").build();
        currentResponse().addHeader(HttpHeaders.SET_COOKIE, clear.toString());

        return true;
    }

    @PreAuthorize("isAuthenticated()")
    @MutationMapping
    public String issueWsTicket(){
        return wsTicketService.issue(bandAuthorizationService.currentUserId());
    }
}
