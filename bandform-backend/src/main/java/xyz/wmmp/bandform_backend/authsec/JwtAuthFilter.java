package xyz.wmmp.bandform_backend.authsec;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import xyz.wmmp.bandform_backend.data.User;
import xyz.wmmp.bandform_backend.repositories.UserRepository;

import java.io.IOException;
import java.time.Instant;
import java.util.List;

@Component
public class JwtAuthFilter extends OncePerRequestFilter {
    @Autowired private JwtUtil jwtUtil;
    @Autowired private UserRepository userRepository;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        Cookie[] cookies = request.getCookies();
        String token = null;
        if (cookies != null){
            for (Cookie c : cookies){
                if ("session".equals(c.getName())){
                    token = c.getValue();
                    break;
                }
            }
        }

        if(token != null){
            try {
                Claims claims = jwtUtil.validate(token);
                if (isSessionActive(claims)) {
                    String role = claims.get("role", String.class);
                    GrantedAuthority authority = new SimpleGrantedAuthority(role);
                    SecurityContextHolder.getContext().setAuthentication(new UsernamePasswordAuthenticationToken(claims.getSubject(), null,List.of(authority)));
                }
            }catch (JwtException e){
                //invalid token could log or leave anonymous.
            }
        }

        filterChain.doFilter(request, response);
    }

    /**
     * A structurally-valid JWT is only honored while it matches the server-side
     * session record. logout() and changePassword() clear jtiToken/tokenExpiry,
     * so a token whose jti no longer matches (or whose stored session has
     * expired) is rejected here even though its signature is still valid --
     * this is what makes logout and password change actually revoke sessions.
     */
    private boolean isSessionActive(Claims claims) {
        long userId;
        try {
            userId = Long.parseLong(claims.getSubject());
        } catch (NumberFormatException e) {
            return false;
        }
        User user = userRepository.findById(userId).orElse(null);
        if (user == null || user.getJtiToken() == null) {
            return false;
        }
        if (!user.getJtiToken().equals(claims.getId())) {
            return false;
        }
        Instant expiry = user.getTokenExpiry();
        return expiry != null && Instant.now().isBefore(expiry);
    }

}
