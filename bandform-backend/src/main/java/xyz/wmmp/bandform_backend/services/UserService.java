package xyz.wmmp.bandform_backend.services;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
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

    @Autowired
    public UserService(UserRepository userRepository, GenreRepository genreRepository, InstrumentRepository instrumentRepository, GenreService genreService, InstrumentService instrumentService){
        this.userRepository = userRepository;
        this.genreRepository = genreRepository;
        this.instrumentRepository = instrumentRepository;
        this.genreService = genreService;
        this.instrumentService = instrumentService;
    }

    public List<User> getAllUsers(){
        log.debug("All users requested");
        return userRepository.findAll();
    }

    public User getUserById(Long id){
        log.debug("User with id: {}, being retrieved", id);
        return userRepository.findById(id).orElse(null);
    }

    public boolean deleteUser(Long id){
        log.debug("Deleting user with id: {}", id);
        userRepository.deleteById(id);
        log.debug("Deleted!!");
        return true;
    }

    public User createUser(String name, Integer age, String city, String country, String desc, List<String> genreNames, List<String> instrumentNames){
        log.debug("Creating user");
        User u = new User();
        u.setName(name);
        u.setAge(age);
        u.setCity(city);
        u.setCountry(country);
        u.setDescription(desc);
        u.setGenres(genreService.getGenresByNameAndAddIfNecessary(genreNames));
        u.setInstruments(instrumentService.getInstrumentsByNameAndAddIfNecessary(instrumentNames));
        return userRepository.save(u);
    }

    public boolean updateUser(Long id, String name, Integer age, String city, String country, String desc, List<String> genreNames, List<String> instrumentNames){
       User u = userRepository.findById(id).orElse(null);
       if(u == null){return false;}

       if(name != null && !name.isBlank()){u.setName(name);}
       if(age != null){u.setAge(age);}
       if(city != null && !city.isBlank()){u.setCity(city);}
       if(country != null && !country.isBlank()){u.setCountry(country);}
       if(desc != null && !desc.isBlank()){u.setDescription(desc);}
       if(genreNames != null && !genreNames.isEmpty()){u.setGenres(genreService.getGenresByNameAndAddIfNecessary(genreNames));}
       if(instrumentNames != null && !instrumentNames.isEmpty()){u.setInstruments(instrumentService.getInstrumentsByNameAndAddIfNecessary(instrumentNames));}

       userRepository.save(u);
       return true;
    }

}