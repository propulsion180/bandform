package xyz.wmmp.bandform_backend.controllers;

import org.springframework.stereotype.Repository;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import xyz.wmmp.bandform_backend.data.Band;
import xyz.wmmp.bandform_backend.data.User;
import xyz.wmmp.bandform_backend.exceptions.BandNotFoundException;
import xyz.wmmp.bandform_backend.repositories.BandRepository;
import xyz.wmmp.bandform_backend.repositories.UserRepository;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/data/bands")
public class BandController {

    private final BandRepository bandRepo;
    private final UserRepository userRepo;

    public BandController(BandRepository bandRepository, UserRepository userRepository){
        this.bandRepo = bandRepository;
        this.userRepo = userRepository;
    }

    @GetMapping("")
    List<Band> findAll(){
        return bandRepo.findAll();
    }

    @GetMapping("/{id}")
    Band findById(@PathVariable Integer id){
        Optional<Band> optionalBand = bandRepo.findById(id);
        if(optionalBand.isEmpty()){
            throw new BandNotFoundException();
        }
        return optionalBand.get();
    }




}
