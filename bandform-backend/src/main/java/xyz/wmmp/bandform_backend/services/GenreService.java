package xyz.wmmp.bandform_backend.services;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import xyz.wmmp.bandform_backend.data.Genre;
import xyz.wmmp.bandform_backend.repositories.GenreRepository;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class GenreService {
    private static final Logger log = LoggerFactory.getLogger(GenreService.class);
    private final GenreRepository genreRepository;

    @Autowired
    public GenreService(GenreRepository genreRepository){
        this.genreRepository = genreRepository;
    }

    public List<Genre> getGenresByNameAndAddIfNecessary(List<String> genreNames){

        List<Genre> existingGenres = genreRepository.findByNameIn(genreNames);

        Set<String> existingGenresNames = existingGenres.stream().map(Genre::getName).collect(Collectors.toSet());

        List<String> missingGenreNames = genreNames.stream().filter(n -> !existingGenresNames.contains(n)).collect(Collectors.toList());

        List<Genre> newGenres = missingGenreNames.stream()
                .map(n -> {
                    Genre g = new Genre();
                    g.setName(n);
                    return g;
                })
                .collect(Collectors.toList());

        if (!newGenres.isEmpty()){
            genreRepository.saveAll(newGenres);
        }

        List<Genre> allG = new ArrayList<>(existingGenres);
        allG.addAll(newGenres);

        return allG;
    }
}
