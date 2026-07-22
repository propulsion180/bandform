package xyz.wmmp.bandform_backend.services;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import jdk.vm.ci.meta.ExceptionHandler;
import xyz.wmmp.bandform_backend.data.*;
import xyz.wmmp.bandform_backend.repositories.GenreRepository;
import xyz.wmmp.bandform_backend.repositories.InstrumentRepository;
import xyz.wmmp.bandform_backend.repositories.UserRepository;

import java.util.ArrayList;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.Set;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

@Service
public class UserService {
    private static final Logger log = LoggerFactory.getLogger(UserService.class);
    private final UserRepository userRepository;
    private final GenreRepository genreRepository;
    private final InstrumentRepository instrumentRepository;
    private final GenreService genreService;
    private final InstrumentService instrumentService;
    private final BandMemberService bandMemberService;
    private final PasswordEncoder passwordEncoder;

    String emailRegex = "^[a-zA-Z0-9_+&*-]+(?:\\.[a-zA-Z0-9_+&*-]+)*@" + "(?:[a-zA-Z0-9-]+\\.)+[a-zA-Z]{2,7}$";
    Pattern p = Pattern.compile(emailRegex);

    @Autowired
    public UserService(UserRepository userRepository, GenreRepository genreRepository, InstrumentRepository instrumentRepository, GenreService genreService, InstrumentService instrumentService, BandMemberService bandMemberService, PasswordEncoder passwordEncoder){
        this.userRepository = userRepository;
        this.genreRepository = genreRepository;
        this.instrumentRepository = instrumentRepository;
        this.genreService = genreService;
        this.instrumentService = instrumentService;
        this.bandMemberService = bandMemberService;
        this.passwordEncoder = passwordEncoder;
    }

    public List<UserProfile> getAllUsers(){
        log.debug("All users requested");
        return userRepository.findAll().stream().map(UserProfile::from).collect(Collectors.toList());
    }

    public UserProfile getUserProfileById(Long id){
        log.debug("User with id: {}, being retrieved", id);
        User u = userRepository.findById(id).orElseThrow(() -> new NoSuchElementException("A user with this ID doesn't exist :("));
        return UserProfile.from(u);
    }

    public User getUserById(Long id){
        log.debug("User with id: {}, being retrieved", id);
        return userRepository.findById(id).orElseThrow(() -> new NoSuchElementException("user with this ID doesn't exist :(. This should only be triggered within nested calls."));
    }

    public Long deleteUser(Long id){
        log.debug("Deleting user with id: {}", id);
        userRepository.deleteById(id);
        log.debug("Deleted!!");
        return id;
    }

    public UserProfile createUser(String name, String email, String plainPassword, Integer age, String city, String country, String desc, List<String> genreNames, List<String> instrumentNames){
        log.debug("Creating user");
        if(userRepository.findByName(name).isPresent()){ throw new IllegalArgumentException("UserName already taken"); }
        User u = new User();
        u.setName(name);
        if(p.matcher(email).matches()){ throw new IllegalArgumentException("Invalid Email Address!"); }
        u.setEmail(email);
        if(plainPassword.length() < 8){ throw new IllegalArgumentException("Password needs to be larger than 8 characters"); }
        u.setPasswordHash(passwordEncoder.encode(plainPassword));
        if(age < 16 || age > 120){ throw new IllegalArgumentException("Must be 16 or older to use this service");}
        u.setAge(age);
        u.setCity(city);
        u.setCountry(country);
        u.setDescription(desc);
        u.setGenres(genreService.getGenresByNameAndAddIfNecessary(genreNames));
        u.setInstruments(instrumentService.getInstrumentsByNameAndAddIfNecessary(instrumentNames));
        u.setRole(UserType.NORMAL);
        return UserProfile.from(userRepository.save(u));
    }

    public Long updateUser(Long uid, String name, String email, Integer age, String city, String country, String desc, UserStatus status, List<String> genreNames, List<String> instrumentNames, List<BandMember> memberships, List<Notification> notifications){

       Long upid = (Long) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
       if(upid != uid){           
           User updater = userRepository.findById(upid).orElseThrow(() -> new IllegalArgumentException());
           if(updater.getRole() == UserType.NORMAL){throw IllegalAccessException("Unpriveledged access!!!! by: " + updater.getName() + " uid: " + upid);}
       }
       
        
       User u = userRepository.findById(uid).orElse(null);
       if(u == null){return null;}
       if(name != null && !name.isBlank()){u.setName(name);}
       if(p.matcher(email).matches()){ throw new IllegalArgumentException("Invalid Email Address!"); }
       if(email != null && !email.isBlank()){u.setEmail(email);}
       if(age != null){u.setAge(age);}
       if(city != null && !city.isBlank()){u.setCity(city);}
       if(country != null && !country.isBlank()){u.setCountry(country);}
       if(desc != null && !desc.isBlank()){u.setDescription(desc);}
       if(status != null){u.setStatus(status);}
       if(genreNames != null){u.setGenres(genreService.getGenresByNameAndAddIfNecessary(genreNames));}
       if(instrumentNames != null){u.setInstruments(instrumentService.getInstrumentsByNameAndAddIfNecessary(instrumentNames));}
       if(memberships != null){u.setBandMemberships(memberships);}
       if(notifications != null){u.setNotifications(notifications);}

       userRepository.save(u);
       return uid;
    }

}
