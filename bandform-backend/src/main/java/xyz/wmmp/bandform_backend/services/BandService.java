package xyz.wmmp.bandform_backend.services;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import xyz.wmmp.bandform_backend.data.Band;
import xyz.wmmp.bandform_backend.data.BandPosition;
import xyz.wmmp.bandform_backend.data.Genre;
import xyz.wmmp.bandform_backend.repositories.BandPositionRepository;
import xyz.wmmp.bandform_backend.repositories.BandRepository;
import xyz.wmmp.bandform_backend.repositories.GenreRepository;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class BandService {
    private static final Logger log = LoggerFactory.getLogger(BandService.class);
    private final BandRepository bandRepository;
    private final GenreRepository genreRepository;
    private final BandPositionRepository bandPositionRepository;
    private final GenreService genreService;

    @Autowired
    public BandService(BandRepository bandRepository, GenreRepository genreRepository, BandPositionRepository bandPositionRepository, GenreService genreService){
        this.bandRepository = bandRepository;
        this.genreRepository = genreRepository;
        this.bandPositionRepository = bandPositionRepository;
        this.genreService = genreService;
    }

    public List<Band> getAllBands(){
        log.debug("All bands requested");
        return bandRepository.findAll();
    }

    public Band getBandById(Long id){
        log.debug("User with id: {}, being retrieved", id);
        return bandRepository.findById(id).orElse(null);
    }

    public Boolean deleteUser(Long id){
        log.debug("Deleting band with id: {}", id);
        bandRepository.deleteById(id);
        log.debug("Deleted!!");
        return true;
    }

    public Band createBand(String name, String desc, String city, String country, List<String> genreNames){
        log.debug("Creating band named: {}", name);
        Band b = new Band();
        b.setName(name);
        b.setDescription(desc);
        b.setCity(city);
        b.setCountry(country);

        List<Genre> existingGenre = genreRepository.findByNameIn(genreNames);
        Set<String> existingGenreNames = existingGenre.stream().map(Genre::getName).collect(Collectors.toSet());
        List<String> missingGenreNames = genreNames.stream().filter(n -> !existingGenreNames.contains(n)).collect(Collectors.toList());

        List<Genre> newGenres = missingGenreNames.stream()
                .map(n -> {
                    Genre g = new Genre();
                    g.setName(n);
                    return g;
                }).collect(Collectors.toList());

        if(!newGenres.isEmpty()){
            genreRepository.saveAll(newGenres);
        }

        List<Genre> allG = new ArrayList<>(existingGenre);
        allG.addAll(newGenres);
        b.setGenres(allG);
        return bandRepository.save(b);
    }

    public Boolean updateBand(Long id, String name, String desc, String city, String country, List<String> genreNames){
        Band b = bandRepository.findById(id).orElse(null);
        if(b == null){return false;}

        if(name != null && !name.isBlank()){b.setName(name);}
        if(desc != null && !desc.isBlank()){b.setDescription(desc);}
        if(city != null && !city.isBlank()){b.setCity(city);}
        if(country != null && !country.isBlank()){b.setCountry(country);}
        if(genreNames != null && !genreNames.isEmpty()){b.setGenres(genreService.getGenresByNameAndAddIfNecessary(genreNames));}

        bandRepository.save(b);
        return true;
    }





}
