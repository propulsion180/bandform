package xyz.wmmp.bandform_backend.services;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import xyz.wmmp.bandform_backend.data.Genre;
import xyz.wmmp.bandform_backend.data.Instrument;
import xyz.wmmp.bandform_backend.data.User;
import xyz.wmmp.bandform_backend.repositories.GenreRepository;
import xyz.wmmp.bandform_backend.repositories.InstrumentRepository;
import xyz.wmmp.bandform_backend.repositories.UserRepository;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;
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

    public List<User> getAllUsers(){
        log.debug("All users requested");
        return userRepository.findAll();
    }

    public User getUserById(Long id){
        log.debug("User with id: {}, being retrieved", id);
        return userRepository.findById(id).orElse(null);
    }

    public Long deleteUser(Long id){
        log.debug("Deleting user with id: {}", id);
        userRepository.deleteById(id);
        log.debug("Deleted!!");
        return id;
    }

    public User createUser(String name, String email, String plainPassword, Integer age, String city, String country, String desc, List<String> genreNames, List<String> instrumentNames){
        log.debug("Creating user");
        if(userRepository.findByName(name).isPresent()){ throw new IllegalArgumentException("UserName already taken"); }
        User u = new User();
        u.setName(name);
        u.setEmail(email);
        u.setPasswordHash(passwordEncoder.encode(plainPassword));
        u.setAge(age);
        u.setCity(city);
        u.setCountry(country);
        u.setDescription(desc);
        u.setGenres(genreService.getGenresByNameAndAddIfNecessary(genreNames));
        u.setInstruments(instrumentService.getInstrumentsByNameAndAddIfNecessary(instrumentNames));
        u.setRole("USER");
        return userRepository.save(u);
    }

    public Long updateUser(Long id, String name, Integer age, String city, String country, String desc, List<String> genreNames, List<String> instrumentNames){
       User u = userRepository.findById(id).orElse(null);
       if(u == null){return null;}

       if(name != null && !name.isBlank()){u.setName(name);}
       if(age != null){u.setAge(age);}
       if(city != null && !city.isBlank()){u.setCity(city);}
       if(country != null && !country.isBlank()){u.setCountry(country);}
       if(desc != null && !desc.isBlank()){u.setDescription(desc);}
       if(genreNames != null && !genreNames.isEmpty()){u.setGenres(genreService.getGenresByNameAndAddIfNecessary(genreNames));}
       if(instrumentNames != null && !instrumentNames.isEmpty()){u.setInstruments(instrumentService.getInstrumentsByNameAndAddIfNecessary(instrumentNames));}

       userRepository.save(u);
       return id;
    }

}