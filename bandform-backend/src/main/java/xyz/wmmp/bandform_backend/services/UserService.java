package xyz.wmmp.bandform_backend.services;

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
    private final UserRepository userRepository;
    private final GenreRepository genreRepository;
    private final InstrumentRepository instrumentRepository;

    @Autowired
    public UserService(UserRepository userRepository, GenreRepository genreRepository, InstrumentRepository instrumentRepository){
        this.userRepository = userRepository;
        this.genreRepository = genreRepository;
        this.instrumentRepository = instrumentRepository;
    }

    public List<User> getAllUsers(){
        return userRepository.findAll();
    }

    public User getUserById(Long id){
        return userRepository.findById(id).orElse(null);
    }

    public User createUser(String name, String city, String country, String desc, List<String> genreNames, List<String> instrumentNames){
        User u = new User();
        u.setName(name);
        u.setCity(city);
        u.setCountry(country);
        u.setDescription(desc);

        List<Genre> existingGenres = genreRepository.findByNameIn(genreNames);
        List<Instrument> existingInstruments = instrumentRepository.findByNameIn(instrumentNames);

        Set<String> existingGenresNames = existingGenres.stream().map(Genre::getName).collect(Collectors.toSet());
        Set<String> existingInstrumentNames = existingInstruments.stream().map(Instrument::getName).collect(Collectors.toSet());

        List<String> missingGenreNames = genreNames.stream().filter(n -> !existingGenresNames.contains(n)).collect(Collectors.toList());
        List<String> missingInstrumentNames = instrumentNames.stream().filter(n -> !existingInstrumentNames.contains(n)).collect(Collectors.toList());

        List<Genre> newGenres = missingGenreNames.stream()
                .map(n -> {
                    Genre g = new Genre();
                    g.setName(n);
                    return g;
                })
                .collect(Collectors.toList());

        List<Instrument> newInstrument = missingInstrumentNames.stream()
                .map(n -> {
                    Instrument i = new Instrument();
                    i.setName(n);
                    return i;
                })
                .collect(Collectors.toList());

        if (!newGenres.isEmpty()){
            genreRepository.saveAll(newGenres);
        }

        if(!newInstrument.isEmpty()){
            instrumentRepository.saveAll(newInstrument);
        }

        List<Genre> allG = new ArrayList<>(existingGenres);
        allG.addAll(newGenres);
        u.setGenres(allG);

        List<Instrument> allI = new ArrayList<>(existingInstruments);
        allI.addAll(newInstrument);
        u.setInstruments(allI);

        return userRepository.save(u);
    }

}