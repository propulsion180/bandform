package xyz.wmmp.bandform_backend.authsec;

import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import xyz.wmmp.bandform_backend.repositories.UserRepository;

public class CustomUserDetailsService implements UserDetailsService {
    private final UserRepository userRepository;

    public CustomUserDetailsService(UserRepository userRepository){
        this.userRepository = userRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        xyz.wmmp.bandform_backend.data.User user = userRepository.findByName(username).orElseThrow(() -> new UsernameNotFoundException("User not found with Name: " + username));

        return User.builder()
                .username(user.getName())
                .password(user.getPasswordHash())
                .roles(user.getRole().toString())
                .accountLocked(user.isLocked())
                .build();
    }
}
