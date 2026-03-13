package xyz.wmmp.bandform_backend.controllers;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import xyz.wmmp.bandform_backend.data.User;
import xyz.wmmp.bandform_backend.repositories.UserRepository;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/data/users")
public class UserController {

    private final UserRepository userRepo;

    public UserController(UserRepository userRepository) {
        this.userRepo = userRepository;
    }

    @GetMapping("")
    List<User> findAll(){
        return userRepo.findAll();
    }

    @GetMapping("/{id}")
    User findById(@PathVariable Integer id){

        Optional<User> user = userRepo.findById(id);
        if(user.isEmpty()){
            throw new ResponseStatusException(HttpStatus.NOT_FOUND);
        }
        return user.get();
    }


    @ResponseStatus(HttpStatus.CREATED)
    @PostMapping("")
    void create(@RequestBody User user){
        userRepo.create(user);
    }

    @ResponseStatus(HttpStatus.NO_CONTENT)
    @PutMapping("/{id}")
    void update(@RequestBody User user, @PathVariable Integer id){
        userRepo.update(user, id);
    }

    @ResponseStatus(HttpStatus.NO_CONTENT)
    @DeleteMapping("/{id}")
    void delete(@PathVariable Integer id){
        userRepo.delete(id);
    }




}
